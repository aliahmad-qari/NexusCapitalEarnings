import mongoose from 'mongoose';

const adminLogSchema = new mongoose.Schema(
  {
    adminId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action:     { type: String, required: true },
    targetId:   { type: mongoose.Schema.Types.ObjectId, default: null },
    targetType: { type: String, default: '' },
    details:    { type: String, default: '' },
    ipAddress:  { type: String, default: '' },
  },
  { timestamps: true }
);

export const AdminLog =
  (mongoose.models.AdminLog as mongoose.Model<any>) ||
  mongoose.model('AdminLog', adminLogSchema);
