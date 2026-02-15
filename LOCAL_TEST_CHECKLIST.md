# Local Development & Testing Checklist

## 📋 Quick Overview
- **Server**: Node.js/Express running on `http://localhost:3000`
- **Client**: React/Vite running on `http://localhost:5173`
- **Database**: PostgreSQL (Neon)
- **Auth**: Better Auth via `http://localhost:3000`

---

## 1️⃣ Environment Variables Status

### ✅ Server: `.env` (Already configured)
```
TRUSTED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
DATABASE_URL=your_database_url_here
BETTER_AUTH_SECRET=your_better_auth_secret_here
BETTER_AUTH_URL=http://localhost:3000
AI_API_KEY=your_openrouter_api_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NODE_ENV=development
AI_MODEL=openai/gpt-4o-mini
AI_MAX_TOKENS=2000
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
```
**Status**: ✅ Complete

### ✅ Client: `.env` (Already configured)
```
VITE_BASEURL=http://localhost:3000
```
**Note**: Client uses `VITE_BASEURL` (not `VITE_BETTER_AUTH_URL` in this setup)
**Status**: ✅ Complete

---

## 2️⃣ Database Connection

**Provider**: PostgreSQL (Neon Cloud)
**Setup Status**: ✅ Already configured
**Connection URL**: Already in `.env`

### Verify Connection:
```bash
cd AI-BUILDERS/server
npm run build  # This runs: tsc && prisma generate
```

---

## 3️⃣ Installation Steps

### Server Setup:
```bash
cd AI-BUILDERS/server
npm install
npm run build
```

**Expected dependencies**:
- `express` (5.2.1)
- `@prisma/client` (6.19.2)
- `better-auth` (1.4.12)
- `openai` (6.16.0)
- `stripe` (20.3.1)
- `cors`, `dotenv`

### Client Setup:
```bash
cd AI-BUILDERS/client
npm install
```

**Expected dependencies**:
- `react` (19.2.0)
- `react-router-dom` (7.12.0)
- `axios` (1.13.2)
- `better-auth` (1.4.13)
- `vite` (7.2.4)
- Tailwind CSS

---

## 4️⃣ Running the Application

### Start Server (Terminal 1):
```bash
cd AI-BUILDERS/server
npm run server  # Uses nodemon for auto-reload
```
**Expected output**:
```
Server is running at http://localhost:3000
```

### Start Client (Terminal 2):
```bash
cd AI-BUILDERS/client
npm run dev
```
**Expected output**:
```
Local:   http://localhost:5173
```

---

## 5️⃣ API Endpoints Testing

### Authentication routes (via Better Auth):
- `POST /api/auth/sign-up` - Register user
- `POST /api/auth/sign-in` - Login user
- `GET /api/auth/session` - Get current session

### User routes (Protected - need session token):
- `GET /api/user/credits` - Get user credits
- `POST /api/user/project` - Create new project
- `GET /api/user/projects` - List user projects
- `GET /api/user/project/:projectId` - Get single project
- `POST /api/user/project-toggle/:projectId` - Toggle publish status
- `POST /api/user/purchase-credits` - Purchase credits

### Project routes:
- `POST /api/project/revision/:projectId` - Make AI revision
- `PUT /api/project/save/:projectId` - Save project code
- `POST /api/project/rollback/:projectId` - Rollback to version
- `DELETE /api/project/:projectId` - Delete project
- `GET /api/project/preview/:projectId` - Preview project (protected)
- `GET /api/project/published` - Get published projects (public)
- `GET /api/project/published/:projectId` - Get published project (public)

### Test endpoints:
- `GET /` → Response: "Server is Live!"
- `GET /api` → Response: "API is Live!"

---

## 6️⃣ Database Schema

**Tables**:
1. **user** - User accounts with credits
   - Fields: id, email, name, totalCreation, credits, createdAt, updatedAt, emailVerified
   - Relations: projects, sessions, accounts, transactions

