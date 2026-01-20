# Build the project
npm run build

# Navigate into the build output directory
Set-Location dist

# Create a new Git repository in dist (if not already initialized)
git init
git add -A
git commit -m 'Deploy to GitHub Pages'

# Push to gh-pages branch
git push -f https://github.com/Kinnard77/ai-project-hub.git master:gh-pages

Set-Location ..

Write-Host "✅ Deployed to GitHub Pages!" -ForegroundColor Green
