import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a project title'],
  },
  problem: {
    type: String,
    required: [true, 'Please add a problem statement or description'],
  },
  tech: {
    type: [String],
    required: [true, 'Please add at least one technology'],
  },
  githubUrl: {
    type: String,
    required: [true, 'Please add a GitHub URL'],
  },
  liveUrl: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    required: [true, 'Please add a project image'],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Frontend', 'Backend', 'Full-Stack', 'AI/ML', 'Other'],
  },
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
