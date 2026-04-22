import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['deposit', 'withdraw', 'investment', 'profit', 'referral'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Transaction = mongoose.model('Transaction', transactionSchema);

const profitHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  investment: { type: mongoose.Schema.Types.ObjectId, ref: 'Investment', required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const ProfitHistory = mongoose.model('ProfitHistory', profitHistorySchema);
