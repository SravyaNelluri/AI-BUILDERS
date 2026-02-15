# 🚀 Complete Beginner's Guide to Deploy on Vercel

This guide assumes you have **ZERO deployment experience**. Follow each step carefully!

---

## 📋 **What You'll Need**

✅ A GitHub account (to store your code)  
✅ A Vercel account (for hosting - it's FREE!)  
✅ A database (we'll show you how to get one FREE)  
✅ API keys (OpenRouter for AI, Stripe for payments)

---

## **Step 1: Create GitHub Account & Upload Your Code**

### 1.1 Create GitHub Account
1. Go to [github.com](https://github.com)
2. Click **Sign up** → Enter email, password, username
3. Verify your email

### 1.2 Create a New Repository
1. Click the **+** icon (top right) → **New repository**
2. Name it: `my-ai-app` (or anything you like)
3. Select **Private** (your code stays secret)
4. Click **Create repository**

### 1.3 Upload Your Code to GitHub

**Option A: Using VS Code (Easier)**
1. In VS Code, press `Ctrl+Shift+P`
2. Type: `Git: Initialize Repository` → Press Enter
3. Click **Yes** to initialize
4. Click the Source Control icon (left sidebar, looks like branches)
5. Click **Publish to GitHub**
6. Select **Publish to GitHub private repository**
7. Wait for upload to complete

**Option B: Using Terminal**
```powershell
# Navigate to your project folder
cd "C:\Users\sravy\OneDrive\Desktop\ai"

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit"

# Link to GitHub (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/my-ai-app.git

# Push code
git branch -M main
git push -u origin main
```

---

## **Step 2: Get a FREE Database (PostgreSQL)**

Your app needs a database. Here are **FREE** options:

### Option A: Vercel Postgres (Recommended for beginners)

1. Go to [vercel.com/signup](https://vercel.com/signup)
2. Sign up with your GitHub account (click "Continue with GitHub")
3. After logging in, click **Storage** (left sidebar)
4. Click **Create Database** → Select **Postgres**
5. Name it: `my-app-database`
6. Choose a region close to you (e.g., US East)
7. Click **Create**
8. Click **.env.local** tab
9. **Copy the DATABASE_URL** - save it somewhere safe!

### Option B: Neon (Alternative FREE option)

1. Go to [neon.tech](https://neon.tech)
2. Sign up (free tier is generous!)
3. Create a new project
4. Copy the connection string (starts with `postgresql://`)

---

## **Step 3: Get Your API Keys**

### 3.1 OpenRouter API Key (for AI features)
1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up / Log in
3. Go to **Keys** section
4. Create a new API key
5. **Copy and save it** (starts with `sk-or-...`)

### 3.2 Stripe Keys (for payment features)
1. Go to [stripe.com](https://stripe.com)
2. Sign up for a free account
3. Go to **Developers** → **API Keys**
4. Copy **Secret key** (starts with `sk_test_...`)
5. For webhook secret, go to **Developers** → **Webhooks** → **Add endpoint**
6. Add endpoint: `https://your-server-url.vercel.app/api/stripe` (you'll update this later)
7. Copy the **Signing secret** (starts with `whsec_...`)

### 3.3 Generate a Secret for Better Auth
Run this in PowerShell to generate a random secret:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```
**Copy the output** - this is your BETTER_AUTH_SECRET

---

## **Step 4: Deploy Your Backend (Server)**

### 4.1 Import Project to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import** next to your GitHub repository
3. If you don't see it, click **Adjust GitHub App Permissions** to grant access

### 4.2 Configure Server Settings
1. **Project Name**: `my-app-server` (or anything you like)
2. **Framework Preset**: Keep as "Other"
3. **Root Directory**: Click **Edit** → Select `server` folder
4. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: Leave blank
   - Install Command: `npm install`

### 4.3 Add Environment Variables
Click **Environment Variables** and add these (one by one):

| Name | Value |
|------|-------|
| `DATABASE_URL` | Paste your database URL from Step 2 |
| `AI_API_KEY` | Paste your OpenRouter key from Step 3.1 |
| `BETTER_AUTH_SECRET` | Paste the random secret from Step 3.3 |
| `BETTER_AUTH_URL` | `https://YOUR_APP_NAME-server.vercel.app` (you can update this after deployment) |
| `TRUSTED_ORIGINS` | `https://YOUR_APP_NAME.vercel.app` (you'll update this with your actual client URL) |
| `STRIPE_SECRET_KEY` | Paste from Step 3.2 |
| `STRIPE_WEBHOOK_SECRET` | Paste from Step 3.2 |
| `NODE_ENV` | `production` |

### 4.4 Deploy!
1. Click **Deploy**
2. Wait 2-3 minutes for build to complete
3. ✅ When done, click **Visit** or copy your server URL (e.g., `https://my-app-server.vercel.app`)
4. **SAVE THIS URL** - you'll need it!

### 4.5 Update Environment Variables with Real URLs
1. Go to your project → **Settings** → **Environment Variables**
2. Update `BETTER_AUTH_URL` with your actual server URL
3. You'll also need to update `TRUSTED_ORIGINS` after deploying the frontend (next step)
4. Click **Save**

---

## **Step 5: Deploy Your Frontend (Client)**

### 5.1 Create Another Vercel Project
1. Go to [vercel.com/new](https://vercel.com/new) again
2. Click **Import** on the **same GitHub repository** (yes, same repo!)
3. Click **Import**

### 5.2 Configure Client Settings
1. **Project Name**: `my-app-client` (different from server!)
2. **Framework Preset**: Select **Vite**
3. **Root Directory**: Click **Edit** → Select `client` folder
4. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 5.3 Add Environment Variable
Click **Environment Variables** and add:

| Name | Value |
|------|-------|
| `VITE_BASEURL` | Paste your server URL from Step 4.4 (e.g., `https://my-app-server.vercel.app`) |

### 5.4 Deploy!
1. Click **Deploy**
2. Wait 2-3 minutes
3. ✅ Copy your client URL (e.g., `https://my-app-client.vercel.app`)

---

## **Step 6: Update Server with Client URL**

Now that you have your client URL, update the server:

1. Go to your **server project** in Vercel
2. Go to **Settings** → **Environment Variables**
3. Find `TRUSTED_ORIGINS`
4. Click **Edit** and update value to: `https://your-client-url.vercel.app`
5. Click **Save**
6. Go to **Deployments** tab → Click ⋯ menu on latest deployment → **Redeploy**

---

## **Step 7: Set Up Your Database Schema**

Your database is empty! You need to create tables:

### 7.1 Run Prisma Migration
1. In VS Code, open terminal (`` Ctrl+` ``)
2. Navigate to server folder:
   ```powershell
   cd server
   ```
3. Create a `.env` file in the server folder with your DATABASE_URL:
   ```
   DATABASE_URL=your-database-url-here
   ```
4. Run migration:
   ```powershell
   npx prisma migrate deploy
   ```

**OR** you can add this to your server's `package.json` to auto-run on deployment:

In [server/package.json](server/package.json), update the scripts section:
```json
"scripts": {
  "start": "tsx server.ts",
  "server": "nodemon --exec tsx server.ts",
  "build": "tsc && prisma generate",
  "postinstall": "prisma generate"
}
```

Then **redeploy** your server project on Vercel.

---

## **Step 8: Update Stripe Webhook (if using payments)**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Edit your webhook endpoint
3. Change URL to: `https://your-server-url.vercel.app/api/stripe`
4. Save

---

## **Step 9: Test Your Deployment! 🎉**

1. Open your client URL in browser (e.g., `https://my-app-client.vercel.app`)
2. Try signing up / logging in
3. Test the AI features

---

## **🔧 Common Issues & Fixes**

### ❌ "CORS Error"
- Make sure `TRUSTED_ORIGINS` includes your client URL
- Redeploy server after updating

### ❌ "Database connection failed"
- Double-check your `DATABASE_URL` is correct
- Make sure you ran Prisma migrations

### ❌ "Authentication not working"
- Verify `BETTER_AUTH_URL` matches your server URL
- Check `BETTER_AUTH_SECRET` is set

### ❌ "AI API not working"
- Verify `AI_API_KEY` is correct
- Check your OpenRouter credits

---

## **📱 View Deployment Logs**

If something breaks:
1. Go to your project in Vercel
2. Click **Deployments**
3. Click on the latest deployment
4. Scroll down to see logs
5. Look for red error messages

---

## **🔄 How to Update Your Deployed App**

Every time you make code changes:

1. **Save your files** in VS Code
2. **Commit to GitHub**:
   - Open Source Control (left sidebar)
   - Type a message like "Updated feature X"
   - Click ✓ (checkmark) to commit
   - Click **Sync Changes** to push to GitHub
3. **Vercel automatically redeploys!** (within 1-2 minutes)

---

## **💰 Costs**

- **Vercel**: FREE for hobby projects
- **Database (Vercel Postgres)**: FREE tier available
- **OpenRouter**: Pay per use (very cheap, ~$0.001 per request)
- **Stripe**: Free (they take a % of payments only)

---

## **🆘 Need Help?**

If you get stuck, check:
1. Vercel deployment logs
2. Browser console (F12 → Console tab)
3. Make sure all environment variables are set

---

**🎊 Congratulations! Your app is now LIVE on the internet!**

Share your client URL with anyone to let them use your app! 🚀
