import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Frontend', 'Backend', 'AI & Agentic AI', 'Automation', 'Databases', 'DevOps & Cloud', 'Tools'],
  },
  name: {
    type: String,
    required: [true, 'Please add a skill name'],
  },
  icon: {
    type: String,
    required: [true, 'Please add an icon identifier (e.g. from Lucide or Devicon)'],
  },
  proficiency: {
    type: Number,
    required: [true, 'Please add proficiency level'],
    min: 0,
    max: 100,
  },
  badge: {
    type: String,
    required: [true, 'Please add a proficiency badge'],
    enum: ['Expert', 'Proficient', 'Learning', 'Familiar'],
    default: 'Proficient',
  },
  showOnHome: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  timestamps: true,
});

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;
