import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please add a question'],
  },
  answer: {
    type: String,
    required: [true, 'Please add an answer'],
  },
  order: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  timestamps: true,
});

const FAQ = mongoose.model('FAQ', faqSchema);
export default FAQ;
