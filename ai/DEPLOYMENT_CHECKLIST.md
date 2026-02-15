# ✅ Deployment Checklist

Copy this checklist and check off each item as you complete it!

## 🎯 Pre-Deployment Setup

### GitHub Setup
- [ ] Created GitHub account
- [ ] Created new repository (public or private)
- [ ] Initialized Git in your project
- [ ] Pushed code to GitHub
- [ ] Verified code is visible on GitHub

### Get Required Services
- [ ] Created Vercel account (using GitHub login)
- [ ] Created database (Vercel Postgres / Neon / Supabase)
- [ ] Saved DATABASE_URL somewhere safe
- [ ] Created OpenRouter account
- [ ] Got OpenRouter API key (AI_API_KEY)
- [ ] Created Stripe account (if using payments)
- [ ] Got Stripe Secret Key
- [ ] Generated BETTER_AUTH_SECRET (random string)

---

## 🖥️ Server Deployment

### Vercel Server Project Setup
- [ ] Went to vercel.com/new
- [ ] Imported GitHub repository
- [ ] Named project (e.g., "my-app-server")
- [ ] Set Root Directory to `server`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: (left blank)

### Server Environment Variables
Add these in Vercel dashboard:
- [ ] DATABASE_URL
- [ ] AI_API_KEY
- [ ] BETTER_AUTH_SECRET
- [ ] STRIPE_SECRET_KEY (if using)
- [ ] STRIPE_WEBHOOK_SECRET (if using)
- [ ] NODE_ENV = `production`
- [ ] BETTER_AUTH_URL = `https://_____.vercel.app` (use your server URL)
- [ ] TRUSTED_ORIGINS = (will update after client deployment)

### Deploy Server
- [ ] Clicked "Deploy" button
- [ ] Waited for deployment to complete (2-3 min)
- [ ] Deployment succeeded (green checkmark)
- [ ] Copied server URL (e.g., https://my-app-server.vercel.app)
- [ ] Tested server URL - should show "Server is Live!"
- [ ] Saved SERVER_URL for next steps

---

## 🌐 Client Deployment

### Vercel Client Project Setup
- [ ] Went to vercel.com/new again
- [ ] Imported SAME GitHub repository
- [ ] Named project differently (e.g., "my-app-client")
- [ ] Set Framework Preset to `Vite`
- [ ] Set Root Directory to `client`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`

### Client Environment Variables
- [ ] VITE_BASEURL = (paste your SERVER_URL from above)

### Deploy Client
- [ ] Clicked "Deploy" button
- [ ] Waited for deployment to complete (2-3 min)
- [ ] Deployment succeeded (green checkmark)
- [ ] Copied client URL (e.g., https://my-app-client.vercel.app)
- [ ] Saved CLIENT_URL

---

## 🔄 Connect Server & Client

### Update Server Settings
- [ ] Went to Server project → Settings → Environment Variables
- [ ] Found TRUSTED_ORIGINS variable
- [ ] Updated value to CLIENT_URL (e.g., https://my-app-client.vercel.app)
- [ ] Saved changes
- [ ] Went to Deployments tab
- [ ] Clicked ⋯ menu → Redeploy
- [ ] Waited for redeployment

### Update Stripe (if using payments)
- [ ] Went to Stripe Dashboard → Webhooks
- [ ] Added/Updated endpoint URL: SERVER_URL/api/stripe
- [ ] Copied webhook signing secret
- [ ] Updated STRIPE_WEBHOOK_SECRET in Vercel if needed
- [ ] Tested webhook

---

## 💾 Database Setup

### Run Database Migrations
- [ ] Opened VS Code terminal
- [ ] Navigated to server folder: `cd server`
- [ ] Created `.env` file with DATABASE_URL
- [ ] Ran: `npx prisma migrate deploy` or `npx prisma db push`
- [ ] Migration succeeded
- [ ] Ran: `npx prisma studio` to verify (optional)

---

## 🧪 Testing

### Test Your Live App
- [ ] Opened CLIENT_URL in browser
- [ ] Page loads without errors
- [ ] Opened browser console (F12) - no errors
- [ ] Tried signing up with test account
- [ ] Login successful
- [ ] Tested creating a project (or main feature)
- [ ] AI generation works
- [ ] Data saves to database
- [ ] Tested on mobile browser (optional)

### Check Logs for Errors
- [ ] Checked Vercel server logs for errors
- [ ] Checked Vercel client logs for errors
- [ ] Fixed any errors found
- [ ] Redeployed if needed

---

## 🎨 Optional Polish

- [ ] Added custom domain (Vercel Settings → Domains)
- [ ] Updated OpenRouter HTTP-Referer in code to real domain
- [ ] Set up environment variables for production vs staging
- [ ] Enabled Vercel Analytics
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Added SEO meta tags
- [ ] Added favicon

---

## 📋 Post-Deployment Checklist

### Documentation
- [ ] Saved all URLs in a safe place
- [ ] Documented environment variables
- [ ] Created backup of API keys
- [ ] Added team members to Vercel (if applicable)

### Security
- [ ] Verified .env files are NOT in GitHub
- [ ] Confirmed .gitignore includes .env
- [ ] Checked no secrets in code
- [ ] Enabled 2FA on Vercel account
- [ ] Enabled 2FA on GitHub account

### Monitoring
- [ ] Set up Vercel email notifications
- [ ] Checked usage limits (database, API calls)
- [ ] Set up billing alerts if needed

---

## 🆘 Troubleshooting

If something goes wrong:

### Common Issues
- [ ] CORS Error → Check TRUSTED_ORIGINS matches CLIENT_URL exactly
- [ ] Database Error → Verify DATABASE_URL is correct, migrations ran
- [ ] Auth Error → Check BETTER_AUTH_SECRET and BETTER_AUTH_URL
- [ ] 500 Error → Check Vercel deployment logs
- [ ] Build Failed → Check package.json scripts, node version

### Where to Check
- [ ] Vercel → Project → Deployments → Click deployment → View logs
- [ ] Browser → F12 → Console tab (for client errors)
- [ ] Browser → F12 → Network tab (for API errors)
- [ ] Vercel → Project → Logs (real-time)

---

## 🎉 Success Criteria

You're done when:
- ✅ Client URL loads without errors
- ✅ Can sign up and log in
- ✅ Main features work (AI generation, etc.)
- ✅ Data persists in database
- ✅ No console errors
- ✅ Works on different devices/browsers

---

## 📱 Share Your App

- [ ] Tested with friends/family
- [ ] Shared CLIENT_URL publicly
- [ ] Posted on social media (optional)
- [ ] Added to portfolio (optional)

---

**🎊 CONGRATULATIONS! Your app is live!** 🚀

Your URLs:
- **Client (Frontend)**: ________________________________
- **Server (Backend)**: ________________________________
- **Database**: ________________________________

Date Deployed: ________________

---

## 🔄 Future Updates

Every time you want to update:
1. Make changes in VS Code
2. Save and test locally
3. Commit: `git add .` → `git commit -m "Updated X"`
4. Push: `git push`
5. Vercel auto-deploys in 1-2 minutes!

---

**Keep this checklist for future reference!**
