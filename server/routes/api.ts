import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { register, login, getProfile, updateProfile } from '../controllers/authController.ts';
import { deposit, createManualDeposit, withdraw, getHistory, getUserDeposits } from '../controllers/walletController.ts';
import { getPlans, createDepositRequest, getMyInvestments, getMyReferrals } from '../controllers/investmentController.ts';
import { 
  approveTransaction, 
  createPlan, 
  updatePlan,
  deletePlan,
  getAllTransactions,
  getAllPlans,
  getPendingDeposits,
  getAllDeposits,
  getDepositDetails,
  approveManualDeposit,
  getAllUsers, 
  updateUserStatus, 
  deleteUser, 
  getAdminLogs,
  getReferralStats,
  getReferralSetting,
  updateReferralSetting,
  getSystemStats 
} from '../controllers/adminController.ts';
import { getPerformanceData } from '../controllers/analyticsController.ts';
import { processROI } from '../jobs/profitJob.ts';
import { auth, adminAuth } from '../middlewares/auth.ts';

const router = express.Router();

// Configure multer for deposit screenshots
const uploadsDir = path.join(process.cwd(), 'uploads', 'deposits');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const uploadDeposit = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'));
    } else {
      cb(null, true);
    }
  },
});

// Auth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/profile', auth, getProfile);
router.put('/auth/profile', auth, updateProfile);

// Wallet Routes
router.post('/wallet/deposit', auth, deposit);
router.post('/wallet/deposit-manual', auth, uploadDeposit.single('screenshot'), createManualDeposit); // Manual deposit with file upload
router.post('/wallet/withdraw', auth, withdraw);
router.get('/wallet/history', auth, getHistory);
router.get('/wallet/deposits', auth, getUserDeposits); // Get user's deposits

// Investment Routes — single endpoint creates Deposit + Investment + Transaction atomically
router.get('/investment/plans', getPlans);
router.post('/investment/deposit-request', auth, uploadDeposit.single('screenshot'), createDepositRequest);
router.get('/investment/my', auth, getMyInvestments);
router.get('/investment/my-referrals', auth, getMyReferrals);


// Analytics Routes
router.get('/analytics/performance', auth, getPerformanceData);

// Admin Routes
router.post('/admin/approve-transaction', auth, adminAuth, approveTransaction);
router.post('/admin/create-plan', auth, adminAuth, createPlan);
router.put('/admin/plan/:planId', auth, adminAuth, updatePlan);
router.delete('/admin/plan/:planId', auth, adminAuth, deletePlan);
router.get('/admin/transactions', auth, adminAuth, getAllTransactions);

// Manual Deposit Management Routes
router.get('/admin/deposits/pending', auth, adminAuth, getPendingDeposits); // Get pending deposits
router.get('/admin/deposits', auth, adminAuth, getAllDeposits); // Get all deposits with filters
router.get('/admin/deposits/:depositId', auth, adminAuth, getDepositDetails); // Get specific deposit
router.post('/admin/deposits/:depositId/approve', auth, adminAuth, approveManualDeposit); // Approve/reject

router.get('/admin/users', auth, adminAuth, getAllUsers);
router.post('/admin/user-status', auth, adminAuth, updateUserStatus);
router.delete('/admin/user/:userId', auth, adminAuth, deleteUser);
router.get('/admin/logs', auth, adminAuth, getAdminLogs);
router.get('/admin/referral-stats', auth, adminAuth, getReferralStats);
router.get('/admin/referral-setting', auth, adminAuth, getReferralSetting);
router.put('/admin/referral-setting', auth, adminAuth, updateReferralSetting);
router.get('/admin/plans/all', auth, adminAuth, getAllPlans);   // all plans incl. inactive
router.get('/admin/stats', auth, adminAuth, getSystemStats);

// Manual ROI trigger — for testing without waiting 24h (admin only)
router.post('/admin/trigger-roi', auth, adminAuth, async (_req, res) => {
  try {
    await processROI();
    res.json({ message: 'ROI job executed successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'ROI job failed' });
  }
});

export default router;
