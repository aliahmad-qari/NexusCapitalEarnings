import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController.ts';
import { deposit, withdraw, getHistory } from '../controllers/walletController.ts';
import { getPlans, createInvestment, getMyInvestments } from '../controllers/investmentController.ts';
import { 
  approveTransaction, 
  createPlan, 
  getAllTransactions, 
  getAllUsers, 
  updateUserStatus, 
  deleteUser, 
  getAdminLogs,
  getSystemStats 
} from '../controllers/adminController.ts';
import { getPerformanceData } from '../controllers/analyticsController.ts';
import { auth, adminAuth } from '../middlewares/auth.ts';

const router = express.Router();

// Auth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/profile', auth, getProfile);
router.put('/auth/profile', auth, updateProfile);

// Wallet Routes
router.post('/wallet/deposit', auth, deposit);
router.post('/wallet/withdraw', auth, withdraw);
router.get('/wallet/history', auth, getHistory);

// Investment Routes
router.get('/investment/plans', getPlans);
router.post('/investment/create', auth, createInvestment);
router.get('/investment/my', auth, getMyInvestments);

// Analytics Routes
router.get('/analytics/performance', auth, getPerformanceData);

// Admin Routes
router.post('/admin/approve-transaction', auth, adminAuth, approveTransaction);
router.post('/admin/create-plan', auth, adminAuth, createPlan);
router.get('/admin/transactions', auth, adminAuth, getAllTransactions);
router.get('/admin/users', auth, adminAuth, getAllUsers);
router.post('/admin/user-status', auth, adminAuth, updateUserStatus);
router.delete('/admin/user/:userId', auth, adminAuth, deleteUser);
router.get('/admin/logs', auth, adminAuth, getAdminLogs);
router.get('/admin/stats', auth, adminAuth, getSystemStats);

export default router;
