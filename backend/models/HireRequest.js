import mongoose from 'mongoose';

const hireRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name'],
  },
  email: {
    type: String,
    required: [true, 'Please add your email'],
  },
  serviceType: {
    type: String,
    required: [true, 'Please select a service type'],
  },
  scope: {
    type: String,
    required: [true, 'Please define the project scope'],
  },
  budget: {
    type: String,
    required: [true, 'Please provide a budget range'],
  },
  message: {
    type: String,
    required: [true, 'Please add a message or description'],
  },
  attachmentUrl: {
    type: String, // Cloudinary URL for PDF / DOC uploads (optional)
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
