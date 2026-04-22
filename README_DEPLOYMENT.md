# ROI Wealth - Deployment & Setup Complete Guide

## 📋 Overview

This is a full-stack investment platform with:
- **Frontend**: React + Vite (Deploy to Vercel)
- **Backend**: Express + Node.js (Deploy to Render)
- **Database**: MongoDB (Local or MongoDB Atlas)
- **Authentication**: JWT-based
- **Features**: Investment plans, wallet, referrals, admin panel

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 18+
- MongoDB (local or Docker)
- Git

### Step 1: Clone & Install
```bash
git clone <your-repo-url>
cd nexuscapital
npm install
```

### Step 2: Start MongoDB
```bash
# Using Docker (easiest)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or install locally from: https://www.mongodb.com/try/download/community
```

### Step 3: Create .env
```bash
cp .env.example .env
```

Edit `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/nexuscapital
JWT_SECRET=supersecretlocaljwttestkey_changeinprod
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:3000
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 4: Run Development Server
```bash
npm run dev
```

Open: http://localhost:5173

---

## 📦 Project Structure

```
nexuscapital/
├── server/                 # Backend (Express)
│   ├── controllers/       # API handlers
│   ├── models/            # MongoDB schemas
│   ├── middlewares/       # Auth middleware
│   ├── routes/            # API routes
│   ├── jobs/              # Background jobs
│   └── utils/             # Utilities
├── src/                   # Frontend (React)
│   ├── components/        # Reusable components
│   ├── pages/             # Page components
│   ├── hooks/             # React hooks
│   └── utils/             # Utilities
├── server.ts              # Backend entry point
├── vite.config.ts         # Vite config
├── vercel.json            # Vercel config
├── render.yaml            # Render config
├── SETUP.md               # Local setup guide
└── DEPLOYMENT.md          # Deployment guide
```

---

## 🔧 Local Development

### Terminal 1: Backend
```bash
npm run dev
```
Runs on: http://localhost:3000

### Terminal 2: Frontend (optional, for hot reload)
```bash
npm run build && npm run preview
```
Runs on: http://localhost:4173

### Test Registration
1. Go to http://localhost:5173
2. Click "Join now"
3. Fill form and submit
4. Should redirect to dashboard

### Test Login
1. Go to http://localhost:5173/login
2. Enter credentials
3. Click "Initialize"
4. Should redirect to dashboard

---

## 🌐 Deployment Setup

### Part 1: MongoDB Atlas (Production Database)

1. **Create Account**: https://www.mongodb.com/cloud/atlas
2. **Create Cluster**: Select M0 Free tier
3. **Create User**: Database Access → Add user
4. **Whitelist IPs**: Network Access → Add 0.0.0.0/0
5. **Get Connection String**: Connect → Drivers
6. **Format**: `mongodb+srv://username:password@cluster.mongodb.net/nexuscapital`

### Part 2: Render Backend Deployment

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/nexuscapital.git
git push -u origin main
```

2. **Create Render Service**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect GitHub repo
   - Fill in:
     - Name: `nexuscapital-backend`
     - Build Command: `npm install`
     - Start Command: `npm start`

3. **Add Environment Variables**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nexuscapital
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=production
FRONTEND_URL=https://roiwealth.vercel.app
PORT=3000
```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment
   - Get URL: `https://nexuscapitalearnings.onrender.com`

### Part 3: Vercel Frontend Deployment

1. **Update vercel.json**
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

2. **Create Vercel Project**
   - Go to https://vercel.com
   - Click "Add New..." → "Project"
   - Import GitHub repo
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variables**
```
VITE_API_URL=https://nexuscapitalearnings.onrender.com
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Deploy**
   - Click "Deploy"
   - Get URL: `https://roiwealth.vercel.app`

---

## ✅ Testing Deployment

### Test Backend Health
```bash
curl https://nexuscapitalearnings.onrender.com/api/health
```

Expected:
```json
{
  "status": "ok",
  "database": "connected"
}
```

### Test Registration
```bash
curl -X POST https://nexuscapitalearnings.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

### Test Frontend
Visit: https://roiwealth.vercel.app
- Register new account
- Login
- Check dashboard

---

## 🔐 CORS Configuration

Backend accepts requests from:
- `http://localhost:5173` (local)
- `http://localhost:3000` (local)
- `https://roiwealth.vercel.app` (production)

