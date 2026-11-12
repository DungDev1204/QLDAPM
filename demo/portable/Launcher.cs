using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Web.Script.Serialization;
using System.Windows.Forms;

internal static class Launcher {
    static Process child;
    static bool childStarted;
    static NotifyIcon tray;
    static string dataDirectory;
    static string currentUrl;
    static readonly object LogLock = new object();

    [STAThread]
    static int Main(string[] args) {
        bool smoke = args.Length == 2 && args[0] == "--smoke-test";
        dataDirectory = smoke ? Path.GetFullPath(args[1]) :
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Nhom8TrafficDemo");
        try {
            Directory.CreateDirectory(dataDirectory);
            using (var mutex = new Mutex(false, @"Local\Nhom8TrafficDemo-" + HashText(dataDirectory))) {
                bool owns = false;
                try {
                    try { owns = mutex.WaitOne(0); } catch (AbandonedMutexException) { owns = true; }
                    if (!owns) {
                        string running = WaitForExisting();
                        if (running == null) throw new Exception("Demo đang khởi động. Vui lòng thử mở lại sau ít giây.");
                        if (!smoke) OpenBrowser(running);
                        return 0;
                    }
                    string runtime = ExtractPayload();
                    string token = Guid.NewGuid().ToString("N");
                    var start = new ProcessStartInfo(Path.Combine(runtime, "runtime", "node.exe"));
                    start.Arguments = "--no-warnings " + Quote(Path.Combine(runtime, "app", "portable", "runner.mjs")) +
                        " " + Quote(dataDirectory) + " " + token + " " + BuildInfo.Revision;
                    start.WorkingDirectory = Path.Combine(runtime, "app");
                    start.UseShellExecute = false;
                    start.CreateNoWindow = true;
                    start.WindowStyle = ProcessWindowStyle.Hidden;
                    start.RedirectStandardOutput = true;
                    start.RedirectStandardError = true;
                    start.EnvironmentVariables["NODE_OPTIONS"] = "";
                    child = new Process { StartInfo = start };
                    child.OutputDataReceived += (s,e) => { if (e.Data != null) Log(e.Data); };
                    child.ErrorDataReceived += (s,e) => { if (e.Data != null) Log(e.Data); };
                    child.Start();
                    childStarted = true;
                    child.BeginOutputReadLine();
                    child.BeginErrorReadLine();
                    currentUrl = WaitForReady(token);
                    if (currentUrl == null) throw new Exception("Không khởi động được demo. Xem launcher.log tại " + dataDirectory);
                    if (smoke) {
                        SmokeTest(currentUrl, runtime);
                        return 0;
                    }
                    Application.EnableVisualStyles();
                    var menu = new ContextMenuStrip();
                    menu.Items.Add("Mở web demo", null, (s,e) => OpenBrowser(currentUrl));
                    menu.Items.Add("Tắt demo", null, (s,e) => Application.Exit());
                    tray = new NotifyIcon { Icon = SystemIcons.Application, Text = "Nhóm 8 · Demo giao thông",
                        ContextMenuStrip = menu, Visible = true };
                    tray.DoubleClick += (s,e) => OpenBrowser(currentUrl);
                    var timer = new System.Windows.Forms.Timer { Interval = 1000 };
                    timer.Tick += (s,e) => { if (child.HasExited) Application.Exit(); };
                    timer.Start();
                    OpenBrowser(currentUrl);
                    tray.ShowBalloonTip(4000, "Demo Nhóm 8 đã mở", "Để tắt: chuột phải biểu tượng ở khay hệ thống → Tắt demo.", ToolTipIcon.Info);
                    Application.Run();
                    timer.Dispose();
                    return 0;
                } finally {
                    if (tray != null) { tray.Visible = false; tray.Dispose(); }
                    if (child != null) { if (childStarted && !child.HasExited) { child.Kill(); child.WaitForExit(5000); } child.Dispose(); }
                    if (owns) mutex.ReleaseMutex();
                }
            }
        } catch (Exception error) {
            Log(error.ToString());
            if (!smoke) MessageBox.Show(error.Message, "Demo Nhóm 8", MessageBoxButtons.OK, MessageBoxIcon.Error);
            return 1;
        }
    }

