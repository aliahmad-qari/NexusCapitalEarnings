# ROI Wealth - Complete Setup Guide

## Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start MongoDB Locally

**Using Docker (Recommended):**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Or install MongoDB Community Edition:**
- Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
- Mac: `brew tap mongodb/brew && brew install mongodb-community`
- Linux: https://docs.mongodb.com/manual/administration/install-on-linux/

### 3. Configure Environment

Create `.env` file in root:
```env
MONGODB_URI=mongodb://localhost:27017/nexuscapital
JWT_SECRET=supersecretlocaljwttestkey_changeinprod
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:3000
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server

**Terminal 1 - Backend:**
```bash
npm run dev
```
Runs on: http://localhost:3000

**Terminal 2 - Frontend:**
```bash
npm run build && npm run preview
```
Runs on: http://localhost:4173

Or for hot reload development:
```bash
npm run dev
```

### 5. Test the Application

1. Open http://localhost:5173 (or 4173)
2. Click "Join now" to register
3. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: TestPassword123
   - Confirm Password: TestPassword123
4. Click "Deploy Identity"
5. You should be logged in and see the dashboard

---

## Project Structure

```
nexuscapital/
├── server/                    # Backend (Express + Node.js)
│   ├── controllers/          # API endpoint handlers
│   │   ├── authController.ts
│   │   ├── walletController.ts
│   │   ├── investmentController.ts
│   │   ├── adminController.ts
│   │   └── analyticsController.ts
│   ├── models/               # MongoDB schemas
│   │   ├── User.ts
│   │   ├── Investment.ts
│   │   ├── Transaction.ts
│   │   └── AdminLog.ts
│   ├── middlewares/          # Express middlewares
│   │   └── auth.ts           # JWT authentication
│   ├── routes/               # API routes
│   │   └── api.ts
│   ├── jobs/                 # Background jobs
│   │   └── profitJob.ts      # Daily profit calculation
│   └── utils/                # Utilities
│       └── logger.ts         # Winston logger
├── src/                      # Frontend (React + Vite)
│   ├── components/           # Reusable components
│   ├── pages/                # Page components
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Wallet.tsx
│   │   ├── Plans.tsx
│   │   ├── MyInvestments.tsx
│   │   ├── History.tsx
│   │   ├── Profile.tsx
│   │   ├── Referrals.tsx
│   │   ├── Admin/            # Admin pages
│   │   └── ...
│   ├── hooks/                # React hooks
│   │   └── useAuth.tsx       # Authentication context
│   ├── utils/                # Utilities
│   │   └── api.ts            # API configuration
│   ├── App.tsx               # Main app component
│   └── main.tsx              # Entry point
├── server.ts                 # Backend entry point
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies
├── .env                      # Local environment variables
├── .env.example              # Example environment variables
├── vercel.json               # Vercel deployment config
├── render.yaml               # Render deployment config
├── DEPLOYMENT.md             # Deployment guide
└── SETUP.md                  # This file
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Wallet
- `POST /api/wallet/deposit` - Create deposit request (protected)
- `POST /api/wallet/withdraw` - Create withdrawal request (protected)
- `GET /api/wallet/history` - Get transaction history (protected)

### Investments
- `GET /api/investment/plans` - Get all investment plans
- `POST /api/investment/create` - Create investment (protected)
- `GET /api/investment/my` - Get user's investments (protected)

### Analytics
- `GET /analytics/performance` - Get performance data (protected)

### Admin (Admin only)
- `POST /api/admin/approve-transaction` - Approve/reject transactions
- `POST /api/admin/create-plan` - Create investment plan
- `GET /api/admin/transactions` - Get all transactions
- `GET /api/admin/users` - Get all users
- `POST /api/admin/user-status` - Block/unblock users
- `DELETE /api/admin/user/:userId` - Delete user
- `GET /api/admin/logs` - Get admin logs
- `GET /api/admin/stats` - Get system statistics

---

## Database Models

