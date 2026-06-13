import mongoose from 'mongoose';

const depositSchema = new mongoose.Schema(
  {
    user:                 { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount:               { type: Number, required: true },
    status:               { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    paymentMethod:        { type: String, enum: ['jazzcash', 'easypaisa'], required: true },
    transactionReference: { type: String, required: true },
    screenshotUrl:        { type: String, required: true },
    adminRemarks:         { type: String, default: '' },
    isUsed:               { type: Boolean, default: false },
    plan:                 { type: mongoose.Schema.Types.ObjectId, ref: 'InvestmentPlan', default: null },
    investment:           { type: mongoose.Schema.Types.ObjectId, ref: 'Investment',     default: null },
    approvedBy:           { type: mongoose.Schema.Types.ObjectId, ref: 'User',           default: null },
    approvedAt:           { type: Date, default: null },
  },
  { timestamps: true }
);

export const Deposit =
  (mongoose.models.Deposit as mongoose.Model<any>) ||
  mongoose.model('Deposit', depositSchema);
