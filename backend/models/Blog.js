import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
  },
  subtitle: {
    type: String,
    required: [true, 'Please add a subtitle'],
  },
  content: {
    type: String, // Rich text HTML from React Quill
    required: [true, 'Please add content'],
  },
  imageUrl: {
    type: String,
    // Not required — text-only posts are allowed
  },
  category: {
    type: String,
    enum: ['AI Automation', 'AI Agents', 'n8n', 'SaaS', 'Development', 'System Design', 'Startup Journey', ''],
    default: '',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  ratings: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    value: { type: Number, min: 1, max: 5 },
  }],
}, {
  timestamps: true,
});

// Virtual for average rating
blogSchema.virtual('avgRating').get(function () {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, r) => acc + r.value, 0);
  return Math.round((sum / this.ratings.length) * 10) / 10;
});

blogSchema.set('toJSON', { virtuals: true });
blogSchema.set('toObject', { virtuals: true });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
