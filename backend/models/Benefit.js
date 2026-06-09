import mongoose from 'mongoose';

const benefitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a benefit title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a benefit description'],
  },
  icon: {
    type: String,
    default: 'Check', // default lucide icon or emoji
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Benefit = mongoose.model('Benefit', benefitSchema);
export default Benefit;
