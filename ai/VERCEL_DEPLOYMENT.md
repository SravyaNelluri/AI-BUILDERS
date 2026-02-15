# Vercel Deployment Guide - Monorepo Setup

## Overview
This guide shows you how to deploy **both frontend and backend** from a **single repository** to Vercel.

---

## 🎯 Architecture
- **Frontend (Client)**: React + Vite app → Static site at root domain
- **Backend (Server)**: Express API → Serverless functions at `/api/*`
- **Deployment**: Single Vercel project serving both

---

## 📋 Prerequisites

1. **GitHub Account** - Your code must be on GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Database** - PostgreSQL database (Vercel Postgres or Neon)
4. **API Keys**:
   - OpenRouter API key
   - Stripe API keys
   - Better Auth secret

---

## 🚀 Step 1: Push Code to GitHub

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Vercel deployment"

# Create GitHub repo and push
# (Create repo on github.com first, then:)
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git branch -M main
git push -u origin main
```

---

## 🔧 Step 2: Configure Environment Variables

### Required Environment Variables

Create these in Vercel dashboard (we'll add them in Step 4):

#### **Server Variables**
```env
DATABASE_URL=postgresql://user:password@host/database
BETTER_AUTH_SECRET=your-secret-here-min-32-chars
BETTER_AUTH_URL=https://your-app.vercel.app
TRUSTED_ORIGINS=https://your-app.vercel.app
OPENROUTER_API_KEY=sk-or-v1-xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx (or sk_test for testing)
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

#### **Client Variables**
```env
VITE_API_URL=https://your-app.vercel.app/api
VITE_BETTER_AUTH_URL=https://your-app.vercel.app
```

---

## 🌐 Step 3: Deploy to Vercel

### 3.1 Import Your Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your GitHub repository
4. Click **Import**

### 3.2 Configure Project Settings

**Framework Preset**: Other

**Root Directory**: Leave as `./` (root)

**Build & Development Settings**:
- **Build Command**: `cd client && npm install && npm run build && cd ../server && npm install && npm run build`
- **Output Directory**: `client/dist`
- **Install Command**: `npm install --prefix client && npm install --prefix server`

### 3.3 Add Environment Variables

Click **Environment Variables** and add ALL the variables from Step 2:

1. Enter variable name (e.g., `DATABASE_URL`)
2. Enter value
3. Click **Add**
4. Repeat for all variables

**Important**: Make sure to add them to all environments (Production, Preview, Development) if needed.

### 3.4 Deploy

1. Click **Deploy**
2. Wait 3-5 minutes for deployment
3. You'll get a URL like: `https://your-app.vercel.app`

---

## 🔄 Step 4: Post-Deployment Setup

### Update Environment Variables

After first deployment, update these URLs with your actual Vercel URL:

```env
BETTER_AUTH_URL=https://your-actual-app.vercel.app
TRUSTED_ORIGINS=https://your-actual-app.vercel.app
VITE_API_URL=https://your-actual-app.vercel.app/api
VITE_BETTER_AUTH_URL=https://your-actual-app.vercel.app
```

1. Go to **Project Settings** → **Environment Variables**
2. Edit each URL-based variable
3. Click **Save**
4. **Redeploy** (Settings → Deployments → Click ⋯ → Redeploy)

### Setup Stripe Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Endpoint URL: `https://your-app.vercel.app/api/stripe/webhook`
4. Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add it to Vercel as `STRIPE_WEBHOOK_SECRET`

---

## 🧪 Step 5: Test Your Deployment

1. **Frontend**: Visit `https://your-app.vercel.app`
2. **API Health**: Visit `https://your-app.vercel.app/api/test`
3. **Authentication**: Try signing up/login
4. **Database**: Check if data saves correctly

---

## 📁 Project Structure

```
ai/
├── vercel.json          # Root config (routes client + server)
├── client/              # Frontend
│   ├── vercel.json     # SPA rewrites
│   ├── dist/           # Built files (auto-generated)
│   └── ...
└── server/             # Backend
    ├── vercel.json     # Serverless function config
    ├── server.ts       # Main Express app
    └── ...
```

---

## 🔗 How It Works

### URL Routing
- `https://your-app.vercel.app/` → Frontend (React app)
- `https://your-app.vercel.app/api/*` → Backend (Express API)

### Build Process
1. Installs dependencies for both client & server
2. Builds client (creates `client/dist/`)
3. Builds server (compiles TypeScript, generates Prisma client)
4. Deploys client as static site
5. Deploys server as serverless functions

---

## 🐛 Troubleshooting

### Build Fails

**Error: Cannot find module**
- Make sure all dependencies are in package.json
- Check that build commands are correct

**Prisma errors**
- Ensure `DATABASE_URL` is set
- Check `postinstall` script runs `prisma generate`

### Runtime Errors

**500 errors on API calls**
- Check Vercel Function Logs (Deployments → View Function Logs)
- Verify all environment variables are set
- Check database connection

**CORS errors**
- Update `TRUSTED_ORIGINS` with your Vercel URL
- Redeploy after changing env vars

**Authentication not working**
- Verify `BETTER_AUTH_URL` matches your deployment URL
- Check `BETTER_AUTH_SECRET` is set (min 32 characters)
- Ensure database is accessible

---

## 🔄 Updating Your App

```powershell
# Make changes to your code
# Then push to GitHub

git add .
git commit -m "Update feature"
git push

# Vercel auto-deploys on push to main branch!
```

---

## 💡 Tips

1. **Custom Domain**: Add in Project Settings → Domains
2. **Preview Deployments**: Automatic for every PR
3. **Logs**: Check Function logs for debugging
4. **Analytics**: Enable in Project Settings
5. **Database**: Consider Vercel Postgres for easy integration

---

## 📞 Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- Check deployment logs in Vercel dashboard
