import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a resource title'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a resource description'],
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'AI Agent Templates',
      'n8n Workflows',
      'Prompt Libraries',
      'Docker Guides',
      'Deployment Checklists',
      'PostgreSQL Schemas',
      'Architecture Templates',
      'Business Automation Blueprints'
    ],
    index: true,
  },
  thumbnail: {
    type: String,
    default: '',
  },
  downloadUrl: {
    type: String,
    required: [true, 'Please add a download or redirect URL'],
  },
  isPremium: {
    type: Boolean,
    default: false,
    index: true,
  },
  downloads: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Create text index for search
resourceSchema.index({ title: 'text', description: 'text' });

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
