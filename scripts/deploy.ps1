Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ROOT = Join-Path $PSScriptRoot ".."
Set-Location $ROOT

Write-Host "--- THE AI PROJECTS HUB - DEPLOY ---"
Write-Host ""

# 1. SYNC
Write-Host "[1/3] Sincronizando datos desde tasks.md..."
try {
    npx tsx scripts/sync_status_from_tasks.ts
} catch {
    Write-Host "ERROR en sync. Deploy cancelado." -ForegroundColor Red
    exit 1
}

Write-Host ""

# 2. CHECK
$changes = git diff --name-only
if ($changes -eq $null -or $changes -eq "") {
    Write-Host "Sin cambios. Nada que deployar."
    exit 0
}

Write-Host "[2/3] Cambios detectados:"
git diff --stat
Write-Host ""

# 3. COMMIT + PUSH
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
$commitMsg = "sync: actualiza status.json desde tasks.md [$timestamp]"

Write-Host "[3/3] Commit + Push..."
git add src/data/status.json scripts/sync_audit.log
git commit -m $commitMsg
git push origin main

Write-Host ""
Write-Host "Deploy exitoso. GitHub Pages se actualiza."
