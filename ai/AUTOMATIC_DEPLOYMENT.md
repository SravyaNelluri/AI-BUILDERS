# Automatic Deployment Setup

## Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Select **"Import Git Repository"**
4. Search for your GitHub repository and click **Import**
5. Set **Root Directory** to `./AI-BUILDERS/client`
6. Click **Deploy**

## Step 2: Add Environment Variables to Vercel

In Vercel Dashboard → Settings → Environment Variables, add:

```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=https://your-domain.vercel.app
AI_API_KEY=sk-or-v1-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
TRUSTED_ORIGINS=https://your-domain.vercel.app,http://localhost:3000
NODE_ENV=production
```

## Step 3: Set Up GitHub Actions Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click **"New repository secret"** and add:

```
VERCEL_ORG_ID=<your-vercel-org-id>
VERCEL_PROJECT_ID=<your-vercel-project-id>
VERCEL_TOKEN=<your-vercel-token>
```

### How to get these values:

**VERCEL_TOKEN:**
- Vercel Dashboard → Settings → Tokens
- Create Personal Access Token

**VERCEL_ORG_ID & VERCEL_PROJECT_ID:**
- Run: `vercel deploy --confirm`
- Check your `.vercel/project.json` file

## Step 4: Deploy Automatically

Push to `main` branch → GitHub Actions will automatically deploy to Vercel:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

✅ **Done!** Every push to `main` will auto-deploy to Vercel.
