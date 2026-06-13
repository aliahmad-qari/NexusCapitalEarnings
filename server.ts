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

dotenv.config({ path: '.env' });

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
  // ── Remove exact duplicate plan names (keep the oldest) ──────────
  const allPlans = await InvestmentPlan.find().sort({ createdAt: 1 });
  const seen = new Set<string>();
  for (const p of allPlans) {
    const key = `${p.name.toLowerCase().trim()}`;
    if (seen.has(key)) {
      await InvestmentPlan.findByIdAndDelete(p._id);
      logger.info(`🗑 Removed duplicate plan: ${p.name}`);
    } else {
      seen.add(key);
    }
  }

  // ── Ensure the canonical 5 plans exist ───────────────────────────
  const canonical = [
    { name: 'Starter Plan',  investmentAmount: 300,   dailyROI: 10, durationDays: 7 },
    { name: 'Bronze Plan',   investmentAmount: 1000,  dailyROI: 10, durationDays: 7 },
    { name: 'Silver Plan',   investmentAmount: 3000,  dailyROI: 10, durationDays: 7 },
    { name: 'Gold Plan',     investmentAmount: 5000,  dailyROI: 10, durationDays: 7 },
    { name: 'Diamond Plan',  investmentAmount: 10000, dailyROI: 10, durationDays: 7 },
  ];

  for (const p of canonical) {
    const exists = await InvestmentPlan.findOne({ name: p.name });
    if (!exists) {
      await InvestmentPlan.create({ ...p, isActive: true });
      logger.info(`✅ Added missing plan: ${p.name} (PKR ${p.investmentAmount})`);
    } else if (!exists.isActive) {
      // Re-activate if it was accidentally deactivated
      exists.isActive = true;
      await exists.save();
      logger.info(`✅ Re-activated plan: ${p.name}`);
    }
  }

  const count = await InvestmentPlan.countDocuments();
  logger.info(`📋 Plans ready: ${count} active in DB`);
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

  // CORS Configuration - MUST be first middleware
  // Uses a function so we can match dynamic Vercel preview URLs (*.vercel.app)
  // alongside the hardcoded production origins.
  const allowedOrigins = new Set([
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://nexus-capital-earnings.vercel.app',
    'https://roiwealth.vercel.app',
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
    ...(process.env.ADDITIONAL_ORIGINS
      ? process.env.ADDITIONAL_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)
      : []),
  ]);

  const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile apps, server-to-server)
      if (!origin) return callback(null, true);

      // Exact match against allowlist
      if (allowedOrigins.has(origin)) return callback(null, true);

      // Allow ANY Vercel preview / deployment URL (*.vercel.app)
      if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) return callback(null, true);

      // Allow local network IPs during development
      if (/^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }

      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200,
  };

  // Apply CORS to all routes
  app.use(cors(corsOptions));

  // Explicit preflight handler — must be before any route handlers
  app.options('*', cors(corsOptions));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use('/api', apiRoutes);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
  });

  // Serve uploaded files (deposit screenshots, etc.)
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

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

  const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
  app.listen(PORT, HOST, () => {
    logger.info(`Server environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`Server running on http://${HOST}:${PORT}`);
    if (process.env.NODE_ENV !== 'production') {
      logger.info(`Local access: http://localhost:${PORT}`);
      logger.info(`Network access: http://127.0.0.1:${PORT}`);
    }
  });
}

startServer();
