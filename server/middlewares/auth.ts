import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { User } from '../models/User.ts';

const JWT_SECRET = process.env.JWT_SECRET;

export const auth = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decodedData: any = jwt.verify(token, JWT_SECRET);
    req.userId = decodedData?.userId;

    // Optional: Check if user is blocked
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isBlocked) return res.status(403).json({ message: 'Account restricted' });

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const adminAuth = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Admin access denied' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
