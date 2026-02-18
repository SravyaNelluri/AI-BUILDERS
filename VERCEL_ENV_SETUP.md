# Vercel Environment Variables Setup

## Required Environment Variables

Go to your Vercel project settings → Environment Variables and set these:

### 1. Database
```
DATABASE_URL = <your-postgres-connection-string>
```

### 2. Authentication (CRITICAL for fixing 404)
```
BETTER_AUTH_SECRET = <your-auth-secret-from-local-.env>
BETTER_AUTH_URL = https://ai-builders-two.vercel.app
```
**⚠️ IMPORTANT**: `BETTER_AUTH_URL` must be YOUR exact Vercel domain (without /api)

### 3. Trusted Origins
```
TRUSTED_ORIGINS = https://ai-builders-two.vercel.app
```

### 4. AI Configuration
```
AI_API_KEY = <your-openrouter-api-key>
AI_MODEL = openai/gpt-4o-mini
AI_MAX_TOKENS = 2000
```

### 5. Stripe
```
STRIPE_SECRET_KEY = <your-stripe-secret-key>
STRIPE_WEBHOOK_SECRET = <your-stripe-webhook-secret>
```

### 6. Node Environment
```
NODE_ENV = production
PORT = 3000
```

## After Setting Variables

1. **Redeploy** your Vercel app to apply the changes
2. Test the auth endpoints
3. Check that signin works without 404 errors

## Troubleshooting

If you still get 404 errors:
1. Verify `BETTER_AUTH_URL` matches your Vercel domain exactly
2. Make sure all variables are set for "Production" environment
3. Redeploy the application
4. Check Vercel function logs for errors

## Where to find your values

- Copy values from your local `server/.env` file
- Replace `localhost:3000` URLs with your Vercel domain
- Keep all other secrets the same
