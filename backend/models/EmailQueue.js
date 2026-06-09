import mongoose from 'mongoose';

const emailQueueSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    default: null,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  html: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'sent', 'failed'],
    default: 'pending',
    index: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  lastAttempt: {
    type: Date,
    default: null,
  },
  error: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

emailQueueSchema.index({ status: 1, createdAt: 1 });

const EmailQueue = mongoose.model('EmailQueue', emailQueueSchema);
export default EmailQueue;
