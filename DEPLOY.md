# 🚀 Quick Deploy to Vercel - Monorepo Setup

## ✅ What's Been Configured

Your project is now **ready for Vercel deployment** with:
- ✅ Root `vercel.json` - Routes frontend & backend
- ✅ Server routes - All under `/api/*`
- ✅ Serverless function config
- ✅ Build configurations

---

## 📦 Deploy in 5 Steps

### 1️⃣ Push to GitHub

```powershell
git add .
git commit -m "Ready for Vercel"
git push origin main
```

*(If you haven't set up GitHub yet, create a repo at github.com first)*

---

### 2️⃣ Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your repo
4. **Configure Build Settings**:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install --legacy-peer-deps`

---

### 3️⃣ Add Environment Variables

In Vercel dashboard → Settings → Environment Variables, add these:

**Required:**
```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=(min 32 characters - generate a random string)
BETTER_AUTH_URL=https://your-app.vercel.app
TRUSTED_ORIGINS=https://your-app.vercel.app
OPENROUTER_API_KEY=sk-or-v1-...
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_BASEURL=https://your-app.vercel.app/api
VITE_BETTER_AUTH_URL=https://your-app.vercel.app
NODE_ENV=production
```

**Note:** For first deployment, you can use placeholder URLs like `https://placeholder.com`, then update them after getting your Vercel URL.

---

### 4️⃣ Deploy

Click **Deploy** and wait 3-5 minutes.

---

### 5️⃣ Update URLs & Redeploy

After first deployment:

1. Copy your Vercel URL (e.g., `https://my-app.vercel.app`)
2. Go to **Settings** → **Environment Variables**
3. Update all URL variables with your actual Vercel URL
4. Go to **Deployments** → Click ⋯ on latest → **Redeploy**

---

## 🧪 Test Your Deployment

- **Frontend:** `https://your-app.vercel.app`
- **API:** `https://your-app.vercel.app/api`
- **Auth:** `https://your-app.vercel.app/api/auth/session`

---

## 🔗 How it Works

```
https://your-app.vercel.app/          → React App (client/dist/)
https://your-app.vercel.app/api/*     → Express API (server/)
```

- **Client** builds to static files
- **Server** runs as serverless functions
- Routes automatically configured via `vercel.json`

---

## 🐛 Common Issues

**Build fails?**
- Check all env variables are set
- Verify DATABASE_URL is accessible from Vercel

**API returns 404?**
- Make sure all routes start with `/api/`
- Check server/vercel.json exists

**CORS errors?**
- Update TRUSTED_ORIGINS with your Vercel URL
- Redeploy after changing env vars

**Auth not working?**
- BETTER_AUTH_URL must match your deployment URL exactly
- BETTER_AUTH_SECRET must be at least 32 characters

---

## 📚 More Details

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete guide.

---

## 🎯 Current API Structure

All routes are now under `/api`:

- `/api` - Health check
- `/api/auth/*` - Authentication
- `/api/user/*` - User operations
- `/api/project/*` - Project operations
- `/api/test/*` - Test routes
- `/api/stripe` - Stripe webhook
