import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: { type: String, default: '', trim: true },
  answer: { type: String, default: '', trim: true },
}, { _id: false });

const tocSchema = new mongoose.Schema({
  title: { type: String, default: '', trim: true },
  anchor: { type: String, default: '', trim: true },
  level: { type: Number, default: 2 },
}, { _id: false });

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  value: { type: Number, min: 1, max: 5 },
}, { _id: false });

const stripHtml = (html = '') => html.replace(/<[^>]*>/g, ' ');

const calculateReadingTime = (content = '') => {
  const words = stripHtml(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

const slugifyAnchor = (text = '') =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/<[^>]*>/g, '')
    .replace(/&[^;]+;/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');

const createUniqueAnchor = (baseAnchor, anchors) => {
  let anchor = baseAnchor || `section-${anchors.size + 1}`;
  let count = 2;
  while (anchors.has(anchor)) {
    anchor = `${baseAnchor}-${count}`;
    count += 1;
  }
  anchors.add(anchor);
  return anchor;
};

const generateTableOfContents = (content = '') => {
  const anchors = new Set();
  const tableOfContents = [];
  const htmlHeadingRegex = /<h([2-4])([^>]*)>([\s\S]*?)<\/h\1>/gi;

  const contentWithAnchors = content.replace(htmlHeadingRegex, (match, level, attrs = '', innerHtml = '') => {
    const title = stripHtml(innerHtml).replace(/\s+/g, ' ').trim();
    if (!title) return match;

    const existingId = attrs.match(/\sid=["']([^"']+)["']/i)?.[1];
    const anchor = existingId || createUniqueAnchor(slugifyAnchor(title), anchors);
    if (existingId) anchors.add(existingId);

    tableOfContents.push({
      title,
      anchor,
      level: Number(level),
    });

    if (existingId) return match;
    return `<h${level}${attrs} id="${anchor}">${innerHtml}</h${level}>`;
  });

  if (tableOfContents.length) {
    return { content: contentWithAnchors, tableOfContents };
  }

  const markdownToc = [];
  content.split('\n').forEach((line) => {
    const match = line.match(/^(#{2,4})\s+(.+)$/);
    if (!match) return;
    const title = match[2].trim();
    markdownToc.push({
      title,
      anchor: createUniqueAnchor(slugifyAnchor(title), anchors),
      level: match[1].length,
    });
  });

  return { content, tableOfContents: markdownToc };
};

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  slug: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true,
    index: true,
  },
  excerpt: {
    type: String,
    trim: true,
    default: '',
  },
  subtitle: {
    type: String,
    trim: true,
    default: '',
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
  },
  coverImage: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  ogImage: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['AI Automation', 'AI Agents', 'n8n', 'SaaS', 'Development', 'System Design', 'Startup Journey', ''],
    default: '',
    index: true,
  },
  tags: {
    type: [String],
    default: [],
    index: true,
  },
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Archived'],
    default: 'Published',
    index: true,
  },
  featured: {
    type: Boolean,
    default: false,
    index: true,
  },
  published: {
    type: Boolean,
    default: true,
    index: true,
  },
  publishedAt: {
    type: Date,
    default: function setPublishedAtDefault() {
      return this.published === false || this.status === 'Draft' ? undefined : new Date();
    },
  },
  seoTitle: {
    type: String,
    default: '',
    trim: true,
  },
  seoDescription: {
    type: String,
    default: '',
    trim: true,
  },
  focusKeyword: {
    type: String,
    default: '',
    trim: true,
  },
  canonical: {
    type: String,
    default: '',
    trim: true,
  },
  noIndex: {
    type: Boolean,
    default: false,
    index: true,
  },
  readingTime: {
    type: Number,
    default: 1,
  },
  views: {
    type: Number,
    default: 0,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  relatedBlogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
  }],
  faq: {
    type: [faqSchema],
    default: [],
  },
  tableOfContents: {
    type: [tocSchema],
    default: [],
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  ratings: {
    type: [ratingSchema],
    default: [],
  },
}, {
  timestamps: true,
});

blogSchema.pre('save', function setComputedFields(next) {
  this.readingTime = calculateReadingTime(this.content);
  const generatedToc = generateTableOfContents(this.content);
  this.content = generatedToc.content;
  this.tableOfContents = generatedToc.tableOfContents;
  if (!this.excerpt && this.subtitle) this.excerpt = this.subtitle;
  if (!this.subtitle && this.excerpt) this.subtitle = this.excerpt;
  if (!this.coverImage && this.imageUrl) this.coverImage = this.imageUrl;
  if (!this.imageUrl && this.coverImage) this.imageUrl = this.coverImage;
  if (this.published && this.status === 'Draft') this.status = 'Published';
  if (this.status === 'Published' && this.published !== false && !this.publishedAt) this.publishedAt = new Date();
  if (this.status !== 'Published') this.published = false;
  next();
});

blogSchema.virtual('avgRating').get(function getAverageRating() {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, rating) => acc + rating.value, 0);
  return Math.round((sum / this.ratings.length) * 10) / 10;
});

blogSchema.index({
  title: 'text',
  excerpt: 'text',
  subtitle: 'text',
  content: 'text',
  category: 'text',
  tags: 'text',
});

blogSchema.set('toJSON', { virtuals: true });
blogSchema.set('toObject', { virtuals: true });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
