import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Please add a client name'],
  },
  projectTitle: {
    type: String,
    required: [true, 'Please add the project title'],
  },
  content: {
    type: String,
    required: [true, 'Please add testimonial content'],
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5,
  },
  approved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
