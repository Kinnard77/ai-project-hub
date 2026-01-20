# Build the project
npm run build

# Navigate into the build output directory
Set-Location dist

# Create a new Git repository in dist (if not already initialized)
git init
git add -A
git commit -m 'Deploy to GitHub Pages'

# Push to gh-pages branch (reemplaza TU_USUARIO con tu usuario de GitHub)
git push -f https://github.com/TU_USUARIO/ai-project-hub.git main:gh-pages

Set-Location ..

Write-Host "✅ Deployed to GitHub Pages!" -ForegroundColor Green
