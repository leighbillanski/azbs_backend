# Quick Start for Cursor Agent (Frontend)

## 🤖 **For AI Agent: Git Workflow**

Your SSH authentication is already set up. Just follow these steps:

---

## ⚡ **Quick Workflow**

```bash
# 1. Check status
git status

# 2. Stage all changes
git add .

# 3. Commit
git commit -m "Your descriptive message here"

# 4. Push
git push
```

**Done! That's it.** ✅

---

## 🔑 **Your GitHub Info**

- **User:** `leighbillanski`
- **SSH Key:** Already configured at `~/.ssh/id_ed25519`
- **Authentication:** ✅ Working (no password needed)

---

## 🆕 **First Time Setup (New Repository)**

```bash
# In your frontend project directory:
git init
git remote add origin git@github.com:leighbillanski/YOUR-REPO-NAME.git
git branch -M main
git add .
git commit -m "Initial commit"
git push -u origin main
```

---

## ⚠️ **Important: Never Commit**

- ❌ `.env` files
- ❌ `node_modules/`
- ❌ API keys or passwords
- ❌ `dist/` or `build/` folders

---

## 🔍 **Verify Success**

```bash
git status
# Should say: "Your branch is up to date with 'origin/main'"
```

---

## 📖 **Full Documentation**

See `FRONTEND_GIT_INSTRUCTIONS.md` for complete details.

---

**Your SSH is ready. Just add, commit, push!** 🚀

