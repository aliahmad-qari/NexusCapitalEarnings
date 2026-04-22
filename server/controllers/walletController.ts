import { Response } from 'express';
import { User } from '../models/User.ts';
import { Transaction } from '../models/Transaction.ts';

export const deposit = async (req: any, res: Response) => {
  try {
    const { amount } = req.body;
    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    const transaction = new Transaction({
      user: req.userId,
      type: 'deposit',
      amount,
      status: 'pending',
      description: 'Deposit request',
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error creating deposit' });
  }
};

export const withdraw = async (req: any, res: Response) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.userId);
    
    if (!user || user.wallet.totalBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const transaction = new Transaction({
      user: req.userId,
      type: 'withdraw',
      amount,
      status: 'pending',
      description: 'Withdrawal request',
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error creating withdrawal' });
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
