import mongoose from 'mongoose';

const processStepSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a process step title'],
  },
  desc: {
    type: String,
    required: [true, 'Please add a process step description'],
  },
  order: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  timestamps: true,
});

const ProcessStep = mongoose.model('ProcessStep', processStepSchema);
export default ProcessStep;
