# Deployment Checklist – Krishi AI Advisor 🌾

This document provides a pre-flight checklist for deploying the Krishi AI Advisor application to production environments (Render for Backend, Vercel for Frontend, and MongoDB Atlas for Database).

---

## 🗄️ 1. MongoDB Atlas Setup Checklist

- [ ] **Cluster Creation**: Free-tier M0 cluster created in target region (e.g., AWS / ap-south-1 Mumbai).
- [ ] **Database User**: Dedicated database user created with `readWriteAnyDatabase` or specific DB privileges.
- [ ] **Network Access**: IP Access List configured (add `0.0.0.0/0` for cloud platform hosting like Render).
- [ ] **Connection String**: URI string copied and password substituted (`mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/krishi_ai_advisor`).

---

## ⚙️ 2. Backend Deployment Checklist (Render)

- [ ] **Repository Link**: GitHub repository connected to Render Web Service.
- [ ] **Root Directory**: Set to `backend`.
- [ ] **Runtime & Environment**: Set to `Node`.
- [ ] **Build Command**: `npm install`
- [ ] **Start Command**: `npm start` (or `node src/server.js`)
- [ ] **Environment Variables**:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=5000` (Render overrides dynamically)
  - [ ] `MONGO_URI=<your_mongodb_atlas_uri>`
  - [ ] `JWT_SECRET=<strong_secret_key>`
  - [ ] `CLIENT_URL=https://krishi-ai-advisor.vercel.app`
  - [ ] `BACKEND_URL=https://krishi-ai-advisor.onrender.com`
  - [ ] `GEMINI_API_KEY=<your_google_gemini_api_key>`
  - [ ] `GOOGLE_CLIENT_ID=<your_google_oauth_client_id>`
  - [ ] `GOOGLE_CLIENT_SECRET=<your_google_oauth_client_secret>`
- [ ] **Health Check Endpoint**: `/` configured (returns `{ status: "success" }`).

---

## 🌐 3. Frontend Deployment Checklist (Vercel)

- [ ] **Repository Link**: GitHub repository connected to Vercel Project.
- [ ] **Framework Preset**: `Vite`
- [ ] **Root Directory**: Set to `frontend`.
- [ ] **Build Command**: `npm run build`
- [ ] **Output Directory**: `dist`
- [ ] **Environment Variables**:
  - [ ] `VITE_API_URL=https://krishi-ai-advisor.onrender.com`
- [ ] **SPA Routing**: `vercel.json` verified with rewrite rules to `index.html`:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```

---

## 🔑 4. Google OAuth Production Configuration Checklist

- [ ] **Google Cloud Console**: Access **APIs & Services > Credentials**.
- [ ] **Authorized JavaScript Origins**: Added `https://krishi-ai-advisor.vercel.app`.
- [ ] **Authorized Redirect URIs**: Added `https://krishi-ai-advisor.onrender.com/api/auth/google/callback`.

---

## 🧪 5. Post-Deployment Verification Checklist

- [ ] **Backend Health Check**: Open `https://krishi-ai-advisor.onrender.com/` and confirm status 200.
- [ ] **User Registration**: Register a test user account.
- [ ] **User Login**: Log in with credentials and verify JWT receipt in localStorage.
- [ ] **Google OAuth**: Test Google Sign-In redirect and callback.
- [ ] **AI Advisor Chat**: Send a query and verify Gemini AI response or offline fallback.
- [ ] **Weather & Guides**: Verify weather alerts, diseases, pests, and post-harvest guides load from MongoDB Atlas.
