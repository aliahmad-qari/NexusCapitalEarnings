import mongoose from 'mongoose';

const investmentPlanSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Starter, Silver, Gold, Platinum, VIP, Custom
  dailyProfitPercent: { type: Number, required: true },
  minInvestment: { type: Number, required: true },
  maxInvestment: { type: Number, required: true },
  durationDays: { type: Number, required: true },
  features: [{ type: String }],
});

export const InvestmentPlan = mongoose.model('InvestmentPlan', investmentPlanSchema);

const investmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'InvestmentPlan', required: true },
  amount: { type: Number, required: true },
  dailyProfitPercent: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  lastProfitCalc: { type: Date, default: Date.now },
  totalProfitEarned: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
});

export const Investment = mongoose.model('Investment', investmentSchema);
