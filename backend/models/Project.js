import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a project title'],
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
  shortDescription: {
    type: String,
    trim: true,
    default: '',
  },
  overview: {
    type: String,
    default: '',
  },
  problem: {
    type: String,
    default: '',
  },
  solution: {
    type: String,
    default: '',
  },
  architecture: {
    type: String,
    default: '',
  },
  features: {
    type: [String],
    default: [],
  },
  technicalChallenges: {
    type: String,
    default: '',
  },
  results: {
    type: String,
    default: '',
  },
  outcome: {
    type: String,
    default: '',
  },
  businessImpact: {
    type: String,
    default: '',
  },
  myRole: {
    type: String,
    default: '',
  },
  tech: {
    type: [String],
    default: [],
  },
  techStack: {
    type: [String],
    default: [],
  },
  techStackGroups: {
    frontend: { type: [String], default: [] },
    backend: { type: [String], default: [] },
    database: { type: [String], default: [] },
    infrastructure: { type: [String], default: [] },
    ai: { type: [String], default: [] },
    devops: { type: [String], default: [] },
    tools: { type: [String], default: [] },
  },
  tags: {
    type: [String],
    default: [],
  },
  githubUrl: {
    type: String,
    default: '',
  },
  liveUrl: {
    type: String,
    default: '',
  },
  demoVideo: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  thumbnail: {
    type: String,
    default: '',
  },
  gallery: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
  ogImage: {
    type: String,
    default: '',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  featuredOrder: {
    type: Number,
    default: 0,
    index: true,
  },
  order: {
    type: Number,
    default: 0,
    index: true,
  },
  projectType: {
    type: String,
    enum: [
      'Portfolio Showcase',
      'SaaS Platform',
      'AI Agent',
      'Automation',
      'Full Stack Application',
      'Mobile Application',
      'API',
      'CLI Tool',
      'Open Source',
      'Library',
      'Desktop Application',
    ],
    default: 'Full Stack Application',
    index: true,
  },
  clientType: {
    type: String,
    enum: ['Personal', 'Client', 'Company', 'Startup', 'Open Source', 'College', 'Hackathon', 'Research'],
    default: 'Personal',
    index: true,
  },
  status: {
    type: String,
    enum: ['Completed', 'Live', 'Maintenance', 'In Progress', 'Archived'],
    default: 'Completed',
    index: true,
  },
  visibility: {
    type: String,
    enum: ['Public', 'Private'],
    default: 'Public',
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
      return this.published === false ? undefined : new Date();
    },
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Frontend', 'Backend', 'Full-Stack', 'AI/ML', 'Other'],
    index: true,
  },
  relatedProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  }],
  seo: {
    enabled: {
      type: Boolean,
      default: true,
    },
    custom: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    keywords: {
      type: [String],
      default: [],
    },
    canonical: {
      type: String,
      default: '',
      trim: true,
    },
    ogImage: {
      type: String,
      default: '',
    },
    noIndex: {
      type: Boolean,
      default: false,
    },
  },
}, {
  timestamps: true,
});

projectSchema.index({
  title: 'text',
  shortDescription: 'text',
  overview: 'text',
  problem: 'text',
  solution: 'text',
  architecture: 'text',
  technicalChallenges: 'text',
  results: 'text',
  outcome: 'text',
  businessImpact: 'text',
  tags: 'text',
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
