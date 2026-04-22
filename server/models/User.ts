import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  referralCode: { type: String, unique: true },
  referredBy: { type: String },
  wallet: {
    totalBalance: { type: Number, default: 0 },
    depositBalance: { type: Number, default: 0 },
    profitBalance: { type: Number, default: 0 },
    referralEarnings: { type: Number, default: 0 },
  },
  investmentGoal: {
    targetAmount: { type: Number, default: 0 },
    targetDate: { type: Date },
  },
  isAdmin: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model('User', userSchema);
