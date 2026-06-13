import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount:      { type: Number, required: true },
    destination: { type: String, default: '' },  // account/wallet the user wants paid to
    status:      { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

export const Withdrawal =
  (mongoose.models.Withdrawal as mongoose.Model<any>) ||
  mongoose.model('Withdrawal', withdrawalSchema);
