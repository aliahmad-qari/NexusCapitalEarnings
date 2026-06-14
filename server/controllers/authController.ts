import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User.ts';
import { Transaction } from '../models/Transaction.ts';
import { Referral } from '../models/Referral.ts';
import { getReferralReward } from '../models/ReferralSetting.ts';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, referredBy } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      referralCode,
      referredBy: referredBy || null,
    });

    await user.save();

    // Handle referral reward if referred by someone
    if (referredBy) {
      try {
        // Case-insensitive search — codes are stored uppercase but users may type lowercase
        const referrer = await User.findOne({
          referralCode: { $regex: new RegExp(`^${referredBy.trim()}$`, 'i') },
        });
        if (referrer) {
          const referralReward = await getReferralReward();
          referrer.wallet.totalBalance     += referralReward;
          referrer.wallet.referralEarnings += referralReward;
          referrer.referralCount           += 1;
          await referrer.save();

          await new Transaction({
            user:        referrer._id,
            type:        'referral',
            amount:      referralReward,
            status:      'completed',
            description: `Referral reward from ${user.name} (${user.email})`,
          }).save();

          await new Referral({
            inviterId:      referrer._id,
            referredUserId: user._id,
            rewardAmount:   referralReward,   // record what was paid at this moment
          }).save();

          console.log(`✅ Referral reward: PKR ${referralReward} → ${referrer.email} (referred by code: ${referredBy})`);
        } else {
          console.log(`⚠️ Referral code not found: "${referredBy}" — new user registered without referral`);
        }
      } catch (refErr) {
        // Never block registration due to referral processing errors
        console.error('Referral processing error (non-fatal):', refErr);
      }
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        wallet: user.wallet,
        isAdmin: user.isAdmin,
        referralCount: user.referralCount,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account has been restricted. Contact support.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        wallet: user.wallet,
        isAdmin: user.isAdmin,
        referralCount: user.referralCount,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Login failed' });
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
        investmentGoal: user.investmentGoal,
        referralCount: user.referralCount,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};
