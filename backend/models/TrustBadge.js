import mongoose from 'mongoose';

const trustBadgeSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: true,
    default: '🏆',
  },
  text: {
    type: String,
    required: [true, 'Please add trust badge text'],
  },
  order: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  timestamps: true,
});

const TrustBadge = mongoose.model('TrustBadge', trustBadgeSchema);
export default TrustBadge;
