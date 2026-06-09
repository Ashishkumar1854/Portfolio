import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a campaign internal title'],
    trim: true,
  },
  subject: {
    type: String,
    required: [true, 'Please add an email subject'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Please add the campaign body content'],
  },
  bannerImage: {
    type: String,
    default: '',
  },
  targetAudience: {
    type: String,
    required: true,
    enum: [
      'All Users', 
      'Blog Subscribers', 
      'Resource Subscribers', 
      'Case Study Subscribers', 
      'Custom Segment'
    ],
    default: 'All Users',
  },
  customFilters: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  scheduledAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'scheduled', 'processing', 'completed', 'failed'],
    default: 'draft',
    index: true,
  },
  totalCount: {
    type: Number,
    default: 0,
  },
  sentCount: {
    type: Number,
    default: 0,
  },
  openCount: {
    type: Number,
    default: 0,
  },
  clickCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;
