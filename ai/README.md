# 🚀 AI Portfolio Generator - Deployment Guide

> **First time deploying?** Don't worry! This guide is designed for complete beginners with **zero deployment experience**.

---

## 📚 Table of Contents

1. [Quick Start](#quick-start)
2. [What You'll Need](#what-youll-need)
3. [Deployment Files](#deployment-files)
4. [Getting Help](#getting-help)

---

## ⚡ Quick Start

### Option 1: Step-by-Step Guide (Recommended for Beginners)
👉 **Open [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** for detailed instructions with screenshots and explanations.

### Option 2: Checklist Method (For Visual Learners)
👉 **Open [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** and check off each step as you complete it.

### Option 3: Need to Understand How It Works?
👉 **Read [ARCHITECTURE.md](ARCHITECTURE.md)** to see how all the pieces connect.

---

## 🎯 What You'll Need

| Item | Where to Get It | Cost |
|------|----------------|------|
| **GitHub Account** | [github.com](https://github.com) | FREE |
| **Vercel Account** | [vercel.com](https://vercel.com) | FREE |
| **Database** | Vercel Postgres / [neon.tech](https://neon.tech) | FREE tier |
| **OpenRouter API** | [openrouter.ai](https://openrouter.ai) | Pay per use (~$0.001/request) |
| **Stripe Account** | [stripe.com](https://stripe.com) | FREE (fee on transactions) |

**Total Time to Deploy**: 30-45 minutes (first time)

---

## 📁 Deployment Files

Your workspace now includes these helpful files:

### 📖 Documentation
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete step-by-step tutorial
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Printable checklist
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Visual diagrams showing how everything connects
- **[ENV_VARIABLES.md](ENV_VARIABLES.md)** - Quick reference for all environment variables

### ⚙️ Configuration Files
- **[server/.env.example](server/.env.example)** - Template for server environment variables
- **[client/.env.example](client/.env.example)** - Template for client environment variables
- **[.gitignore](.gitignore)** - Ensures your secrets don't get uploaded to GitHub

---

## 🗺️ Deployment Roadmap

```
1. Setup GitHub (10 min)
   └─> Push your code

2. Get Services (15 min)
   ├─> Database (Vercel Postgres)
   ├─> OpenRouter API key
   └─> Stripe keys (if using payments)

3. Deploy Server (10 min)
   ├─> Create Vercel project
   ├─> Configure environment variables
   └─> Deploy!

4. Deploy Client (5 min)
   ├─> Create another Vercel project
   ├─> Point to server URL
   └─> Deploy!

5. Connect Everything (5 min)
   ├─> Update CORS settings
   └─> Run database migrations

✅ Your app is LIVE!
```

---

## 🎓 Understanding Your App

Your application has two parts:

### 🎨 **Client (Frontend)**
- Built with: React + Vite
- Location: `/client` folder
- What it does: User interface (what users see and interact with)
- Deployed to: `https://your-app-client.vercel.app`

### 🖥️ **Server (Backend)**
- Built with: Express + Node.js
- Location: `/server` folder
- What it does: Handles data, AI requests, authentication
- Deployed to: `https://your-app-server.vercel.app`

---

## 🔐 Environment Variables You'll Need

### For Server:
```bash
DATABASE_URL          # PostgreSQL connection
AI_API_KEY           # OpenRouter API key
BETTER_AUTH_SECRET   # Random secret string
BETTER_AUTH_URL      # Your server URL
TRUSTED_ORIGINS      # Your client URL
STRIPE_SECRET_KEY    # Stripe API key
STRIPE_WEBHOOK_SECRET # Stripe webhook secret
NODE_ENV             # production
```

### For Client:
```bash
VITE_BASEURL         # Your server URL
```

👉 **See [ENV_VARIABLES.md](ENV_VARIABLES.md) for details on where to get each value.**

---

## 🆘 Getting Help

### Before Asking for Help:
1. ✅ Check deployment logs in Vercel (Deployments → Click deployment → Scroll to logs)
2. ✅ Check browser console (Press F12 → Console tab)
3. ✅ Verify all environment variables are set correctly
4. ✅ Make sure you followed the deployment order (server first, client second)

### Common Issues:
| Error | Solution |
|-------|----------|
| CORS Error | Update `TRUSTED_ORIGINS` to match client URL exactly |
| Database Error | Check `DATABASE_URL` and run migrations |
| Auth Not Working | Verify `BETTER_AUTH_URL` matches server URL |
| Build Failed | Check Node version, `package.json` scripts |

👉 **More troubleshooting in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md#-common-issues--fixes)**

---

## 🔄 Making Updates After Deployment

It's super easy!

```bash
# 1. Make your code changes in VS Code

# 2. Commit changes
git add .
git commit -m "Your update description"

# 3. Push to GitHub
git push

# 4. Vercel automatically redeploys! (1-2 minutes)
```

That's it! No need to manually redeploy. Vercel watches your GitHub repo and auto-deploys on every push.

---

## 💰 Pricing (As of 2026)

| Service | Free Tier | Paid Plan |
|---------|-----------|-----------|
| **Vercel Hosting** | ✅ Unlimited for personal projects | $20/month for teams |
| **Vercel Postgres** | ✅ 256 MB, 60 hours compute | Scales with usage |
| **OpenRouter** | ❌ Pay per use | ~$0.001 per AI request |
| **Stripe** | ✅ Free to use | 2.9% + $0.30 per transaction |

**Estimated Monthly Cost for Small App**: $5-10 (mostly AI API calls)

---

## 🎯 Next Steps

### After Deployment:
1. ✅ Test your live app thoroughly
2. ✅ Set up custom domain (optional)
3. ✅ Enable Vercel Analytics (free)
4. ✅ Add environment monitoring
5. ✅ Share with friends!

### Future Enhancements:
- Add more features and redeploy
- Set up staging environment
- Enable automatic previews for PRs
- Add CI/CD testing
- Monitor performance and errors

---

## 📞 Support Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **OpenRouter Docs**: [openrouter.ai/docs](https://openrouter.ai/docs)

---

## 🎉 Ready to Deploy?

**Choose your path:**

### 👶 Complete Beginner
Start here → **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**

### 📋 Like Checklists
Start here → **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)**

### 🧠 Want to Understand First
Start here → **[ARCHITECTURE.md](ARCHITECTURE.md)**

---

**Good luck! You've got this! 🚀**

Remember: Everyone's first deployment is scary. Take it step by step, and you'll have your app live in less than an hour!

---

## 📝 License

This project is for educational purposes. Make sure to add your own license file if you plan to open source it.

---

**Questions?** Open an issue or consult the deployment guide. Happy deploying! 🎊