2. **websiteProject** - AI-generated projects
   - Fields: id, name, initial_prompt, current_code, current_version_index, userId, isPublished
   - Relations: conversations, versions, user

3. **conversation** - Chat history
   - Fields: id, role (user/assistant), content, timestamp, projectId
   - Relations: project

4. **version** - Code versions
   - Fields: id, code, description, timestamp, projectId
   - Relations: project

5. **transaction** - Payment transactions
   - Fields: id, isPaid, planId, amount, credits, userId, createdAt, updatedAt
   - Relations: user

6. **session** - Auth sessions
7. **account** - Auth accounts

---

## 7️⃣ Key Configuration Points

### Axios (Client)
```typescript
// client/src/configs/axios.ts
baseURL: import.meta.env.VITE_BASEURL || 'http://localhost:3000'
withCredentials: true  // Sends cookies with requests
```

### CORS (Server)
```typescript
// Allowed origins from TRUSTED_ORIGINS env var
origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000']
credentials: true
```

### Cookie Settings (Better Auth)
```typescript
// Development: httpOnly: true, secure: false, sameSite: 'lax'
// Production: httpOnly: true, secure: true, sameSite: 'none'
```

### AI Model
- **Provider**: OpenRouter (https://openrouter.ai/api/v1)
- **Model**: `openai/gpt-4o-mini`
- **Max Tokens**: 2000
- **Revision Cost**: 5 credits
- **Project Creation Cost**: 5 credits

### Stripe
- **Test Secret**: `your_stripe_test_secret_key_here`
- **Webhook Secret**: `your_stripe_webhook_secret_here`

---

## 8️⃣ Common Issues & Solutions

### Issue: "CORS error"
**Solution**: Check `TRUSTED_ORIGINS` includes your client URL (5173)

### Issue: "Cannot connect to database"
**Solution**: Verify DATABASE_URL is correct and internet connection is active
```bash
# Test connection:
npm run build  # Requires successful DB connection
```

### Issue: "AI_API_KEY not set"
**Solution**: Ensure AI_API_KEY is in `.env`

### Issue: "BETTER_AUTH_SECRET not configured"
**Solution**: Verify BETTER_AUTH_SECRET and BETTER_AUTH_URL are both set

### Issue: "Credits not deducting"
**Solution**: Ensure database migrations ran (prisma generate in postinstall)

### Issue: "Session not persisting"
**Solution**: Check cookies in browser DevTools → Application → Cookies
- Cookie name: `auth_session`
- Should have `httpOnly` flag set

---

## 9️⃣ Testing Steps

### Step 1: Health Check
```bash
curl http://localhost:3000/
curl http://localhost:3000/api
```

### Step 2: Session Check
```bash
# After signing up/in, check cookies
# DevTools → Network tab → Response Headers
# Should have: Set-Cookie: auth_session=...
```

### Step 3: Create Project Flow
1. Sign up at http://localhost:5173
2. Click "Create New Project"
3. Enter project description
4. System deducts 5 credits
5. Project appears in "My Projects"

### Step 4: Make Revision
1. Open project editor
2. Enter revision prompt
3. System deducts 5 credits
4. AI generates new code
5. Code appears in editor

### Step 5: Publish Project
1. Toggle "Publish" in project settings
2. Visit `GET /api/project/published` → should see listed

---

## 🔟 Build & Deploy Check

### Production Build:
```bash
# Client
cd client
npm run build  # Creates dist/ folder

# Server
cd server
npm run build  # Creates compiled .js files
```

### Vercel Deployment (Scripts ready):
```json
"vercel-build": "prisma generate && tsc"  // Runs on Vercel
```

---

## ✨ Everything Configured

All environment variables are properly set up for local development. You should be able to:
1. Install dependencies
2. Run server on port 3000
3. Run client on port 5173
4. Sign up/Login
5. Create projects with AI
6. Make revisions
7. Purchase credits
8. Publish projects

**Ready to test!** 🚀