### User
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  referralCode: string (unique)
  referredBy: string (optional)
  wallet: {
    totalBalance: number
    depositBalance: number
    profitBalance: number
    referralEarnings: number
  }
  investmentGoal: {
    targetAmount: number
    targetDate: Date
  }
  isAdmin: boolean
  isBlocked: boolean
  createdAt: Date
}
```

### Investment
```typescript
{
  user: ObjectId (ref: User)
  plan: ObjectId (ref: InvestmentPlan)
  amount: number
  dailyProfitPercent: number
  startDate: Date
  endDate: Date
  lastProfitCalc: Date
  totalProfitEarned: number
  status: 'active' | 'completed'
}
```

### InvestmentPlan
```typescript
{
  name: string
  dailyProfitPercent: number
  minInvestment: number
  maxInvestment: number
  durationDays: number
  features: string[]
}
```

### Transaction
```typescript
{
  user: ObjectId (ref: User)
  type: 'deposit' | 'withdraw' | 'investment' | 'profit' | 'referral'
  amount: number
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  description: string
  createdAt: Date
}
```

---

## Authentication Flow

### Registration
1. User fills registration form
2. Frontend sends POST to `/api/auth/register`
3. Backend validates input and checks if email exists
4. Password is hashed with bcryptjs (salt: 12)
5. User document created with unique referral code
6. JWT token generated (7-day expiry)
7. Token and user data returned to frontend
8. Frontend stores token in localStorage
9. User redirected to dashboard

### Login
1. User enters email and password
2. Frontend sends POST to `/api/auth/login`
3. Backend finds user by email
4. Password compared with hashed password
5. JWT token generated if credentials valid
6. Token and user data returned to frontend
7. Frontend stores token in localStorage
8. User redirected to dashboard

### Protected Routes
1. Frontend checks if token exists in localStorage
2. If no token, redirect to login
3. If token exists, include in Authorization header: `Bearer <token>`
4. Backend middleware verifies token
5. If valid, request proceeds
6. If invalid/expired, return 401 Unauthorized

---

## Environment Variables

### Local Development (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/nexuscapital

# JWT
JWT_SECRET=supersecretlocaljwttestkey_changeinprod

# Server
PORT=3000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173

# Frontend API
VITE_API_URL=http://localhost:3000

# Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Production - Render Backend
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nexuscapital
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

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (local frontend)
- `http://localhost:3000` (local backend)
- `https://roiwealth.vercel.app` (production frontend)
- Any URL in `FRONTEND_URL` environment variable

**CORS Headers Allowed:**
- `Content-Type`
- `Authorization`

**CORS Methods Allowed:**
- GET, POST, PUT, DELETE, OPTIONS

---

## Common Issues & Solutions

### Issue: "Cannot find module 'tsx'"
**Solution:**
```bash
npm install -g tsx
# or
npm install
```

### Issue: MongoDB connection refused
**Solution:**
1. Check if MongoDB is running: `mongosh` or `mongo`
2. If not running, start it:
   - Docker: `docker start mongodb`
   - Windows: Start MongoDB service
   - Mac: `brew services start mongodb-community`

### Issue: "CORS error" in browser
**Solution:**
1. Check `FRONTEND_URL` in `.env`
2. Verify backend is running on correct port
3. Check browser console for exact error
4. Verify `vercel.json` rewrites are correct

### Issue: Login/Register returns 500 error
**Solution:**
1. Check backend logs: `npm run dev`
2. Verify `JWT_SECRET` is set in `.env`
3. Check MongoDB connection
4. Verify email is not already registered

### Issue: "Invalid token" error
**Solution:**
1. Clear localStorage: `localStorage.clear()`
2. Refresh page and login again
3. Check `JWT_SECRET` matches between frontend and backend

### Issue: Frontend can't connect to backend
**Solution:**
1. Verify `VITE_API_URL` in `.env`
2. Check backend is running on correct port
3. Check CORS configuration
4. Test API directly: `curl http://localhost:3000/api/health`

---

## Testing

### Test Backend Health
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected"
}
```

### Test Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

### Test Protected Route
```bash
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Development Tips

### Hot Reload
- Frontend: Changes to React files auto-reload
- Backend: Use `npm run dev` with tsx for auto-reload

### Debugging
- Backend: Check console output from `npm run dev`
- Frontend: Use browser DevTools (F12)
- Network: Check browser Network tab for API calls

### Database
- View data: Use MongoDB Compass or `mongosh`
- Clear data: `db.dropDatabase()` in mongosh

### Logs
- Backend: Check terminal output
- Frontend: Check browser console (F12)
- Render: Check dashboard logs
- Vercel: Check deployment logs

---

## Next Steps

1. **Local Testing**: Follow "Quick Start" section
2. **Database Setup**: Set up MongoDB Atlas account
3. **Backend Deployment**: Deploy to Render (see DEPLOYMENT.md)
4. **Frontend Deployment**: Deploy to Vercel (see DEPLOYMENT.md)
5. **Production Testing**: Test all features on live URLs
6. **Monitoring**: Set up error tracking and monitoring

---

## Support & Resources

- **MongoDB**: https://docs.mongodb.com
- **Express**: https://expressjs.com
- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **Vercel**: https://vercel.com/docs
- **Render**: https://render.com/docs
- **JWT**: https://jwt.io

