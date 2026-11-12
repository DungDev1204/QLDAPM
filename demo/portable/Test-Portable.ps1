param([string]$Executable)
$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
if (-not $Executable) { $Executable = Join-Path $projectRoot 'outputs/demo-thuyet-trinh/Mo_Demo_Nhom8.exe' }
$taskTestRoot = Join-Path $projectRoot ('tmp/portable-smoke/Máy thuyết trình ' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $taskTestRoot -Force | Out-Null
$taskCopiedExe = Join-Path $taskTestRoot 'Mo_Demo_Nhom8.exe'
Copy-Item -LiteralPath $Executable -Destination $taskCopiedExe
$taskData = Join-Path $taskTestRoot 'Dữ liệu riêng'
$taskSavedPath = $env:PATH
try {
    # Launch the copied executable without the project's source, node or npm in PATH.
    $env:PATH = Join-Path $env:WINDIR 'System32'
    foreach ($attempt in 1..2) {
        $process = Start-Process -FilePath $taskCopiedExe -ArgumentList ('--smoke-test "' + $taskData + '"') -WindowStyle Hidden -Wait -PassThru
        if ($process.ExitCode -ne 0) {
            $log = Join-Path $taskData 'launcher.log'
            if (Test-Path -LiteralPath $log) { Get-Content -LiteralPath $log -Encoding UTF8 }
            throw "Portable smoke test failed on launch $attempt."
        }
        $result = Get-Content -LiteralPath (Join-Path $taskData 'smoke-result.json') -Raw -Encoding UTF8 | ConvertFrom-Json
        if (-not $result.ok -or $result.roads -ne 10) { throw 'Portable smoke result is invalid.' }
        $ready = Get-Content -LiteralPath (Join-Path $taskData 'ready.txt') -Encoding UTF8
        if (Get-Process -Id ([int]$ready[2]) -ErrorAction SilentlyContinue) { throw 'Bundled server did not stop after smoke test.' }
        Write-Host "PASS launch $attempt : login, 10 OSM roads, local assets, server shutdown; no node/npm in PATH."
    }
} finally { $env:PATH = $taskSavedPath }
Write-Host "Evidence: $(Join-Path $taskData 'smoke-result.json')"
