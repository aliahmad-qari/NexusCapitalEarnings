# Deployment Guide - ROI Wealth

This guide covers deploying the ROI Wealth application with:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas (production) / Local MongoDB (development)

## Prerequisites

1. **GitHub Account** - For version control
2. **Vercel Account** - For frontend deployment (vercel.com)
3. **Render Account** - For backend deployment (render.com)
4. **MongoDB Atlas Account** - For production database (mongodb.com/cloud/atlas)
5. **Node.js 18+** - For local development

---

## Part 1: Local Development Setup

### 1.1 Install Dependencies

```bash
npm install
```

### 1.2 Local MongoDB Setup

**Option A: Using Docker (Recommended)**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: Direct Installation**
- Download from: https://www.mongodb.com/try/download/community
- Install and start MongoDB service

### 1.3 Configure Local Environment

Create `.env` file in root directory:

```env
# Local Development
MONGODB_URI=mongodb://localhost:27017/nexuscapital
JWT_SECRET=supersecretlocaljwttestkey_changeinprod
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:3000
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 1.4 Run Locally

**Terminal 1 - Backend:**
```bash
npm run dev
```
Backend runs on: http://localhost:3000

**Terminal 2 - Frontend (in same directory):**
```bash
npm run build
npm run preview
```
Frontend runs on: http://localhost:4173

Or for development with hot reload:
```bash
npm run dev
```

---

## Part 2: MongoDB Atlas Setup (Production Database)

### 2.1 Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new project

### 2.2 Create a Cluster

1. Click "Create" → Select "M0 Free" tier
2. Choose cloud provider (AWS recommended)
3. Select region closest to your users
4. Click "Create Cluster"

### 2.3 Create Database User

1. Go to "Database Access"
2. Click "Add New Database User"
3. Create username and password (save these!)
4. Set permissions to "Atlas Admin"

### 2.4 Whitelist IP Addresses

1. Go to "Network Access"
2. Click "Add IP Address"
3. For development: Add your IP
4. For production: Add `0.0.0.0/0` (allows all IPs)

### 2.5 Get Connection String

1. Click "Connect" on your cluster
2. Select "Drivers"
3. Copy the connection string
4. Replace `<username>` and `<password>` with your credentials
5. Replace `<database>` with `nexuscapital`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/nexuscapital?retryWrites=true&w=majority
```

---

## Part 3: Backend Deployment on Render

### 3.1 Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/nexuscapital.git
git push -u origin main
```

### 3.2 Create Render Service

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Fill in details:
   - **Name**: nexuscapital-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for production)

### 3.3 Add Environment Variables

In Render dashboard, go to "Environment":

```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/nexuscapital?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=production
FRONTEND_URL=https://roiwealth.vercel.app
PORT=3000
```

### 3.4 Deploy

1. Click "Create Web Service"
2. Render will automatically deploy from your GitHub repo
3. Get your backend URL: `https://nexuscapitalearnings.onrender.com`

---

## Part 4: Frontend Deployment on Vercel

### 4.1 Update Frontend Configuration

Update `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://nexuscapitalearnings.onrender.com/api/$1"
    }
  ]
}
```

Update `.env.production`:
```env
VITE_API_URL=https://nexuscapitalearnings.onrender.com
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4.2 Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
npm install -g vercel
vercel
```

**Option B: Using Vercel Dashboard**
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4.3 Add Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://nexuscapitalearnings.onrender.com
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4.4 Deploy

1. Click "Deploy"
2. Vercel will build and deploy automatically
3. Get your frontend URL: `https://roiwealth.vercel.app`

---

## Part 5: CORS Configuration

### Backend CORS Setup (server.ts)

Already configured to allow:
- `http://localhost:5173` (local dev)
- `http://localhost:3000` (local dev)
- `https://roiwealth.vercel.app` (production)
- Any URL in `FRONTEND_URL` env var

### Frontend API Configuration (src/utils/api.ts)

```typescript
export const API_BASE = import.meta.env.VITE_API_URL || '';
```

This automatically uses:
- Local: `http://localhost:3000`
- Production: `https://nexuscapitalearnings.onrender.com`

---

## Part 6: Testing Deployment

### 6.1 Test Backend Health

```bash
curl https://nexuscapitalearnings.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected"
}
```

### 6.2 Test Registration

```bash
curl -X POST https://nexuscapitalearnings.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

### 6.3 Test Login

```bash
curl -X POST https://nexuscapitalearnings.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

### 6.4 Test Frontend

Visit: https://roiwealth.vercel.app
- Try registering a new account
- Try logging in
- Check browser console for any errors

---

## Part 7: Troubleshooting

### CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Check `FRONTEND_URL` in Render environment variables
2. Verify `vercel.json` rewrites are correct
3. Check browser console for exact error message

### Database Connection Errors

**Error**: `MongoDB connection error`

**Solution**:
1. Verify `MONGODB_URI` is correct
2. Check IP whitelist in MongoDB Atlas
3. Verify username/password are correct
4. Test connection string locally first

### Login/Register Not Working

**Error**: `Registration failed` or `Login failed`

**Solution**:
1. Check backend logs in Render dashboard
2. Verify `JWT_SECRET` is set in environment
3. Test API directly with curl
4. Check browser network tab for response

### Render Service Not Starting

**Error**: `Build failed` or `Service crashed`

**Solution**:
1. Check build logs in Render dashboard
2. Verify `npm start` works locally
3. Check all environment variables are set
4. Ensure `package.json` has correct scripts

---

## Part 8: Environment Variables Summary

### Local Development (.env)
```env
MONGODB_URI=mongodb://localhost:27017/nexuscapital
JWT_SECRET=supersecretlocaljwttestkey_changeinprod
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:3000
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Production - Render Backend
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/nexuscapital
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=production
FRONTEND_URL=https://roiwealth.vercel.app
PORT=3000
```

### Production - Vercel Frontend
```env
VITE_API_URL=https://nexuscapitalearnings.onrender.com
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

---

## Part 9: Continuous Deployment

Both Vercel and Render support automatic deployment:

1. **Push to GitHub**: `git push origin main`
2. **Vercel**: Automatically deploys frontend
3. **Render**: Automatically deploys backend

No manual deployment needed after initial setup!

---

## Part 10: Monitoring & Logs

### Render Logs
1. Go to Render dashboard
2. Select your service
3. Click "Logs" tab
4. View real-time logs

### Vercel Logs
1. Go to Vercel dashboard
2. Select your project
3. Click "Deployments"
4. Click on a deployment to see logs

---

## Quick Reference

| Component | Local | Production |
|-----------|-------|------------|
| Frontend | http://localhost:5173 | https://roiwealth.vercel.app |
| Backend | http://localhost:3000 | https://nexuscapitalearnings.onrender.com |
| Database | localhost:27017 | MongoDB Atlas |
| API Base | http://localhost:3000 | https://nexuscapitalearnings.onrender.com |

---

## Support

For issues:
1. Check logs in Render/Vercel dashboard
2. Test API with curl
3. Check environment variables
4. Review CORS configuration
5. Check MongoDB Atlas connection

