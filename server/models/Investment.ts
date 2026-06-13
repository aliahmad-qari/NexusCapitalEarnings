import mongoose from 'mongoose';

const investmentPlanSchema = new mongoose.Schema(
  {
    name:             { type: String, required: true },
    investmentAmount: { type: Number, required: true },
    dailyROI:         { type: Number, required: true, default: 10 },
    durationDays:     { type: Number, required: true, default: 7 },
    isActive:         { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const InvestmentPlan =
  (mongoose.models.InvestmentPlan as mongoose.Model<any>) ||
  mongoose.model('InvestmentPlan', investmentPlanSchema);

const investmentSchema = new mongoose.Schema(
  {
    user:              { type: mongoose.Schema.Types.ObjectId, ref: 'User',           required: true },
    plan:              { type: mongoose.Schema.Types.ObjectId, ref: 'InvestmentPlan', required: true },
    deposit:           { type: mongoose.Schema.Types.ObjectId, ref: 'Deposit',        default: null },
    planName:          { type: String,  required: true },
    principalAmount:   { type: Number,  required: true },
    dailyROI:          { type: Number,  required: true },
    totalDays:         { type: Number,  required: true, default: 7 },
    remainingDays:     { type: Number,  required: true, default: 7 },
    totalProfitEarned: { type: Number,  default: 0 },
    startDate:         { type: Date,    default: Date.now },
    endDate:           { type: Date,    required: true },
    lastProfitDate:    { type: Date,    default: Date.now },
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'cancelled'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export const Investment =
  (mongoose.models.Investment as mongoose.Model<any>) ||
  mongoose.model('Investment', investmentSchema);
