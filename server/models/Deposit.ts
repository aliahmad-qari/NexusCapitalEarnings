import mongoose from 'mongoose';

const depositSchema = new mongoose.Schema(
  {
    user:                 { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount:               { type: Number, required: true },
    status:               { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    // Payment proof fields — required only when submitting via deposit-manual
    // Left optional here so createDepositRequest (plan selection) can save without them
    paymentMethod:        { type: String, enum: ['jazzcash', 'easypaisa'], default: null },
    transactionReference: { type: String, default: '' },
    screenshotUrl:        { type: String, default: '' },
    adminRemarks:         { type: String, default: '' },
    isUsed:               { type: Boolean, default: false },
    plan:                 { type: mongoose.Schema.Types.ObjectId, ref: 'InvestmentPlan', default: null },
    investment:           { type: mongoose.Schema.Types.ObjectId, ref: 'Investment',     default: null },
    transactionId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction',    default: null },
    approvedBy:           { type: mongoose.Schema.Types.ObjectId, ref: 'User',           default: null },
    approvedAt:           { type: Date, default: null },
  },
  { timestamps: true }
);

export const Deposit =
  (mongoose.models.Deposit as mongoose.Model<any>) ||
  mongoose.model('Deposit', depositSchema);
