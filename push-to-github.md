# 🚀 Push AZBS Backend to GitHub

## Your Project is Ready!

✅ Git repository initialized
✅ All files committed (24 files, 4524+ lines)
✅ `.env` excluded (credentials safe)

---

## Step 1: Create Repository on GitHub

1. **Go to:** https://github.com/new
2. **Or click:** Your profile → Repositories → New

### Repository Settings:

```
Repository name:    azbs_backend
Description:        Node.js/Express REST API with PostgreSQL for managing Users, Guests, and Items
Visibility:         ☑ Public (or Private if you prefer)
☐ Initialize with:  DO NOT check any boxes (README, .gitignore, license)
                    Your project already has these files!
```

3. **Click:** "Create repository"

---

## Step 2: Push Your Code

After creating the repository, GitHub will show you commands. Use these instead:

### Option A: Using HTTPS (Recommended)

```bash
git remote add origin https://github.com/leighbillanski/azbs_backend.git
git branch -M main
git push -u origin main
```

### Option B: Using SSH (If you have SSH keys set up)

```bash
git remote add origin git@github.com:leighbillanski/azbs_backend.git
git branch -M main
git push -u origin main
```

---

## Step 3: Run the Commands

**Copy and paste these commands one by one in your terminal:**

```powershell
# Add the remote repository (use YOUR actual repo URL)
git remote add origin https://github.com/leighbillanski/azbs_backend.git

# Rename branch to main (GitHub standard)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note:** You may need to authenticate with GitHub when pushing. Use a Personal Access Token if prompted.

---

## 🎉 After Pushing

Your repository will be live at:
**https://github.com/leighbillanski/azbs_backend**

The repository will include:
- ✅ Full source code
- ✅ README with API documentation
- ✅ DEPLOYMENT guide for multiple platforms
- ✅ SETUP_COMPLETE guide
- ✅ .env.example template
- ✅ All documentation files

---

## Quick Commands Reference

```bash
# Check current remote
git remote -v

# Check current branch
git branch

# View commit history
git log --oneline

# Push future changes
git add .
git commit -m "Your commit message"
git push
```

---

## Troubleshooting

### If "git push" asks for authentication:

1. **Create a Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click: "Generate new token (classic)"
   - Select scopes: `repo` (full control)
   - Copy the token

2. **Use the token as your password** when prompted

### If remote already exists:

```bash
git remote remove origin
git remote add origin https://github.com/leighbillanski/azbs_backend.git
```

### If you want to change repository name:

- Change it on GitHub settings
- Update your local remote:
```bash
git remote set-url origin https://github.com/leighbillanski/NEW_NAME.git
```

---

## Next Steps After Pushing

1. **Add a Repository Description** on GitHub
2. **Add Topics/Tags:** nodejs, express, postgresql, rest-api, api
3. **Deploy to Render/Heroku** using the DEPLOYMENT.md guide
4. **Update README** with your deployed URL

---

## Your Project Structure on GitHub

```
azbs_backend/
├── 📄 README.md              ← Visitors see this first
├── 📄 DEPLOYMENT.md          ← Deployment instructions
├── 📄 SETUP_COMPLETE.md      ← Setup summary
├── 📄 .env.example           ← Environment template
├── 📁 config/                ← Database configuration
├── 📁 models/                ← Data models
├── 📁 controllers/           ← Business logic
├── 📁 routes/                ← API endpoints
└── 📄 server.js              ← Main entry point
```

---

**Ready to push? Run the commands in Step 3!** 🚀

