# Git Instructions for Cursor Agent (Frontend App)

## 📋 **Instructions for AI Agent Working on Frontend**

This guide helps a Cursor AI agent commit and push code to GitHub for the frontend application.

---

## 🔑 **SSH Key Information**

**Your SSH keys are already set up:**
- **Private Key:** `C:\Users\johkay01\.ssh\id_ed25519`
- **Public Key:** `C:\Users\johkay01\.ssh\id_ed25519.pub`
- **GitHub User:** `leighbillanski`
- **Status:** ✅ Already authenticated with GitHub

---

## 🚀 **Quick Start: Initial Setup (If Repository Doesn't Exist)**

### **Step 1: Initialize Git Repository**

```bash
# Navigate to frontend project directory
cd /path/to/your/frontend/project

# Initialize git (if not already initialized)
git init

# Check status
git status
```

### **Step 2: Create Repository on GitHub**

**Two Options:**

#### **Option A: User Creates Manually**
1. User goes to: https://github.com/new
2. Repository name: `your-frontend-name`
3. **⚠️ DO NOT** check "Initialize with README"
4. Click "Create repository"

#### **Option B: Using GitHub CLI (if installed)**
```bash
gh repo create your-frontend-name --public --source=. --remote=origin
```

### **Step 3: Connect to GitHub Repository**

```bash
# Add remote (replace with actual repository name)
git remote add origin git@github.com:leighbillanski/your-frontend-name.git

# Verify remote
git remote -v
```

---

## 📝 **Standard Git Workflow: Commit & Push**

### **Step 1: Check Current Status**

```bash
# See what files have changed
git status

# See detailed changes
git diff
```

### **Step 2: Stage Files**

```bash
# Add all changed files
git add .

# Or add specific files
git add src/components/MyComponent.tsx
git add src/styles/main.css

# Or add files by pattern
git add src/**/*.tsx
```

### **Step 3: Commit Changes**

```bash
# Commit with descriptive message
git commit -m "Add user authentication feature"

# Or multi-line commit message
git commit -m "Add user authentication feature

- Implement login form
- Add JWT token handling
- Create protected routes
- Add user context provider"
```

### **Step 4: Push to GitHub**

```bash
# First time push (sets upstream)
git push -u origin main

# Subsequent pushes
git push
```

---

## 🔄 **Common Scenarios**

### **Scenario 1: Starting Fresh (New Repository)**

```bash
# 1. Navigate to project
cd /path/to/frontend/project

# 2. Initialize git
git init

# 3. Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
.DS_Store
dist/
build/
.vscode/
*.log
EOF

# 4. Initial commit
git add .
git commit -m "Initial commit: Frontend application setup"

# 5. Add remote (after creating repo on GitHub)
git remote add origin git@github.com:leighbillanski/frontend-app.git

# 6. Rename branch to main
git branch -M main

# 7. Push to GitHub
git push -u origin main
```

### **Scenario 2: Making Changes to Existing Repository**

```bash
# 1. Check status
git status

# 2. Pull latest changes (if working with others)
git pull

# 3. Make your code changes
# ... (AI makes changes) ...

# 4. Stage and commit
git add .
git commit -m "Update navigation component styling"

# 5. Push
git push
```

### **Scenario 3: Cloning Existing Repository**

```bash
# 1. Clone repository
git clone git@github.com:leighbillanski/frontend-app.git

# 2. Navigate into it
cd frontend-app

# 3. Make changes, then commit and push as normal
git add .
git commit -m "Your changes"
git push
```

---

## 🛠️ **Important Git Commands Reference**

### **Checking Status**
```bash
# See current status
git status

# See commit history
git log --oneline -10

# See remote configuration
git remote -v

# See current branch
git branch
```

### **Before Committing**
```bash
# See what changed
git diff

# See staged changes
git diff --staged

# Unstage files if needed
git restore --staged filename.ts
```

### **Branch Management**
```bash
# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# List all branches
git branch -a

# Delete branch
git branch -d feature/old-feature
```

---

## ⚠️ **Important Rules for AI Agent**

### **DO:**
- ✅ Always check `git status` before committing
- ✅ Write clear, descriptive commit messages
- ✅ Stage only relevant files
- ✅ Pull before pushing (if working with others)
- ✅ Respect `.gitignore` rules

### **DO NOT:**
- ❌ Commit `.env` files (secrets/credentials)
- ❌ Commit `node_modules/` directory
- ❌ Commit build artifacts (`dist/`, `build/`)
- ❌ Force push unless explicitly requested (`git push --force`)
- ❌ Commit large binary files
- ❌ Skip verification steps

---

## 📋 **Typical Workflow for AI Agent**

