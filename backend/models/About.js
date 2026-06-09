import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
  bioTitle: {
    type: String,
    required: [true, 'Please add a bio title'],
  },
  bioSubtitle: {
    type: String,
    required: [true, 'Please add a bio subtitle'],
    default: 'Who I Am',
  },
  bioParagraphs: {
    type: [String],
    required: [true, 'Please add at least one bio paragraph'],
  },
  avatarUrl: {
    type: String,
    default: '',
  },
  resumeUrl: {
    type: String,
    default: '',
  },
  whyChooseMe: [
    {
      title: { type: String, required: true },
      desc: { type: String, required: true },
    }
  ],
  contactEmail: {
    type: String,
    default: 'ashish@example.com',
  },
  contactPhone: {
    type: String,
    default: '+91 98765 43210',
  },
  contactAddress: {
    type: String,
    default: 'New Delhi, India',
  },
  followUrl: {
    type: String,
    default: 'https://linkedin.com',
  },
}, {
  timestamps: true,
});

const About = mongoose.model('About', aboutSchema);
export default About;
