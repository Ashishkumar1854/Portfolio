import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: { type: String, default: '', trim: true },
  answer: { type: String, default: '', trim: true },
  q: { type: String, default: '', trim: true },
  a: { type: String, default: '', trim: true },
}, { _id: false });

const gallerySchema = new mongoose.Schema({
  url: { type: String, default: '', trim: true },
  caption: { type: String, default: '', trim: true },
  alt: { type: String, default: '', trim: true },
}, { _id: false });

const featureSchema = new mongoose.Schema({
  title: { type: String, default: '', trim: true },
  description: { type: String, default: '', trim: true },
  icon: { type: String, default: 'Zap', trim: true },
}, { _id: false });

const workflowStepSchema = new mongoose.Schema({
  step: { type: Number, default: 1 },
  title: { type: String, default: '', trim: true },
  description: { type: String, default: '', trim: true },
}, { _id: false });

const tocSchema = new mongoose.Schema({
  title: { type: String, default: '', trim: true },
  anchor: { type: String, default: '', trim: true },
  level: { type: Number, default: 2 },
}, { _id: false });

const stripHtml = (html = '') => String(html).replace(/<[^>]*>/g, ' ');

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

  const contentWithAnchors = String(content).replace(htmlHeadingRegex, (match, level, attrs = '', innerHtml = '') => {
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

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Please add a service title'], trim: true },
  slug: { type: String, trim: true, lowercase: true, unique: true, sparse: true, index: true },
  shortDescription: { type: String, default: '', trim: true },
  excerpt: { type: String, default: '', trim: true },
  overview: { type: String, default: '', trim: true },
  icon: { type: String, default: 'Zap', trim: true },
  color: { type: String, default: 'text-accent-blue', trim: true },
  bg: { type: String, default: 'bg-accent-blue/10', trim: true },
  coverImage: { type: String, default: '', trim: true },
  ogImage: { type: String, default: '', trim: true },
  gallery: { type: [gallerySchema], default: [] },
  category: { type: String, default: 'Automation', trim: true, index: true },
  featured: { type: Boolean, default: false, index: true },
  status: { type: String, enum: ['Draft', 'Published', 'Archived'], default: 'Published', index: true },
  published: { type: Boolean, default: true, index: true },
  publishedDate: { type: Date },
  publishedAt: { type: Date },
  displayOrder: { type: Number, default: 0, index: true },

  startingPrice: { type: Number, default: 0 },
  endingPrice: { type: Number, default: 0 },
  pricingText: { type: String, default: '', trim: true },
  pricing: { type: String, default: '', trim: true },
  currency: { type: String, default: 'INR', trim: true },
  pricingModel: { type: String, default: 'Project based', trim: true },

  content: { type: String, default: '' },
  problem: { type: String, default: '' },
  solution: { type: String, default: '' },
  workflow: { type: String, default: '' },
  implementation: { type: String, default: '' },
  benefits: { type: [String], default: [] },
  useCases: { type: [String], default: [] },
  whoItsFor: { type: [String], default: [] },
  whyChooseUs: { type: [String], default: [] },

  estimatedDelivery: { type: String, default: '', trim: true },
  supportPeriod: { type: String, default: '', trim: true },
  revisionPolicy: { type: String, default: '', trim: true },

  technologyStack: { type: [String], default: [], index: true },
  integrations: { type: [String], default: [] },
  supportedPlatforms: { type: [String], default: [] },
  features: { type: [featureSchema], default: [] },
  deliverables: { type: [String], default: [] },
  process: { type: [String], default: [] },
  workflowSteps: { type: [workflowStepSchema], default: [] },
  faq: { type: [faqSchema], default: [] },

  metaTitle: { type: String, default: '', trim: true },
  metaDescription: { type: String, default: '', trim: true },
  focusKeyword: { type: String, default: '', trim: true },
  canonical: { type: String, default: '', trim: true },
  noIndex: { type: Boolean, default: false, index: true },
  twitterTitle: { type: String, default: '', trim: true },
  twitterDescription: { type: String, default: '', trim: true },
  twitterImage: { type: String, default: '', trim: true },

  relatedServices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  relatedCaseStudies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CaseStudy' }],
  views: { type: Number, default: 0 },
  readingTime: { type: Number, default: 1 },
  tableOfContents: { type: [tocSchema], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

serviceSchema.pre('save', function setComputedFields() {
  if (!this.excerpt && this.shortDescription) this.excerpt = this.shortDescription;
  if (!this.shortDescription && this.excerpt) this.shortDescription = this.excerpt;
  if (!this.pricingText && this.pricing) this.pricingText = this.pricing;
  if (!this.pricing && this.pricingText) this.pricing = this.pricingText;
  if (this.status === 'Published') this.published = true;
  if (this.status !== 'Published') this.published = false;
  if (this.published && !this.publishedAt) this.publishedAt = this.publishedDate || new Date();
  if (this.published && !this.publishedDate) this.publishedDate = this.publishedAt || new Date();

  this.faq = (this.faq || []).map((item) => ({
    question: item.question || item.q || '',
    answer: item.answer || item.a || '',
    q: item.q || item.question || '',
    a: item.a || item.answer || '',
  })).filter((item) => item.question && item.answer);

  const bodyForReading = [
    this.content,
    this.overview,
    this.problem,
    this.solution,
    this.workflow,
    this.implementation,
    ...(this.benefits || []),
    ...(this.useCases || []),
    ...(this.whoItsFor || []),
    ...(this.whyChooseUs || []),
    ...(this.deliverables || []),
  ].filter(Boolean).join(' ');
  this.readingTime = calculateReadingTime(bodyForReading);

  if (this.content) {
    const generatedToc = generateTableOfContents(this.content);
    this.content = generatedToc.content;
    this.tableOfContents = generatedToc.tableOfContents;
  } else {
    this.tableOfContents = [];
  }
});

const Service = mongoose.model('Service', serviceSchema);
export default Service;