```bash
# 1. Verify you're in the right directory
pwd

# 2. Check current status
git status

# 3. Make your code changes
# ... (AI edits files) ...

# 4. Review changes
git diff

# 5. Stage changes
git add .

# 6. Commit with descriptive message
git commit -m "Descriptive message about changes"

# 7. Push to GitHub
git push

# 8. Confirm success
git status
```

---

## 🔍 **Verification Steps**

### **After Push - Verify Success:**

```bash
# 1. Check git status
git status
# Expected: "Your branch is up to date with 'origin/main'"

# 2. Check last commit
git log --oneline -1

# 3. Verify remote
git remote -v
```

### **View on GitHub:**
- Go to: `https://github.com/leighbillanski/your-repo-name`
- Check: Latest commit should appear
- Verify: Code changes are visible

---

## 🚨 **Troubleshooting**

### **Issue: "Permission denied (publickey)"**
```bash
# Test SSH connection
ssh -T git@github.com

# Expected: "Hi leighbillanski! You've successfully authenticated..."
```

### **Issue: "Repository not found"**
```bash
# Check remote URL
git remote -v

# Update remote if wrong
git remote set-url origin git@github.com:leighbillanski/correct-repo-name.git
```

### **Issue: "Merge conflicts"**
```bash
# Pull with rebase
git pull --rebase

# Or pull normally and resolve conflicts
git pull
# ... resolve conflicts in files ...
git add .
git commit -m "Resolve merge conflicts"
git push
```

### **Issue: "Untracked files present"**
```bash
# See untracked files
git status

# Add to .gitignore if they shouldn't be tracked
echo "filename.txt" >> .gitignore

# Or add them if they should be tracked
git add filename.txt
```

---

## 📄 **Sample .gitignore for Frontend Projects**

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production builds
dist/
build/
.next/
out/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
*.log

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# OS files
Thumbs.db

# Temporary files
*.tmp
.cache/
.temp/
```

---

## 🎯 **Commit Message Best Practices**

### **Good Commit Messages:**
```bash
git commit -m "Add user authentication modal"
git commit -m "Fix: Resolve navigation menu overlap issue"
git commit -m "Update: Improve button hover animations"
git commit -m "Refactor: Extract header component logic"
```

### **Bad Commit Messages:**
```bash
git commit -m "changes"
git commit -m "fix stuff"
git commit -m "update"
git commit -m "wip"
```

### **Message Format:**
```
Type: Short description (50 chars or less)

Longer explanation if needed (wrap at 72 characters)
- Bullet points for multiple changes
- Use present tense ("Add feature" not "Added feature")
```

---

## 🔐 **Security Checklist**

Before committing, ensure:
- [ ] No API keys in code
- [ ] No passwords or secrets
- [ ] No `.env` files (use `.env.example` instead)
- [ ] No database credentials
- [ ] No private keys or certificates
- [ ] No personal information

---

## 📊 **Complete Example Workflow**

```bash
# Starting with frontend project
cd /path/to/frontend/project

# 1. Check status
git status

# 2. Make changes (AI edits files)
# Edit: src/components/Header.tsx
# Edit: src/styles/header.css

# 3. See what changed
git diff

# 4. Stage changes
git add src/components/Header.tsx src/styles/header.css

# 5. Commit with message
git commit -m "Update header component with responsive design

- Add mobile menu toggle
- Improve tablet layout
- Update color scheme
- Fix logo alignment"

# 6. Push to GitHub
git push

# 7. Verify
git status
# Output: "Your branch is up to date with 'origin/main'"

# 8. Check on GitHub
# Visit: https://github.com/leighbillanski/frontend-app
```

---

## 📚 **Quick Reference Commands**

```bash
# Essential commands for AI agent:
git status              # Check current state
git add .               # Stage all changes
git commit -m "msg"     # Commit with message
git push                # Push to GitHub
git pull                # Get latest changes
git log --oneline -5    # See recent commits
git diff                # See changes
git remote -v           # Check remote
```

---

## ✅ **Success Indicators**

You'll know everything worked when:
1. ✅ `git push` completes without errors
2. ✅ `git status` shows "up to date with 'origin/main'"
3. ✅ Changes appear on GitHub website
4. ✅ Commit appears in repository history

---

## 🤖 **Instructions Summary for AI Agent**

**For every code change session:**

1. Run `git status` to check current state
2. Make your code changes
3. Run `git add .` to stage changes
4. Run `git commit -m "Clear description of changes"`
5. Run `git push` to upload to GitHub
6. Run `git status` to verify success

**Your SSH key is already configured - no authentication needed!**

---

## 📞 **Need Help?**

If you encounter issues:
1. Check the Troubleshooting section above
2. Run `git status` to see current state
3. Run `ssh -T git@github.com` to test connection
4. Check GitHub repository exists and URL is correct

---

**This guide covers everything a Cursor AI agent needs to successfully commit and push code to GitHub!** 🚀

