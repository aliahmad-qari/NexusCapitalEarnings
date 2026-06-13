import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['deposit', 'withdraw', 'investment', 'profit', 'referral'],
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
    },
    description: { type: String, default: '' },
    // Optional refs to related documents
    depositId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Deposit',    default: null },
    withdrawalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Withdrawal', default: null },
    investmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Investment', default: null },
  },
  {
    // Let Mongoose manage createdAt / updatedAt automatically — avoids
    // the "next is not a function" error caused by duplicate manual fields
    // when the model is re-registered during hot-reloads.
    timestamps: true,
  }
);

// Guard against model re-registration during hot-reload (dev only)
export const Transaction =
  (mongoose.models.Transaction as mongoose.Model<any>) ||
  mongoose.model('Transaction', transactionSchema);
