import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a service title'],
    unique: true,
  },
  icon: {
    type: String,
    required: [true, 'Please add a Lucide icon name (e.g. Bot, Workflow)'],
    default: 'Zap',
  },
  color: {
    type: String,
    default: 'text-accent-blue',
  },
  bg: {
    type: String,
    default: 'bg-accent-blue/10',
  },
  overview: {
    type: String,
    required: [true, 'Please add an overview'],
  },
  deliverables: {
    type: [String],
    default: [],
  },
  process: {
    type: [String],
    default: [],
  },
  pricing: {
    type: String,
    required: [true, 'Please specify pricing range'],
  },
  faq: [
    {
      q: { type: String, required: true },
      a: { type: String, required: true },
    }
  ],
  category: {
    type: String,
    default: 'Automation',
  }
}, {
  timestamps: true,
});

const Service = mongoose.model('Service', serviceSchema);
export default Service;