**Allowed Headers**: Content-Type, Authorization
**Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS

---

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Wallet
- `POST /api/wallet/deposit` - Deposit (protected)
- `POST /api/wallet/withdraw` - Withdraw (protected)
- `GET /api/wallet/history` - History (protected)

### Investments
- `GET /api/investment/plans` - Get plans
- `POST /api/investment/create` - Create (protected)
- `GET /api/investment/my` - My investments (protected)

### Admin
- `GET /admin/users` - Users (admin only)
- `GET /admin/transactions` - Transactions (admin only)
- `POST /admin/approve-transaction` - Approve (admin only)
- `POST /admin/create-plan` - Create plan (admin only)

---

## 🐛 Troubleshooting

### CORS Error
**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Fix**:
1. Check `FRONTEND_URL` in Render env vars
2. Verify `vercel.json` rewrites
3. Check backend is running

### Database Connection Error
**Error**: `MongoDB connection error`

**Fix**:
1. Verify `MONGODB_URI` is correct
2. Check IP whitelist in MongoDB Atlas
3. Test connection string locally

### Login/Register Fails
**Error**: `Registration failed` or `Login failed`

**Fix**:
1. Check Render logs
2. Verify `JWT_SECRET` is set
3. Test API with curl
4. Check browser network tab

### Frontend Can't Connect to Backend
**Error**: `Failed to fetch`

**Fix**:
1. Check `VITE_API_URL` in Vercel env vars
2. Verify backend URL is correct
3. Check CORS headers
4. Test backend health endpoint

---

## 📊 Environment Variables Summary

### Local (.env)
```env
MONGODB_URI=mongodb://localhost:27017/nexuscapital
JWT_SECRET=supersecretlocaljwttestkey_changeinprod
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:3000
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Render Backend
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nexuscapital
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=production
FRONTEND_URL=https://roiwealth.vercel.app
PORT=3000
```

### Vercel Frontend
```env
VITE_API_URL=https://nexuscapitalearnings.onrender.com
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🔄 Continuous Deployment

Both Vercel and Render support automatic deployment:

1. Push to GitHub: `git push origin main`
2. Vercel automatically deploys frontend
3. Render automatically deploys backend
4. No manual deployment needed!

---

## 📚 Features

### User Features
- ✅ Register & Login
- ✅ Investment Plans (6 tiers)
- ✅ Create Investments
- ✅ Daily Profit Calculation
- ✅ Wallet Management
- ✅ Transaction History
- ✅ Referral Program
- ✅ Profile Management

### Admin Features
- ✅ User Management
- ✅ Transaction Approval
- ✅ Plan Management
- ✅ Admin Logs
- ✅ System Statistics
- ✅ User Blocking

---

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite 6
- TypeScript
- Tailwind CSS
- React Router
- Recharts

### Backend
- Express 4
- Node.js
- TypeScript
- MongoDB
- JWT
- bcryptjs
- node-cron

### Deployment
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

---

## 📞 Support

### Common Issues

**Q: How do I reset my password?**
A: Currently not implemented. Contact admin.

**Q: How do I become an admin?**
A: Update user document in MongoDB: `db.users.updateOne({email: "your@email.com"}, {$set: {isAdmin: true}})`

**Q: How do I test the API?**
A: Use curl or Postman. See API Endpoints section.

**Q: How do I view database?**
A: Use MongoDB Compass or mongosh CLI.

---

## 📖 Documentation

- **SETUP.md** - Local development setup
- **DEPLOYMENT.md** - Detailed deployment guide
- **API Endpoints** - See API Endpoints section above

---

## 🎯 Next Steps

1. ✅ Local setup (SETUP.md)
2. ✅ Test locally
3. ✅ Create MongoDB Atlas account
4. ✅ Deploy backend to Render
5. ✅ Deploy frontend to Vercel
6. ✅ Test production
7. ✅ Monitor logs

---

## 📄 License

MIT

---

## 👨‍💻 Author

ROI Wealth Team

---

**Last Updated**: April 2026
**Version**: 1.0.0

