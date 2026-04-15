# ShopMind.ai 🛍️
Full-stack SaaS — AI shopping assistant businesses embed on their website.

---

## 🔑 CREDENTIALS — EXACTLY WHERE TO ADD THEM

### Backend — `backend/.env` (create this file)
```
GROQ_API_KEY=        ← Get from console.groq.com (FREE)
SUPABASE_URL=        ← Get from supabase.com project settings
SUPABASE_SERVICE_KEY=← Get from supabase.com project settings (service_role)
JWT_SECRET=          ← Generate yourself (command below)
FRONTEND_URL=        ← http://localhost:5173 (dev) or your Vercel URL (prod)
BACKEND_URL=         ← http://localhost:4000 (dev) or your Railway URL (prod)
```

### Frontend — `frontend/.env` (create this file)
```
VITE_BACKEND_URL=    ← http://localhost:4000 (dev) or your Railway URL (prod)
```

**That's it. 6 values total. NO keys in frontend except backend URL.**

---

## 🚀 SETUP STEP BY STEP

### Step 1 — Get Groq API Key (2 min, FREE)
1. Go to https://console.groq.com
2. Sign up with GitHub
3. Click "API Keys" → "Create API Key"
4. Copy the key → paste as `GROQ_API_KEY`

### Step 2 — Set up Supabase (5 min, FREE)
1. Go to https://supabase.com → New Project
2. Wait for project to be ready (~1 min)
3. Go to **SQL Editor** → paste entire `backend/supabase-schema.sql` → click Run
4. Go to **Settings → API**:
   - Copy "Project URL" → paste as `SUPABASE_URL`
   - Copy "service_role" key → paste as `SUPABASE_SERVICE_KEY`

### Step 3 — Generate JWT Secret
Run this in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy output → paste as `JWT_SECRET`

### Step 4 — Run Backend
```bash
cd backend
cp .env.example .env
# Fill in all values in .env
npm install
npm run dev
# Backend runs at http://localhost:4000
```

### Step 5 — Run Frontend
```bash
cd frontend
cp .env.example .env
# VITE_BACKEND_URL=http://localhost:4000
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

### Step 6 — Open & Test
1. Go to http://localhost:5173
2. Click "Get Started Free" → create account
3. Go to Catalog → upload a CSV
4. Go to Preview Chat → test your AI
5. Go to Widget → copy embed code

---

## 📦 CSV FORMAT
Required: `name`, `price`
Optional: `category`, `description`, `tags` (comma-separated), `emoji`, `in_stock`

Example:
```csv
name,category,price,description,tags,emoji,in_stock
Nike Air Max,Fashion,9995,Classic lifestyle sneaker,"shoes,nike,lifestyle",👟,true
Sony Headphones,Electronics,29990,Noise cancelling,"audio,wireless,sony",🎧,true
```

---

## 🚀 FREE DEPLOYMENT

### Backend → Railway (FREE $5/month credit)
1. Push `backend/` folder to GitHub
2. Go to https://railway.app → New Project → Deploy from GitHub
3. Select your repo
4. Go to Variables → add all 6 backend .env values
5. Add `BACKEND_URL=https://your-app.railway.app`
6. Deploy → copy your Railway URL

### Frontend → Vercel (FREE forever)
1. Push `frontend/` folder to GitHub
2. Go to https://vercel.com → New Project → Import from GitHub
3. Go to Settings → Environment Variables:
   - Add `VITE_BACKEND_URL=https://your-app.railway.app`
4. Deploy → copy your Vercel URL

### Update CORS after deployment
In Railway variables, update:
```
FRONTEND_URL=https://your-app.vercel.app
```

---

## 🔒 SECURITY — WHAT'S PROTECTED
- ✅ No API keys in frontend
- ✅ JWT auth on every dashboard request
- ✅ Widget key auth for embedded widgets
- ✅ Each business can only see their own products/analytics
- ✅ Rate limiting on all routes
- ✅ Input sanitization
- ✅ Helmet.js security headers
- ✅ Widget JS served directly from backend (no CDN needed)

---

## 📁 PROJECT STRUCTURE
```
shopmind-final/
├── backend/
│   ├── routes/
│   │   ├── auth.js       ← signup, login, /me
│   │   ├── catalog.js    ← CSV upload, list, delete
│   │   ├── chat.js       ← Groq AI (key lives here ONLY)
│   │   ├── analytics.js  ← dashboard stats
│   │   └── widget.js     ← embed code + key rotation
│   ├── middleware/
│   │   ├── auth.js       ← JWT verification
│   │   ├── rateLimit.js  ← brute force protection
│   │   └── sanitize.js   ← input cleaning
│   ├── lib/supabase.js   ← DB client
│   ├── server.js         ← Express app (widget served here)
│   ├── supabase-schema.sql ← Run this FIRST in Supabase
│   └── .env.example      ← Copy → .env → fill values
│
├── frontend/
│   ├── src/pages/        ← Landing, Auth, Dashboard pages
│   ├── src/hooks/        ← useAuth (global state)
│   ├── src/lib/api.js    ← all backend calls
│   ├── src/styles/       ← all CSS
│   └── .env.example      ← Copy → .env → fill value
│
└── widget/
    └── shopmind-widget.js ← paste on any website
```
