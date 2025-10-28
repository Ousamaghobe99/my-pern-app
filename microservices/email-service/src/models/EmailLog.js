import mongoose from 'mongoose';

const emailLogSchema = new mongoose.Schema({
  to: { type: String, required: true },
  from: { type: String, required: true },
  subject: { type: String, required: true },
  templateName: String,
  templateData: mongoose.Schema.Types.Mixed,
  status: { 
    type: String, 
    enum: ['pending', 'sent', 'failed', 'retrying'],
    default: 'pending'
  },
  retryCount: { type: Number, default: 0 },
  error: String,
  sentAt: Date,
  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

emailLogSchema.index({ status: 1, createdAt: -1 });
emailLogSchema.index({ to: 1 });

export default mongoose.model('EmailLog', emailLogSchema);
