import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a resource title'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a resource description'],
  },
  excerpt: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'AI Agent Templates',
      'n8n Workflows',
      'Prompt Libraries',
      'Docker Guides',
      'Deployment Checklists',
      'PostgreSQL Schemas',
      'Architecture Templates',
      'Business Automation Blueprints'
    ],
    index: true,
  },
  thumbnail: {
    type: String,
    default: '',
  },
  ogImage: {
    type: String,
    default: '',
  },
  downloadUrl: {
    type: String,
    required: [true, 'Please add a download or redirect URL'],
  },
  resourceType: {
    type: String,
    default: 'Template',
    enum: ['Template', 'Guide', 'Checklist', 'Workflow', 'Schema', 'Prompt Library', 'Blueprint', 'Tool'],
  },
  difficulty: {
    type: String,
    default: 'Beginner',
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    index: true,
  },
  isPremium: {
    type: Boolean,
    default: false,
    index: true,
  },
  featured: {
    type: Boolean,
    default: false,
    index: true,
  },
  version: {
    type: String,
    default: '1.0.0',
  },
  author: {
    type: String,
    default: 'Ashish Kumar',
  },
  tags: {
    type: [String],
    default: [],
    index: true,
  },
  features: {
    type: [String],
    default: [],
  },
  includedFiles: {
    type: [String],
    default: [],
  },
  requirements: {
    type: [String],
    default: [],
  },
  installationGuide: {
    type: String,
    default: '',
  },
  usage: {
    type: String,
    default: '',
  },
  screenshots: [{
    image: {
      type: String,
      default: '',
    },
    alt: {
      type: String,
      default: '',
    },
    caption: {
      type: String,
      default: '',
    },
  }],
  faq: [{
    question: {
      type: String,
      default: '',
    },
    answer: {
      type: String,
      default: '',
    },
  }],
  changelog: [{
    version: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
    },
    notes: {
      type: String,
      default: '',
    },
  }],
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAtDisplay: {
    type: Date,
  },
  seo: {
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
    focusKeyword: {
      type: String,
      default: '',
    },
    canonical: {
      type: String,
      default: '',
    },
    ogImage: {
      type: String,
      default: '',
    },
    robots: {
      type: String,
      default: 'index, follow',
    },
  },
  downloads: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Create text index for search. Keep this stable to avoid requiring a text-index migration.
resourceSchema.index({ title: 'text', description: 'text' });

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
