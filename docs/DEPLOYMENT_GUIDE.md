# Deployment Guide - Hybrid CPU Architecture Project

**Complete step-by-step guide to deploy your project to GitHub and Vercel**

---

## 🎯 Deployment Goals

1. ✅ Host code on GitHub (public repository)
2. ✅ Deploy live website to Vercel (free hosting)
3. ✅ Add cross-links between GitHub and website
4. ✅ Make project accessible worldwide

---

## 📋 Prerequisites

- Git installed on your computer
- GitHub account (free): https://github.com/signup
- Vercel account (free): https://vercel.com/signup

---

## Part 1: GitHub Repository Setup

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in details:
   - **Repository name**: `hybrid-cpu-architecture`
   - **Description**: "Hybrid Architecture (RISC + CISC) CPU Simulation - Lahore Garrison University"
   - **Visibility**: Public ✓
   - **Initialize**: Do NOT check any boxes (we have files already)
3. Click **"Create repository"**

### Step 2: Push Your Code to GitHub

Open your terminal and run these commands:

```bash
# Navigate to your project directory
cd "/home/junaid/Desktop/project computer architectture ok "

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Hybrid CPU Architecture Project

- Implemented RISC, CISC, and Hybrid architectures
- Hybrid achieves 6 cycles (winner!)
- 5-stage pipeline with L1/L2 cache
- Instruction translator with micro-op fusion
- Complete documentation and web simulator

Lahore Garrison University - Computer Architecture Project"

# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/hybrid-cpu-architecture.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Verify on GitHub

1. Go to `https://github.com/YOUR_USERNAME/hybrid-cpu-architecture`
2. You should see all your files!
3. README.md will be displayed automatically

### Step 4: Update Repository Settings

1. Go to repository → **Settings** → **Pages**
2. Under "Source", select:
   - Branch: `main`
   - Folder: `/frontend`
3. Click **Save**
4. Wait 2-3 minutes
5. Your site will be live at: `https://YOUR_USERNAME.github.io/hybrid-cpu-architecture/`

---

## Part 2: Vercel Deployment (Recommended)

### Step 1: Sign Up for Vercel

1. Go to https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub

### Step 2: Import Your Project

1. From Vercel dashboard, click **"Add New..."** → **"Project"**
2. Click **"Import"** next to your `hybrid-cpu-architecture` repository
3. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `.` (leave as is)
   - **Build Command**: Leave empty
   - **Output Directory**: `frontend`
   - **Install Command**: Leave empty

4. Click **"Deploy"**

### Step 3: Wait for Deployment

- Vercel will build and deploy (takes 1-2 minutes)
- Once done, you'll see: "🎉 Congratulations!"
- Your live URL: `https://hybrid-cpu-architecture.vercel.app` (or similar)

### Step 4: Custom Domain (Optional)

If you want a custom domain:
1. Go to Project → **Settings** → **Domains**
2. Add your domain
3. Follow DNS configuration instructions

---

## Part 3: Add Cross-Links

### Update Frontend HTML

Edit `frontend/index.html`, find the header section and update:

```html
<header>
    <h1>🖥️ Hybrid CPU Architecture Simulator</h1>
    <p class="subtitle">Dual-Core System: RISC + CISC with 5-Stage Pipeline & Cache Hierarchy</p>
    <p class="university">Lahore Garrison University</p>
    <a href="https://github.com/YOUR_USERNAME/hybrid-cpu-architecture" target="_blank" class="github-link">
        📂 View on GitHub
    </a>
</header>
```

And in the footer:

```html
<footer>
    <p>Lahore Garrison University - Computer Architecture Project</p>
    <p>
        <a href="https://github.com/YOUR_USERNAME/hybrid-cpu-architecture">GitHub</a> |
        <a href="https://hybrid-cpu-architecture.vercel.app">Live Demo</a>
    </p>
</footer>
```

### Update README.md

Edit your `README.md` to add:

```markdown
## 🌐 Live Demo

**🚀 Try it now**: [https://hybrid-cpu-architecture.vercel.app](https://hybrid-cpu-architecture.vercel.app)

**📂 Source Code**: [https://github.com/YOUR_USERNAME/hybrid-cpu-architecture](https://github.com/YOUR_USERNAME/hybrid-cpu-architecture)
```

### Commit and Push Updates

```bash
git add frontend/index.html README.md
git commit -m "Add cross-links between GitHub and Vercel deployment"
git push
```

Vercel will automatically redeploy (takes ~1 minute).

---

## Part 4: Verify Everything Works

### Checklist

- [ ] GitHub repository is public
- [ ] All files visible on GitHub
- [ ] README displays correctly
- [ ] Vercel deployment successful
- [ ] Live website accessible
- [ ] All three simulators work online
- [ ] Performance comparison shows Hybrid wins
- [ ] GitHub link on website works
- [ ] Website link in README works

