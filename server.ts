import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
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
    { name: 'Starter Plan',  investmentAmount: 300,   dailyROI: 3, durationDays: 10 },
    { name: 'Bronze Plan',   investmentAmount: 1000,  dailyROI: 3, durationDays: 10 },
    { name: 'Silver Plan',   investmentAmount: 3000,  dailyROI: 3, durationDays: 10 },
    { name: 'Gold Plan',     investmentAmount: 5000,  dailyROI: 3, durationDays: 10 },
    { name: 'Diamond Plan',  investmentAmount: 10000, dailyROI: 3, durationDays: 10 },
  ];

  for (const p of canonical) {
    const exists = await InvestmentPlan.findOne({ name: p.name });
    if (!exists) {
      await InvestmentPlan.create({ ...p, isActive: true });
      logger.info(`✅ Added missing plan: ${p.name} (PKR ${p.investmentAmount})`);
    } else {
      // Always sync canonical values (ROI, duration, amount) and ensure active
      exists.investmentAmount = p.investmentAmount;
      exists.dailyROI         = p.dailyROI;
      exists.durationDays     = p.durationDays;
      if (!exists.isActive) exists.isActive = true;
      await exists.save();
      logger.info(`✅ Synced plan: ${p.name} → ${p.dailyROI}%/day, ${p.durationDays} days`);
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

  // ── CORS Configuration ────────────────────────────────────────────
  //
  // Allowed origins are built from three sources (all merged into one Set):
  //   1. Hardcoded dev origins (localhost variants)
  //   2. CORS_ALLOWED_ORIGINS env var — comma-separated list for production
  //      e.g. "https://nexuscapitalbusiness.com,https://www.nexuscapitalbusiness.com"
  //   3. Legacy FRONTEND_URL / ADDITIONAL_ORIGINS env vars (backwards compat)
  //
  // On Render, set ONE env var:
  //   Key:   CORS_ALLOWED_ORIGINS
  //   Value: https://nexuscapitalbusiness.com,https://www.nexuscapitalbusiness.com
  // ─────────────────────────────────────────────────────────────────

  const parseOriginList = (raw: string | undefined): string[] =>
    (raw || '').split(',').map(s => s.trim()).filter(Boolean);

  const allowedOrigins = new Set<string>([
    // ── Dev ───────────────────────────────────────────────────────
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    // ── Production — both www and non-www ─────────────────────────
    'https://nexuscapitalbusiness.com',
    'https://www.nexuscapitalbusiness.com',
    // ── Previous Vercel deployments (keep for backwards compat) ───
    'https://nexus-capital-earnings.vercel.app',
    'https://roiwealth.vercel.app',
    // ── From environment variables (runtime-configurable) ─────────
    ...parseOriginList(process.env.CORS_ALLOWED_ORIGINS),
    ...parseOriginList(process.env.ADDITIONAL_ORIGINS),
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  ]);

  logger.info(`🌐 CORS allowed origins: ${[...allowedOrigins].join(', ')}`);

  const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
      // ── No origin: server-to-server, curl, mobile native apps ───
      if (!origin) return callback(null, true);

      // ── Exact match against allowlist ────────────────────────────
      if (allowedOrigins.has(origin)) return callback(null, true);

      // ── Vercel preview deployments (*.vercel.app) ────────────────
      if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) return callback(null, true);

      // ── Local network / dev IPs ──────────────────────────────────
      if (/^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }

      // ── Capacitor Android/iOS WebView ────────────────────────────
      if (origin === 'capacitor://localhost' || origin === 'https://localhost') {
        return callback(null, true);
      }

      logger.warn(`🚫 CORS blocked: ${origin}`);
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    optionsSuccessStatus: 204, // Some legacy browsers choke on 200 for OPTIONS
  };

  // Apply CORS globally — must be before all other middleware
  app.use(cors(corsOptions));

  // Explicit OPTIONS preflight handler — catches ALL routes before any auth middleware
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
    // Resolve from the file's own location, not cwd, so the path is correct
    // regardless of where the process was launched from.
    const distPath = path.join(__dirname, 'dist');
    const indexHtml = path.join(distPath, 'index.html');

    // Fail loudly at boot if the build output is missing. Without this the SPA
    // catch-all below would happily serve index.html (text/html) in place of
    // the JS/CSS bundles, producing 500s and MIME-type mismatch errors that are
    // very hard to diagnose. Better to crash with a clear message.
    if (!fs.existsSync(indexHtml)) {
      logger.error(`Build output missing: ${indexHtml} not found.`);
      logger.error('Run "npm run build" before starting in production (VITE_API_URL must be set).');
      process.exit(1);
    }

    app.use(express.static(distPath));

    // SPA fallback — only for client-side routes. Anything that looks like a
    // static asset (has a file extension) or an unmatched API path must NOT be
    // rewritten to index.html, otherwise a missing asset is masked as HTML.
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || path.extname(req.path)) {
        return res.status(404).send('Not found');
      }
      res.sendFile(indexHtml, (err) => {
        if (err) next(err);
      });
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
