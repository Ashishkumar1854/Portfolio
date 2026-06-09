import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  label: {
    type: String,
    required: [true, 'Please add a label'],
  },
  value: {
    type: String,
    required: [true, 'Please add a value'],
  },
  icon: {
    type: String,
    required: [true, 'Please add an icon identifier'],
  },
}, {
  timestamps: true,
});

const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement;