### Test Your Live Site

1. Open: `https://hybrid-cpu-architecture.vercel.app`
2. Click "RISC Core" → Click "Run" → Verify it works
3. Click "CISC Core" → Click "Run" → Verify it works
4. Click "Hybrid Core" → Click "Run" → Verify it works
5. Click "Performance Comparison" → Verify table shows Hybrid wins
6. Click GitHub link → Verify it goes to your repository

---

## 🎓 For Your University Submission

### What to Submit

1. **GitHub Repository Link**:
   ```
   https://github.com/YOUR_USERNAME/hybrid-cpu-architecture
   ```

2. **Live Demo Link**:
   ```
   https://hybrid-cpu-architecture.vercel.app
   ```

3. **Documentation** (from your repo):
   - `README.md` - Quick start guide
   - `docs/PROJECT_REPORT.md` - Complete 30+ page report
   - `PROJECT_STRUCTURE.md` - Project organization

### Viva Defense Preparation

**Demo Flow**:
1. Show live website to audience
2. Explain system architecture (RISC, CISC, Hybrid)
3. Run RISC simulator - show 9 cycles
4. Run CISC simulator - show 16-20 cycles
5. Run Hybrid simulator - show **6 cycles** 🏆
6. Show performance comparison table - Hybrid wins!
7. Show GitHub repository - all source code available
8. Explain how Hybrid wins:
   - Instruction Translator (0 cycles)
   - Micro-op Fusion (LOAD_DUAL, LOAD_ADD)
   - Optimized pipeline
   - Cache-aware execution

**Key Points to Emphasize**:
- ✅ Hybrid achieves **6 cycles** - lower than RISC (9) and CISC (16-20)
- ✅ Micro-op fusion is the key optimization
- ✅ Real-world relevance: Intel x86 uses similar approach
- ✅ Fully functional live simulation, not just theory
- ✅ Complete documentation with component definitions
- ✅ Open source and publicly accessible

---

## 🔧 Troubleshooting

### Problem: Git push fails with authentication error

**Solution**:
```bash
# Generate Personal Access Token on GitHub
# Go to: Settings → Developer settings → Personal access tokens → Generate new token
# Select: repo (full control)
# Copy the token

# Use token as password when prompted
git push -u origin main
Username: YOUR_USERNAME
Password: [paste token here]
```

### Problem: Vercel deployment fails

**Solutions**:
1. Check `vercel.json` is in project root
2. Ensure `frontend/` directory exists
3. Check Vercel build logs for errors
4. Try manual deployment:
   ```bash
   npm install -g vercel
   cd "/home/junaid/Desktop/project computer architectture ok "
   vercel --prod
   ```

### Problem: Website loads but simulators don't work

**Solutions**:
1. Check browser console for JavaScript errors (F12)
2. Verify all `.js` files are in `frontend/js/`
3. Check file paths in `index.html` are correct
4. Clear browser cache (Ctrl+Shift+Delete)

### Problem: GitHub link doesn't work on website

**Solution**:
Replace `YOUR_USERNAME` with your actual GitHub username in `index.html`

---

## 📊 Deployment Checklist

Before submitting to university:

- [ ] Repository is public on GitHub
- [ ] README.md has live demo link
- [ ] Website is live on Vercel
- [ ] All simulators work correctly online
- [ ] Performance comparison shows correct data
- [ ] Hybrid shows 6 cycles (winner)
- [ ] Documentation is complete
- [ ] GitHub link on website works
- [ ] Project accessible from any device
- [ ] Tested on different browsers (Chrome, Firefox, Edge)
- [ ] Mobile responsive (test on phone)
- [ ] Screenshots taken for report

---

## 🎉 Success!

Once all steps are complete:

1. ✅ Your code is on GitHub (version controlled, backed up)
2. ✅ Your project is live online (accessible worldwide)
3. ✅ You have public URLs to share (portfolio, resume, viva)
4. ✅ Your work is showcased professionally

**Share your project**:
- Add to your resume/CV
- Share on LinkedIn
- Include in your portfolio
- Present during viva defense

---

## 📞 Support

**Need help?**
1. Check GitHub repository README
2. Review project documentation in `docs/`
3. Contact course instructor
4. Open an issue on GitHub

---

## 🌟 Bonus: GitHub README Badge

Add this to your `README.md` to show deployment status:

```markdown
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)](https://hybrid-cpu-architecture.vercel.app)
[![GitHub](https://img.shields.io/badge/Source-GitHub-black?style=for-the-badge&logo=github)](https://github.com/YOUR_USERNAME/hybrid-cpu-architecture)
[![License](https://img.shields.io/badge/License-Educational-blue?style=for-the-badge)](LICENSE)
```

---

**Deployment Guide Complete!** 🚀

Your Hybrid CPU Architecture project is now live and accessible to the world! 🌍

**Good luck with your viva defense!** 🎓
