import { Request, Response } from 'express';
import { User } from '../models/User.ts';
import { Transaction } from '../models/Transaction.ts';
import { InvestmentPlan, Investment } from '../models/Investment.ts';
import { AdminLog } from '../models/AdminLog.ts';

const logAdminAction = async (req: any, action: string, targetId?: string, targetType?: string, details?: string) => {
  try {
    await AdminLog.create({
      adminId: req.userId,
      action,
      targetId,
      targetType,
      details,
      ipAddress: req.ip
    });
  } catch (err) {
    console.error('Error logging admin action:', err);
  }
};

export const approveTransaction = async (req: any, res: Response) => {
  try {
    const { transactionId, status } = req.body; // approved or rejected
    const transaction = await Transaction.findById(transactionId);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Transaction already processed' });
    }

    transaction.status = status;
    await transaction.save();

    if (status === 'approved') {
      const user = await User.findById(transaction.user);
      if (user) {
        if (transaction.type === 'deposit') {
          user.wallet.totalBalance += transaction.amount;
          user.wallet.depositBalance += transaction.amount;
        } else if (transaction.type === 'withdraw') {
          let remaining = transaction.amount;
          if (user.wallet.profitBalance >= remaining) {
            user.wallet.profitBalance -= remaining;
          } else {
            remaining -= user.wallet.profitBalance;
            user.wallet.profitBalance = 0;
            user.wallet.depositBalance = Math.max(0, user.wallet.depositBalance - remaining);
          }
          user.wallet.totalBalance -= transaction.amount;
        }
        await user.save();
      }
    }

    await logAdminAction(req, `TRANSACTION_${status.toUpperCase()}`, transactionId, 'Transaction', `Amount: $${transaction.amount}`);

    res.json({ message: `Transaction ${status}`, transaction });
  } catch (error) {
    res.status(500).json({ message: 'Error updating transaction' });
  }
};

export const createPlan = async (req: any, res: Response) => {
  try {
    const plan = new InvestmentPlan(req.body);
    await plan.save();
    
    await logAdminAction(req, 'CREATE_PLAN', plan._id?.toString(), 'InvestmentPlan', `Name: ${plan.name}`);
    
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error creating plan' });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const updateUserStatus = async (req: any, res: Response) => {
  try {
    const { userId, status } = req.body; // blocked or active
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBlocked = status === 'blocked';
    await user.save();
    
    await logAdminAction(req, `USER_${status.toUpperCase()}`, userId, 'User');

    res.json({ message: `User ${status} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status' });
  }
};

export const deleteUser = async (req: any, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(userId);
    await logAdminAction(req, 'DELETE_USER', userId, 'User', `Email: ${user.email}`);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

export const getAdminLogs = async (req: Request, res: Response) => {
  try {
    const logs = await AdminLog.find().populate('adminId', 'name email').sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin logs' });
  }
};

export const getSystemStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const activeInvestmentsCount = await Investment.countDocuments({ status: 'active' });
    const activePlans = await InvestmentPlan.countDocuments();
    
    const investments = await Investment.find({ status: 'active' });
    const totalInvestedAmount = investments.reduce((sum, inv) => sum + inv.amount, 0);

    const transactions = await Transaction.find();
    const approvedTx = transactions.filter(t => t.status === 'approved' || t.status === 'completed');
    const pendingTx = transactions.filter(t => t.status === 'pending');
    
    const totalDeposits = approvedTx.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawals = approvedTx.filter(t => t.type === 'withdraw').reduce((sum, t) => sum + t.amount, 0);
    
    // Revenue can be defined as total deposits for this context or net liquidity
    const revenue = totalDeposits; 

    res.json({
      totalUsers,
      activeInvestments: activeInvestmentsCount,
      totalInvestedAmount,
      totalDeposits,
      totalWithdrawals,
      revenue,
      activePlans,
      pendingTransactions: pendingTx.length,
      approvedTransactions: approvedTx.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching system stats' });
  }
};
