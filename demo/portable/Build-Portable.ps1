param([string]$NodeVersion = '22.23.0')
$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$work = Join-Path $projectRoot ('tmp/portable-build/' + [guid]::NewGuid().ToString('N'))
$output = Join-Path $projectRoot 'outputs/demo-thuyet-trinh'
$payload = Join-Path $work 'payload'
New-Item -ItemType Directory -Path $work,$output,(Join-Path $payload 'runtime'),(Join-Path $payload 'app') -Force | Out-Null

Write-Host 'Downloading the official portable Node.js runtime...'
$archiveName = "node-v$NodeVersion-win-x64.zip"
$archivePath = Join-Path $work $archiveName
$baseUrl = "https://nodejs.org/dist/v$NodeVersion"
Invoke-WebRequest -UseBasicParsing -Uri "$baseUrl/$archiveName" -OutFile $archivePath
$checksums = (Invoke-WebRequest -UseBasicParsing -Uri "$baseUrl/SHASUMS256.txt").Content
$line = ($checksums -split "`n" | Where-Object { $_.Trim().EndsWith(" $archiveName") })
if (-not $line) { throw 'Official checksum entry is missing.' }
$expected = ($line.Trim() -split '\s+')[0]
if ((Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash.ToLowerInvariant() -ne $expected.ToLowerInvariant()) {
    throw 'Downloaded Node.js checksum does not match.'
}
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [IO.Compression.ZipFile]::OpenRead($archivePath)
try {
    foreach ($name in @('node.exe','LICENSE')) {
        $entry = $archive.GetEntry("node-v$NodeVersion-win-x64/$name")
        if (-not $entry) { throw "Missing Node.js file: $name" }
        [IO.Compression.ZipFileExtensions]::ExtractToFile($entry,(Join-Path $payload "runtime/$name"))
    }
} finally { $archive.Dispose() }

$demo = Join-Path $projectRoot 'demo'
$app = Join-Path $payload 'app'
Copy-Item -LiteralPath (Join-Path $demo 'server.mjs'),(Join-Path $demo 'package.json') -Destination $app
Copy-Item -LiteralPath (Join-Path $demo 'src'),(Join-Path $demo 'public') -Destination $app -Recurse
New-Item -ItemType Directory -Path (Join-Path $app 'portable'),(Join-Path $app 'node_modules/leaflet/dist') -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'runner.mjs') -Destination (Join-Path $app 'portable')
$leaflet = Join-Path $demo 'node_modules/leaflet'
foreach ($name in @('leaflet.js','leaflet.css','images')) {
    Copy-Item -LiteralPath (Join-Path $leaflet "dist/$name") -Destination (Join-Path $app 'node_modules/leaflet/dist') -Recurse
}
Copy-Item -LiteralPath (Join-Path $leaflet 'LICENSE') -Destination (Join-Path $app 'node_modules/leaflet')
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'HUONG_DAN.txt') -Destination $payload
# No existing SQLite database, sessions, user files or development tools enter the package.
$payloadZip = Join-Path $work 'payload.zip'
[IO.Compression.ZipFile]::CreateFromDirectory($payload,$payloadZip,[IO.Compression.CompressionLevel]::Optimal,$false)
$revision = (Get-FileHash -LiteralPath $payloadZip -Algorithm SHA256).Hash.ToLowerInvariant().Substring(0,20)
$buildInfo = Join-Path $work 'BuildInfo.cs'
[IO.File]::WriteAllText($buildInfo,"internal static class BuildInfo { public const string Revision = `"$revision`"; }",[Text.Encoding]::UTF8)
$compiler = Join-Path $env:WINDIR 'Microsoft.NET/Framework64/v4.0.30319/csc.exe'
if (-not (Test-Path -LiteralPath $compiler)) { throw 'The Windows .NET Framework C# compiler was not found.' }
$executable = Join-Path $output 'Mo_Demo_Nhom8.exe'
Write-Host 'Building the single-file Windows launcher...'
& $compiler /nologo /codepage:65001 /target:winexe /platform:x64 /optimize+ "/out:$executable" "/resource:$payloadZip,Nhom8.Payload.zip" /reference:System.Windows.Forms.dll /reference:System.Drawing.dll /reference:System.IO.Compression.dll /reference:System.IO.Compression.FileSystem.dll /reference:System.Web.Extensions.dll /reference:Microsoft.CSharp.dll (Join-Path $PSScriptRoot 'Launcher.cs') $buildInfo
if ($LASTEXITCODE -ne 0) { throw 'Launcher compilation failed.' }
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'HUONG_DAN.txt') -Destination $output -Force
$hash = (Get-FileHash -LiteralPath $executable -Algorithm SHA256).Hash.ToLowerInvariant()
[IO.File]::WriteAllText((Join-Path $output 'SHA256.txt'),"$hash  Mo_Demo_Nhom8.exe`r`n",[Text.Encoding]::ASCII)
Write-Host "Ready: $executable"
Get-Item -LiteralPath $executable | Select-Object FullName,Length
