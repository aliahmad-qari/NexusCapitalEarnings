import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema(
  {
    inviterId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    referredUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rewardAmount:   { type: Number, default: 85 },   // amount credited at time of signup
  },
  { timestamps: true }
);

export const Referral =
  (mongoose.models.Referral as mongoose.Model<any>) ||
  mongoose.model('Referral', referralSchema);
