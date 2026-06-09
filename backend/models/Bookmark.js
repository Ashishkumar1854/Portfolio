import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  itemType: {
    type: String,
    required: true,
    enum: ['Blog', 'Resource'],
    index: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
}, {
  timestamps: true,
});

// Create unique compound index to prevent duplicate bookmarks
bookmarkSchema.index({ userId: 1, itemType: 1, itemId: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
export default Bookmark;
