import { Response } from 'express';
import path from 'path';
import { User } from '../models/User.ts';
import { Transaction } from '../models/Transaction.ts';
import { Deposit } from '../models/Deposit.ts';
import { Withdrawal } from '../models/Withdrawal.ts';

// Manual deposit with payment proof (screenshot, transaction reference)
export const createManualDeposit = async (req: any, res: Response) => {
  try {
    const { amount, paymentMethod, transactionReference, investment: investmentId } = req.body;
    
    // Validate required fields
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (!paymentMethod || !['jazzcash', 'easypaisa'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method. Only JazzCash and Easypaisa are accepted.' });
    }

    if (!transactionReference || transactionReference.trim() === '') {
      return res.status(400).json({ message: 'Transaction reference/ID is required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Payment screenshot is required' });
    }

    // Validate file is an image
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'Only image files are accepted for screenshot' });
    }

    // Store only the filename (not the full OS path) so the URL works on any machine
    const screenshotFilename = req.file.filename || path.basename(req.file.path);

    // Create Deposit record with payment details
    const depositRecord = new Deposit({
      user: req.userId,
      amount,
      paymentMethod,
      transactionReference: transactionReference.trim(),
      screenshotUrl: screenshotFilename,   // ← relative filename only
      status: 'pending',
      investment: investmentId || null,
    });
    await depositRecord.save();

    // Create Transaction record linked to the Deposit
    const transaction = new Transaction({
      user: req.userId,
      type: 'deposit',
      amount,
      status: 'pending',
      depositId: depositRecord._id,
      description: `Manual deposit via ${paymentMethod.toUpperCase()}: PKR ${amount}. Ref: ${transactionReference}`,
    });
    await transaction.save();

    res.status(201).json({
      message: 'Deposit request submitted successfully. Awaiting admin verification.',
      deposit: depositRecord,
      transaction,
    });
  } catch (error) {
    console.error('Deposit creation error:', error);
    res.status(500).json({ message: 'Error creating deposit request' });
  }
};

// Legacy deposit endpoint — disabled, use /wallet/deposit-manual instead
export const deposit = async (req: any, res: Response) => {
  return res.status(400).json({ message: 'Please use the deposit form with payment proof.' });
};

// Get user's deposits for verification
export const getUserDeposits = async (req: any, res: Response) => {
  try {
    const deposits = await Deposit.find({ user: req.userId }).sort({ createdAt: -1 }).populate('investment');
    res.json(deposits);
  } catch (error) {
    console.error('Error fetching deposits:', error);
    res.status(500).json({ message: 'Error fetching deposits' });
  }
};

export const withdraw = async (req: any, res: Response) => {
  try {
    const { amount, destination } = req.body;
    const user = await User.findById(req.userId);
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid withdrawal amount' });

    // Rule 1: Minimum balance PKR 1,000
    if (user.wallet.totalBalance < 1000) {
      return res.status(400).json({ message: 'Minimum balance of PKR 1,000 required to withdraw', currentBalance: user.wallet.totalBalance });
    }
    // Rule 2: Minimum 2 referrals
    if (user.referralCount < 2) {
      return res.status(400).json({ message: `You need at least 2 referrals to withdraw. Current: ${user.referralCount}/2` });
    }
    // Rule 3: Cannot exceed available balance
    if (amount > user.wallet.totalBalance) {
      return res.status(400).json({ message: 'Amount exceeds available balance', availableBalance: user.wallet.totalBalance });
    }

    // ── Do NOT deduct balance here — deduct only when admin APPROVES ──
    // Balance is held logically by the pending transaction record.

    const withdrawRecord = new Withdrawal({
      user:        req.userId,
      amount,
      destination: destination || '',
      status:      'pending',
    });
    await withdrawRecord.save();

    const transaction = new Transaction({
      user:         req.userId,
      type:         'withdraw',
      amount,
      status:       'pending',
      withdrawalId: withdrawRecord._id,
      description:  `Withdrawal request: PKR ${amount}${destination ? ` → ${destination}` : ''}`,
    });
    await transaction.save();

    res.status(201).json({
      message: 'Withdrawal request submitted. Admin will process within 24 hours.',
      transaction,
      currentBalance: user.wallet.totalBalance,
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({ message: 'Error creating withdrawal request' });
  }
};

export const getHistory = async (req: any, res: Response) => {
  try {
    const transactions = await Transaction.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history' });
  }
};
