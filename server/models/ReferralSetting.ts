import mongoose from 'mongoose';

// Single-document collection — stores the platform-wide referral reward amount.
// Admin can update via PUT /api/admin/referral-setting.
// Falls back to REFERRAL_REWARD_PKR env var (default 85) if no document exists.
const referralSettingSchema = new mongoose.Schema(
  {
    rewardAmount: { type: Number, required: true, default: 85 },
    updatedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

export const ReferralSetting =
  (mongoose.models.ReferralSetting as mongoose.Model<any>) ||
  mongoose.model('ReferralSetting', referralSettingSchema);

// Helper — always returns the current reward from DB (or env fallback)
// Never throws — registration must succeed even if DB query fails.
export async function getReferralReward(): Promise<number> {
  try {
    const setting = await ReferralSetting.findOne().sort({ updatedAt: -1 });
    if (setting && setting.rewardAmount > 0) return setting.rewardAmount;
  } catch {
    // DB error — fall through to env fallback
  }
  return Number(process.env.REFERRAL_REWARD_PKR) || 85;
}
