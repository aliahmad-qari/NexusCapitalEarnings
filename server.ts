import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import logger from './server/utils/logger.ts';
import apiRoutes from './server/routes/api.ts';
import { initCronJobs } from './server/jobs/profitJob.ts';
import { InvestmentPlan } from './server/models/Investment.ts';

dotenv.config();

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error('Missing required environment variables: MONGODB_URI, JWT_SECRET');
  process.exit(1);
}

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! ðŸ’¥ Shutting down...');
  logger.error(err.name, err.message);
  logger.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('UNHANDLED REJECTION! ðŸ’¥ Shutting down...');
  logger.error(reason);
  process.exit(1);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedPlans() {
  const count = await InvestmentPlan.countDocuments();
  if (count === 0) {
    const plans = [
      { name: 'Starter Plan', dailyProfitPercent: 5, minInvestment: 10, maxInvestment: 499, durationDays: 30, features: ['5% Daily Profit', 'Duration 30 Days', 'Automated Profits'] },
      { name: 'Silver Plan', dailyProfitPercent: 7, minInvestment: 500, maxInvestment: 999, durationDays: 30, features: ['7% Daily Profit', 'Priority Support', 'Daily Withdrawals'] },
      { name: 'Gold Plan', dailyProfitPercent: 10, minInvestment: 1000, maxInvestment: 4999, durationDays: 30, features: ['10% Daily Profit', 'Gold Badge', 'Instant Payouts'] },
      { name: 'Platinum Plan', dailyProfitPercent: 12, minInvestment: 5000, maxInvestment: 9999, durationDays: 45, features: ['12% Daily Profit', 'Platinum Support', 'Lower Fees'] },
      { name: 'VIP Plan', dailyProfitPercent: 15, minInvestment: 10000, maxInvestment: 50000, durationDays: 60, features: ['15% Daily Profit', 'Personal Manager', 'Zero Fees'] },
      { name: 'Custom Plan', dailyProfitPercent: 20, minInvestment: 50000, maxInvestment: 1000000, durationDays: 90, features: ['20% Daily Profit', 'Custom Term', 'Elite Status'] },
    ];
    await InvestmentPlan.insertMany(plans);
    logger.info('Initial plans seeded');
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Database Connection
  const MONGODB_URI = process.env.MONGODB_URI;
  
  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
  }).then(async () => {
    logger.info('Connected to MongoDB');
    await seedPlans();
    initCronJobs();
  }).catch(err => {
    logger.error('MongoDB connection error:', err);
  });

  // CORS Configuration - Allow specific origins
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://nexus-capital-earnings.vercel.app',
    'https://roiwealth.vercel.app',
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200,
  }));

  // Explicit OPTIONS handler for preflight requests
  app.options('*', cors());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use('/api', apiRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
