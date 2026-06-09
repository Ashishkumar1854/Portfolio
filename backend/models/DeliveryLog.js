import mongoose from 'mongoose';

const deliveryLogSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    default: null,
    index: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['sent', 'failed'],
    index: true,
  },
  error: {
    type: String,
    default: '',
  },
  opened: {
    type: Boolean,
    default: false,
    index: true,
  },
  clicked: {
    type: Boolean,
    default: false,
    index: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const DeliveryLog = mongoose.model('DeliveryLog', deliveryLogSchema);
export default DeliveryLog;
