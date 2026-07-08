import mongoose from 'mongoose';

const metricSchema = new mongoose.Schema({
  label: { type: String, default: '', trim: true },
  value: { type: String, default: '', trim: true },
  description: { type: String, default: '', trim: true },
}, { _id: false });

const gallerySchema = new mongoose.Schema({
  url: { type: String, default: '', trim: true },
  caption: { type: String, default: '', trim: true },
}, { _id: false });

const testimonialSchema = new mongoose.Schema({
  clientName: { type: String, default: '', trim: true },
  designation: { type: String, default: '', trim: true },
  company: { type: String, default: '', trim: true },
  quote: { type: String, default: '', trim: true },
  clientImage: { type: String, default: '', trim: true },
}, { _id: false });

const faqSchema = new mongoose.Schema({
  question: { type: String, default: '', trim: true },
  answer: { type: String, default: '', trim: true },
}, { _id: false });

const tocSchema = new mongoose.Schema({
  title: { type: String, default: '', trim: true },
  anchor: { type: String, default: '', trim: true },
  level: { type: Number, default: 2 },
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

    tableOfContents.push({ title, anchor, level: Number(level) });

    if (existingId) return match;
    return `<h${level}${attrs} id="${anchor}">${innerHtml}</h${level}>`;
  });

  return { content: contentWithAnchors, tableOfContents };
};

const caseStudySchema = new mongoose.Schema({
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
  excerpt: { type: String, default: '', trim: true },
  subtitle: { type: String, default: '', trim: true },
  clientName: { type: String, default: '', trim: true },
  industry: { type: String, default: '', trim: true, index: true },
  projectDuration: { type: String, default: '', trim: true },
  completionDate: { type: Date },
  coverImage: { type: String, default: '', trim: true },
  imageUrl: { type: String, default: '', trim: true },
  ogImage: { type: String, default: '', trim: true },

  content: { type: String, default: '' },
  overview: { type: String, default: '' },
  challenge: { type: String, default: '' },
  problem: { type: String, default: '' },
  solution: { type: String, default: '' },
  research: { type: String, default: '' },
  architecture: { type: String, default: '' },
  implementation: { type: String, default: '' },
  results: { type: String, default: '' },
  conclusion: { type: String, default: '' },
  lessonsLearned: { type: String, default: '' },

  metrics: { type: [metricSchema], default: [] },
  techStack: { type: [String], default: [], index: true },
  screenshots: { type: [String], default: [] },
  gallery: { type: [gallerySchema], default: [] },
  testimonial: { type: testimonialSchema, default: () => ({}) },

  category: {
    type: String,
    enum: ['SaaS', 'AI Automation', 'WhatsApp Automation', 'n8n', 'Full Stack', 'Other', ''],
    default: 'Other',
  },
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Archived'],
    default: 'Published',
    index: true,
  },
  published: { type: Boolean, default: true, index: true },
  featured: { type: Boolean, default: false, index: true },
  publishedAt: {
    type: Date,
    default: function setPublishedAtDefault() {
      return this.published === false || this.status === 'Draft' ? undefined : new Date();
    },
  },

  seoTitle: { type: String, default: '', trim: true },
  seoDescription: { type: String, default: '', trim: true },
  focusKeyword: { type: String, default: '', trim: true },
  canonicalUrl: { type: String, default: '', trim: true },
  noIndex: { type: Boolean, default: false, index: true },
  faq: { type: [faqSchema], default: [] },
  tableOfContents: { type: [tocSchema], default: [] },
  readingTime: { type: Number, default: 1 },
  views: { type: Number, default: 0 },
  relatedCaseStudies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CaseStudy' }],
}, {
  timestamps: true,
});

caseStudySchema.pre('save', function setComputedFields() {
  const bodyForReading = [
    this.content,
    this.overview,
    this.challenge || this.problem,
    this.solution || this.architecture,
    this.implementation,
    this.results,
    this.conclusion || this.lessonsLearned,
  ].filter(Boolean).join(' ');

  this.readingTime = calculateReadingTime(bodyForReading);

  if (this.content) {
    const generatedToc = generateTableOfContents(this.content);
    this.content = generatedToc.content;
    this.tableOfContents = generatedToc.tableOfContents;
  } else {
    this.tableOfContents = [];
  }

  if (!this.excerpt && this.subtitle) this.excerpt = this.subtitle;
  if (!this.subtitle && this.excerpt) this.subtitle = this.excerpt;
  if (!this.challenge && this.problem) this.challenge = this.problem;
  if (!this.problem && this.challenge) this.problem = this.challenge;
  if (!this.solution && this.architecture) this.solution = this.architecture;
  if (!this.conclusion && this.lessonsLearned) this.conclusion = this.lessonsLearned;
  if (!this.lessonsLearned && this.conclusion) this.lessonsLearned = this.conclusion;
  if (!this.coverImage && this.imageUrl) this.coverImage = this.imageUrl;
  if (!this.imageUrl && this.coverImage) this.imageUrl = this.coverImage;
  if (!this.industry && this.category) this.industry = this.category;
  if (!this.category && ['SaaS', 'AI Automation', 'WhatsApp Automation', 'n8n', 'Full Stack', 'Other'].includes(this.industry)) {
    this.category = this.industry;
  }
  if (this.published && this.status === 'Draft') this.status = 'Published';
  if (this.status === 'Published' && this.published !== false && !this.publishedAt) this.publishedAt = new Date();
  if (this.status !== 'Published') this.published = false;
});

const CaseStudy = mongoose.model('CaseStudy', caseStudySchema);
export default CaseStudy;
