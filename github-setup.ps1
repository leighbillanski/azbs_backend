# GitHub Setup Script for AZBS Backend
# Run this after creating your repository on GitHub

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  AZBS Backend - GitHub Setup" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Repository details
$repoName = "azbs_backend"
$username = "leighbillanski"
$repoUrl = "https://github.com/$username/$repoName.git"

Write-Host "Repository: " -NoNewline
Write-Host "$username/$repoName" -ForegroundColor Yellow
Write-Host "URL: " -NoNewline
Write-Host "$repoUrl`n" -ForegroundColor Yellow

# Check if already has remote
$hasRemote = git remote -v 2>$null
if ($hasRemote) {
    Write-Host "⚠️  Remote already exists. Removing..." -ForegroundColor Yellow
    git remote remove origin
}

Write-Host "`n📡 Adding remote repository..." -ForegroundColor Green
git remote add origin $repoUrl

Write-Host "🔄 Renaming branch to main..." -ForegroundColor Green
git branch -M main

Write-Host "`n✅ Setup complete! Ready to push.`n" -ForegroundColor Green

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n1. Create repository on GitHub:" -ForegroundColor White
Write-Host "   Go to: https://github.com/new" -ForegroundColor Gray
Write-Host "   Name: $repoName" -ForegroundColor Gray
Write-Host "   ☐ DO NOT initialize with README" -ForegroundColor Gray

Write-Host "`n2. Push your code:" -ForegroundColor White
Write-Host "   git push -u origin main`n" -ForegroundColor Yellow

Write-Host "========================================`n" -ForegroundColor Cyan

# Ask if user wants to push now
$push = Read-Host "Do you want to push now? (y/n)"
if ($push -eq "y" -or $push -eq "Y") {
    Write-Host "`n🚀 Pushing to GitHub..." -ForegroundColor Green
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Successfully pushed to GitHub!" -ForegroundColor Green
        Write-Host "View your repository: https://github.com/$username/$repoName`n" -ForegroundColor Cyan
    } else {
        Write-Host "`n❌ Push failed. Make sure:" -ForegroundColor Red
        Write-Host "   - Repository exists on GitHub" -ForegroundColor Yellow
        Write-Host "   - You're authenticated (use Personal Access Token)" -ForegroundColor Yellow
        Write-Host "   - Repository name matches: $repoName`n" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n📝 When ready, run: git push -u origin main`n" -ForegroundColor Cyan
}