    static string ExtractPayload() {
        string destination = Path.Combine(dataDirectory, "versions", BuildInfo.Revision);
        string complete = Path.Combine(destination, ".complete");
        if (File.Exists(complete) && File.Exists(Path.Combine(destination,"runtime","node.exe")) &&
            File.Exists(Path.Combine(destination,"app","portable","runner.mjs"))) return destination;
        Directory.CreateDirectory(destination);
        using (var resource = Assembly.GetExecutingAssembly().GetManifestResourceStream("Nhom8.Payload.zip"))
        using (var archive = new ZipArchive(resource, ZipArchiveMode.Read)) {
            string root = Path.GetFullPath(destination) + Path.DirectorySeparatorChar;
            foreach (var entry in archive.Entries) {
                string target = Path.GetFullPath(Path.Combine(destination, entry.FullName));
                if (!target.StartsWith(root, StringComparison.OrdinalIgnoreCase)) throw new Exception("Invalid package path.");
                if (String.IsNullOrEmpty(entry.Name)) { Directory.CreateDirectory(target); continue; }
                Directory.CreateDirectory(Path.GetDirectoryName(target));
                using (var input = entry.Open())
                using (var output = File.Create(target)) input.CopyTo(output);
            }
        }
        File.WriteAllText(complete, BuildInfo.Revision);
        return destination;
    }

    static string ReadyUrl(string expectedToken) {
        try {
            string[] lines = File.ReadAllLines(Path.Combine(dataDirectory,"ready.txt"));
            if (lines.Length != 4 || (expectedToken != null && lines[1] != expectedToken)) return null;
            Uri uri;
            if (!Uri.TryCreate(lines[0], UriKind.Absolute, out uri) || uri.Scheme != "http" ||
                uri.Host != "127.0.0.1" || uri.AbsolutePath != "/") return null;
            var request = (HttpWebRequest)WebRequest.Create(uri);
            request.Timeout = 1200;
            request.AllowAutoRedirect = false;
            using (var response = (HttpWebResponse)request.GetResponse()) {
                if (response.StatusCode == HttpStatusCode.OK && response.Headers["X-Nhom8-Instance"] == lines[1]) return lines[0];
            }
        } catch { }
        return null;
    }

    static string WaitForExisting() {
        var clock = Stopwatch.StartNew();
        while (clock.ElapsedMilliseconds < 30000) { string url = ReadyUrl(null); if (url != null) return url; Thread.Sleep(200); }
        return null;
    }
    static string WaitForReady(string token) {
        var clock = Stopwatch.StartNew();
        while (clock.ElapsedMilliseconds < 30000) {
            if (child.HasExited) return null;
            string url = ReadyUrl(token); if (url != null) return url;
            Thread.Sleep(100);
        }
        return null;
    }

    static void SmokeTest(string url, string runtime) {
        var cookies = new CookieContainer();
        var login = (HttpWebRequest)WebRequest.Create(url + "api/login");
        login.Method = "POST"; login.ContentType = "application/json"; login.CookieContainer = cookies; login.Timeout = 10000;
        byte[] body = Encoding.UTF8.GetBytes("{\"username\":\"demo\",\"password\":\"Demo@123\"}");
        login.ContentLength = body.Length;
        using (var output = login.GetRequestStream()) output.Write(body,0,body.Length);
        using (var response = login.GetResponse()) { }
        var traffic = (HttpWebRequest)WebRequest.Create(url + "api/traffic");
        traffic.CookieContainer = cookies; traffic.Timeout = 10000;
        string json;
        using (var response = traffic.GetResponse())
        using (var reader = new StreamReader(response.GetResponseStream())) json = reader.ReadToEnd();
        var serializer = new JavaScriptSerializer();
        dynamic data = serializer.DeserializeObject(json);
        var features = (object[])data["features"];
        if (features.Length != 10) throw new Exception("Expected 10 traffic roads.");
        foreach (dynamic feature in features)
            if ((string)feature["geometry"]["type"] != "MultiLineString") throw new Exception("OSM geometry is missing.");
        foreach (string asset in new[] {"app.js", "map-geometry.js", "vendor/leaflet.js", "vendor/leaflet.css"}) {
            using (var response = WebRequest.Create(url + asset).GetResponse()) { }
        }
        File.WriteAllText(Path.Combine(dataDirectory,"smoke-result.json"), serializer.Serialize(new {
            ok = true, roads = features.Length, url, runtime, revision = BuildInfo.Revision,
            bundledNode = child.StartInfo.FileName, path = Environment.GetEnvironmentVariable("PATH")
        }), Encoding.UTF8);
    }
    static void OpenBrowser(string url) { Process.Start(new ProcessStartInfo(url) { UseShellExecute = true }); }
    static string Quote(string value) { return "\"" + value + "\""; }
    static string HashText(string text) {
        using (var hash = SHA256.Create()) return BitConverter.ToString(hash.ComputeHash(Encoding.UTF8.GetBytes(text))).Replace("-", "").Substring(0,20);
    }
    static void Log(string message) {
        lock (LogLock) { try { File.AppendAllText(Path.Combine(dataDirectory,"launcher.log"), DateTime.Now.ToString("s") + " " + message + Environment.NewLine); } catch { } }
    }
}
