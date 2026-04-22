import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User.ts';

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, referredBy } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      referralCode,
      referredBy,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: user._id, name, email, referralCode, wallet: user.wallet } });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account has been restricted. Contact support.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ token, user: { id: user._id, name: user.name, email, referralCode: user.referralCode, wallet: user.wallet, isAdmin: user.isAdmin } });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const { name, password, investmentGoal } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (password) {
      user.password = await bcrypt.hash(password, 12);
    }
    if (investmentGoal) {
      user.investmentGoal = {
        targetAmount: investmentGoal.targetAmount ?? user.investmentGoal?.targetAmount,
        targetDate: investmentGoal.targetDate ?? user.investmentGoal?.targetDate
      };
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        wallet: user.wallet,
        isAdmin: user.isAdmin,
        investmentGoal: user.investmentGoal
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};
