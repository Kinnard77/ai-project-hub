# scripts/verify_pages_bundle.ps1
param(
    [string]$Url = "https://kinnard77.github.io/ai-project-hub/",
    [string]$SearchText = "PROG-016"
)

Write-Host "=== VERIFY PAGES BUNDLE ==="
Write-Host "Target: $Url"
Write-Host "Searching for: $SearchText"

try {
    # 1. Get Index HTML
    $response = Invoke-WebRequest -Uri $Url -UseBasicParsing
    $html = $response.Content

    # 2. Extract JS bundle path (looks for assets/index-*.js)
    if ($html -match 'assets/index-[a-zA-Z0-9]+\.js') {
        $bundlePath = $matches[0]
        $bundleUrl = "$Url$bundlePath"
        Write-Host "Found bundle: $bundleUrl"

        # 3. Fetch Bundle
        $jsResponse = Invoke-WebRequest -Uri $bundleUrl -UseBasicParsing
        $jsContent = $jsResponse.Content

        # 4. Search Text
        if ($jsContent.Contains($SearchText)) {
            Write-Host "SUCCESS: Found '$SearchText' in deployed bundle." -ForegroundColor Green
            exit 0
        } else {
            Write-Host "FAILURE: Text '$SearchText' NOT found in bundle." -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "FAILURE: Could not parse bundle path from HTML." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
    exit 1
}
