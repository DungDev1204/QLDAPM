$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath (Join-Path $PSScriptRoot 'demo')
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Can cai Node.js 22.13 tro len de chay demo.' }
if (-not (Test-Path -LiteralPath 'node_modules/leaflet/dist/leaflet.js')) {
    npm.cmd ci
    if ($LASTEXITCODE -ne 0) { throw 'Khong cai duoc thu vien. Kiem tra ket noi mang va chay lai.' }
}
Write-Host 'Mo http://localhost:3000 - tai khoan demo / Demo@123'
npm.cmd start
