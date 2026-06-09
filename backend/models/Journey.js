import mongoose from 'mongoose';

const journeySchema = new mongoose.Schema({
  year: {
    type: String,
    required: [true, 'Please add a year or date range'],
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  order: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  timestamps: true,
});

const Journey = mongoose.model('Journey', journeySchema);
export default Journey;
