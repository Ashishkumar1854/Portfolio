import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // Null indicates Admin Announcement or System Alert
  },
  type: {
    type: String,
    required: true,
    enum: ['announcement'],
    index: true,
  },
  text: {
    type: String,
    required: true,
  },

  blogId: {
    type: String,
    default: null,
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
  link: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
