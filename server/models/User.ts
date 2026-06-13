import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true },
    email:        { type: String, required: true, unique: true },
    password:     { type: String, required: true },
    referralCode: { type: String, unique: true },
    referredBy:   { type: String, default: null },
    referralCount:{ type: Number, default: 0 },
    wallet: {
      totalBalance:     { type: Number, default: 0 }, // Available/withdrawable PKR
      depositBalance:   { type: Number, default: 0 }, // Cumulative deposits PKR
      profitBalance:    { type: Number, default: 0 }, // Total ROI earned PKR
      referralEarnings: { type: Number, default: 0 }, // Referral rewards PKR (85 per referral)
    },
    investmentGoal: {
      targetAmount: { type: Number, default: 0 },
      targetDate:   { type: Date },
    },
    isAdmin:   { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User =
  (mongoose.models.User as mongoose.Model<any>) ||
  mongoose.model('User', userSchema);
