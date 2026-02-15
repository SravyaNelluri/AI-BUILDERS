# 🔍 VERCEL DEPLOYMENT DEBUG CHECKLIST

## ✅ FIXED ISSUES

1. ✅ Corrected `vercel.json` configuration
2. ✅ Fixed auth route pattern (was `{*any}`, now `*`)
3. ✅ Added error handling middleware
4. ✅ Added environment variable validation
5. ✅ Fixed import in `lib/auth.ts`
6. ✅ Added proper logging for debugging

---

## 🚀 NOW DO THIS:

### Step 1: Push Changes to GitHub

```powershell
git add .
git commit -m "Fix Vercel deployment configuration"
git push origin main
```

---

### Step 2: Check Environment Variables in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

**CRITICAL: Verify these EXACT variable names exist:**

| Variable Name | Example Value | Required |
|--------------|---------------|----------|
| `DATABASE_URL` | `postgresql://user:pass@host/db` | ✅ YES |
| `BETTER_AUTH_SECRET` | `min-32-characters-random-string` | ✅ YES |
| `BETTER_AUTH_URL` | `https://your-app.vercel.app` | ✅ YES |
| `TRUSTED_ORIGINS` | `https://your-app.vercel.app` | ✅ YES |
| `AI_API_KEY` | `sk-or-v1-xxxxx` | ✅ YES |
| `STRIPE_SECRET_KEY` | `sk_test_xxxxx` or `sk_live_xxxxx` | ✅ YES |
| `STRIPE_WEBHOOK_SECRET` | `whsec_xxxxx` | ✅ YES |
| `VITE_BASEURL` | `https://your-app.vercel.app` | ✅ YES |
| `NODE_ENV` | `production` | ⚠️ Optional |

**Common mistakes:**
- ❌ `OPENROUTER_API_KEY` → ✅ Should be `AI_API_KEY`
- ❌ `VITE_BETTER_AUTH_URL` → ✅ Not needed (only `VITE_BASEURL`)
- ❌ URLs ending with `/` → ✅ Remove trailing slash
- ❌ URLs with `/api` suffix → ✅ Use base URL only for `VITE_BASEURL`

---

### Step 3: Redeploy

1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait 2-3 minutes

---

### Step 4: Check Deployment Logs

**While deploying:**

1. Click on the deployment in progress
2. Go to **Building** tab → See if build succeeds
3. Go to **Runtime Logs** tab → Check for errors

**Look for these error messages:**

❌ "Missing required environment variables: DATABASE_URL, BETTER_AUTH_SECRET..."
→ **Fix:** Add missing variables in Settings

❌ "ERR_MODULE_NOT_FOUND"
→ **Fix:** Check if all dependencies are in package.json

❌ "Prisma Client not generated"
→ **Fix:** Should be auto-fixed now (postinstall script)

❌ "Database connection failed"
→ **Fix:** Check DATABASE_URL is correct and accessible

---

### Step 5: Test Endpoints

After deployment succeeds:

1. **Root:** `https://your-app.vercel.app/`
   - Should show: React app

2. **API Health:** `https://your-app.vercel.app/api`
   - Should show: "API is Live!"

3. **Auth:** `https://your-app.vercel.app/api/auth/session`
   - Should show: JSON response (not 500 error)

---

## 🐛 IF STILL GETTING 500 ERROR:

### Check Function Logs

1. Go to **Vercel Dashboard** → **Your Project**
2. Click **Deployments** → Click latest deployment
3. Click **Functions** tab
4. Click on any function that shows errors
5. **Screenshot the error** and send it to me

### Or Check Real-Time Logs

Visit your app at: `https://your-app.vercel.app/api`

Then immediately:
1. Go to **Vercel Dashboard**
2. Click **Logs** (or **Runtime Logs**)
3. You'll see the actual error message

---

## 📝 Environment Variable Checklist

Copy this and fill it out:

```
[ ] DATABASE_URL is set
[ ] BETTER_AUTH_SECRET is at least 32 characters
[ ] BETTER_AUTH_URL matches my Vercel URL exactly
[ ] TRUSTED_ORIGINS matches my Vercel URL exactly
[ ] AI_API_KEY starts with sk-or-v1-
[ ] STRIPE_SECRET_KEY starts with sk_test_ or sk_live_
[ ] STRIPE_WEBHOOK_SECRET starts with whsec_
[ ] VITE_BASEURL matches my Vercel URL exactly
[ ] All variables are in "Production" environment
```

---

## 🎯 Key Changes Summary

### What I Fixed:

1. **vercel.json** - Changed from invalid config to proper Vercel v2 format
2. **Auth route** - Changed `/api/auth/{*any}` → `/api/auth/*`
3. **Error handling** - Added middleware to catch and log errors
4. **Environment validation** - Server now logs missing env vars
5. **Import fix** - Fixed `import 'dotenv'` in auth.ts

### What You Need to Do:

1. Push changes to GitHub
2. Verify environment variables in Vercel (exact names!)
3. Redeploy
4. Check logs if it fails
5. Send me the specific error from logs

---

**💬 After you redeploy, tell me:**
- ✅ If it works!
- ❌ If it fails, send the error from **Vercel Logs**
