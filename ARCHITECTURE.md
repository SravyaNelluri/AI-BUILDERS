# 🗺️ Deployment Architecture - How Everything Connects

```
┌─────────────────────────────────────────────────────────────────┐
│                          USERS                                   │
│                  (Access your app via browser)                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │      CLIENT (Frontend)               │
        │  https://your-app.vercel.app         │
        │                                       │
        │  - Built with React + Vite           │
        │  - Hosted on Vercel                  │
        │  - Static files (HTML, CSS, JS)      │
        └──────────────┬───────────────────────┘
                       │
                       │ API Requests
                       │ (VITE_BASEURL)
                       ▼
        ┌──────────────────────────────────────┐
        │      SERVER (Backend)                │
        │  https://your-server.vercel.app      │
        │                                       │
        │  - Built with Express + Node.js      │
        │  - Hosted on Vercel                  │
        │  - Handles API requests              │
        └──┬────────┬────────┬─────────────────┘
           │        │        │
           │        │        │
           ▼        ▼        ▼
    ┌──────────┐ ┌──────┐ ┌────────┐
    │ Database │ │  AI  │ │ Stripe │
    │          │ │      │ │        │
    │ Vercel   │ │ Open │ │Payment │
    │ Postgres │ │Router│ │Gateway │
    └──────────┘ └──────┘ └────────┘
```

## 📊 Data Flow Example: User Creates a Project

```
1. User fills form on CLIENT
   └─> https://your-app.vercel.app

2. CLIENT sends request to SERVER
   └─> POST https://your-server.vercel.app/api/project/create

3. SERVER processes request:
   ├─> Checks authentication (Better Auth)
   ├─> Calls OpenRouter AI API (generates content)
   ├─> Saves to DATABASE (PostgreSQL)
   └─> Returns response to CLIENT

4. CLIENT displays result to user
```

## 🔐 Authentication Flow

```
User signs up/logs in on CLIENT
          │
          ▼
CLIENT → /api/auth/login → SERVER
          │
          ├─> Better Auth validates credentials
          ├─> Stores session in DATABASE
          └─> Returns session cookie
          │
          ▼
Cookie stored in browser
(Used for all future requests)
```

## 🌍 Environment Variables Flow

### SERVER needs:
```
DATABASE_URL ────────────┐
                         ├──> Connects to PostgreSQL
AI_API_KEY ──────────────┤
                         ├──> Calls OpenRouter
STRIPE_SECRET_KEY ───────┤
                         └──> Processes payments
TRUSTED_ORIGINS ────────> Allows CLIENT domain
BETTER_AUTH_SECRET ─────> Encrypts sessions
```

### CLIENT needs:
```
VITE_BASEURL ───────────> Points to SERVER URL
```

## 🚀 Deployment Steps Visual

```
Step 1: Prepare
├─ Get Database URL
├─ Get API Keys
└─ Push code to GitHub

Step 2: Deploy Server
├─ Import from GitHub
├─ Select 'server' folder
├─ Add environment variables
└─ Deploy → Get SERVER_URL

Step 3: Deploy Client
├─ Import same GitHub repo
├─ Select 'client' folder
├─ Add VITE_BASEURL = SERVER_URL
└─ Deploy → Get CLIENT_URL

Step 4: Connect Everything
├─ Update SERVER: TRUSTED_ORIGINS = CLIENT_URL
├─ Update Stripe webhook URL
└─ Redeploy server

✅ DONE!
```

## 🔄 Update Workflow (After Deployment)

```
1. Make code changes in VS Code
          │
          ▼
2. Commit & Push to GitHub
          │
          ▼
3. Vercel detects changes
          │
          ▼
4. Automatically rebuilds & redeploys
          │
          ▼
5. Live site updates in 1-2 minutes!
```

## 📱 What Each Service Does

| Service | Purpose | Cost |
|---------|---------|------|
| **Vercel** | Hosts your app | FREE |
| **Vercel Postgres** | Stores user data | FREE tier |
| **OpenRouter** | AI text generation | Pay per use (~$0.001/req) |
| **Stripe** | Payment processing | Free (% fee on sales) |
| **GitHub** | Code storage | FREE |

## 🎯 Remember

- **2 separate Vercel projects**: One for client, one for server
- **Same GitHub repo**: Both projects use the same repository
- **Different folders**: Client uses `/client`, Server uses `/server`
- **Client talks to Server**: Via the VITE_BASEURL environment variable
- **Server talks to Client**: Via TRUSTED_ORIGINS (for CORS)

---

**Need to add a new feature?**
1. Edit code locally
2. Test with `npm run dev`
3. Push to GitHub
4. Vercel auto-deploys
5. ✅ Done!
