import mongoose from 'mongoose';

const hireRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add your email'],
    trim: true,
    lowercase: true,
  },
  serviceType: {
    type: String,
    required: [true, 'Please select a service type'],
    trim: true,
  },
  scope: {
    type: String,
    required: [true, 'Please define the project scope'],
    trim: true,
  },
  budget: {
    type: String,
    required: [true, 'Please provide a budget range'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Please add a message or description'],
    trim: true,
  },
  attachmentUrl: {
    type: String, // Cloudinary URL for PDF / DOC uploads (optional)
  },
  attachmentPublicId: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected'],
    default: 'pending',
  },
  date: {
    type: String,
    default: '',
  },
  trackingLink: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const HireRequest = mongoose.model('HireRequest', hireRequestSchema);
export default HireRequest;
