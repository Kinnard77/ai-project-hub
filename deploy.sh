#!/bin/bash

# Build the project
npm run build

# Navigate into the build output directory
cd dist

# Create a new Git repository in dist (if not already initialized)
git init
git add -A
git commit -m 'Deploy to GitHub Pages'

# Push to gh-pages branch
git push -f git@github.com:TU_USUARIO/ai-project-hub.git main:gh-pages

cd -

echo "✅ Deployed to GitHub Pages!"
