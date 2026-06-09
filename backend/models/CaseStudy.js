import mongoose from 'mongoose';

const caseStudySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
  },
  subtitle: {
    type: String,
  },
  overview: {
    type: String,
  },
  problem: {
    type: String,
  },
  research: {
    type: String,
  },
  architecture: {
    type: String,
  },
  implementation: {
    type: String,
  },
  results: {
    type: String,
  },
  lessonsLearned: {
    type: String,
  },
  techStack: {
    type: [String],
    default: [],
  },
  screenshots: {
    type: [String], // Array of Cloudinary URLs
    default: [],
  },
  imageUrl: {
    type: String, // Main featured image (Cloudinary URL)
  },
  featured: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    enum: ['SaaS', 'AI Automation', 'WhatsApp Automation', 'n8n', 'Full Stack', 'Other'],
    default: 'Other',
  },
}, {
  timestamps: true,
});

const CaseStudy = mongoose.model('CaseStudy', caseStudySchema);
export default CaseStudy;
