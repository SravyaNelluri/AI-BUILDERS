# 🔑 Environment Variables Quick Reference

## Where to Get Each Value

### 📦 **DATABASE_URL**
**Where to get it:**
- **Vercel Postgres**: Dashboard → Storage → Create Database → Copy from .env.local tab
- **Neon**: neon.tech → Create Project → Connection String
- **Format**: `postgresql://username:password@host:port/database`

---

### 🤖 **AI_API_KEY**
**Where to get it:**
- Go to [openrouter.ai](https://openrouter.ai)
- Sign up/login
- Click "Keys" → Create new key
- **Starts with**: `sk-or-...`

---

### 🔐 **BETTER_AUTH_SECRET**
**How to generate:**
Run in PowerShell:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```
**Should be**: A random 32+ character string

---

### 🌐 **BETTER_AUTH_URL**
**What it is**: Your server's public URL
**Format**: `https://your-server-name.vercel.app`
**Note**: Update this AFTER deploying your server

---

### 🌍 **TRUSTED_ORIGINS**
**What it is**: Your client's public URL (where frontend is hosted)
**Format**: `https://your-client-name.vercel.app`
**Note**: Update this AFTER deploying your client

---

### 💳 **STRIPE_SECRET_KEY**
**Where to get it:**
- Go to [stripe.com](https://stripe.com)
- Developers → API Keys
- Copy "Secret key"
- **Test mode starts with**: `sk_test_...`
- **Live mode starts with**: `sk_live_...`

---

### 🔔 **STRIPE_WEBHOOK_SECRET**
**Where to get it:**
- Stripe Dashboard → Developers → Webhooks
- Add endpoint: `https://your-server.vercel.app/api/stripe`
- Copy "Signing secret"
- **Starts with**: `whsec_...`

---

### 🖥️ **NODE_ENV**
**For local development**: `development`
**For Vercel deployment**: `production`

---

### ⚛️ **VITE_BASEURL** (Client only)
**What it is**: Your server's public URL
**Format**: `https://your-server-name.vercel.app`
**Local development**: `http://localhost:3000`

---

## 📋 Checklist Before Deployment

### Server Environment Variables:
- [ ] DATABASE_URL
- [ ] AI_API_KEY
- [ ] BETTER_AUTH_SECRET
- [ ] BETTER_AUTH_URL
- [ ] TRUSTED_ORIGINS
- [ ] STRIPE_SECRET_KEY
- [ ] STRIPE_WEBHOOK_SECRET
- [ ] NODE_ENV

### Client Environment Variables:
- [ ] VITE_BASEURL

---

## 🎯 Deployment Order

1. ✅ Get database URL
2. ✅ Get all API keys
3. ✅ Deploy SERVER first (so you get the server URL)
4. ✅ Deploy CLIENT second (using server URL)
5. ✅ Update server's TRUSTED_ORIGINS with client URL
6. ✅ Redeploy server

---

## 💡 Pro Tips

- **Never commit `.env` files to GitHub!** (They're in .gitignore)
- **Use `.env.example` files** to remember what variables you need
- **Test keys first**: Use Stripe test mode keys initially
- **Save your keys securely**: Use a password manager
- **Regenerate secrets** if you accidentally expose them
