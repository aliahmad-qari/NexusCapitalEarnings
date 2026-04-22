import mongoose from 'mongoose';

const adminLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId },
  targetType: { type: String },
  details: { type: String },
  ipAddress: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const AdminLog = mongoose.model('AdminLog', adminLogSchema);
