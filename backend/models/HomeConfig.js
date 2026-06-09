import mongoose from 'mongoose';

const homeConfigSchema = new mongoose.Schema({
  heroBadge: {
    type: String,
    default: 'Hello World 👋',
  },
  heroTitle: {
    type: String,
    default: 'AI Automation Engineer & SaaS Product Builder',
  },
  heroSubtitle: {
    type: String,
    default: 'Helping businesses automate operations using AI Agents, n8n workflows, WhatsApp automation, and scalable SaaS solutions.',
  },
  heroCtaText: {
    type: String,
    default: 'View Case Studies',
  },
  heroCtaLink: {
    type: String,
    default: '/case-studies',
  },
  heroSecondaryText: {
    type: String,
    default: 'Hire Me',
  },
  heroSecondaryLink: {
    type: String,
    default: '/hire',
  },
  heroTechBadges: {
    type: [String],
    default: [
      'n8n Automation',
      'React / Next.js',
      'Node.js',
      'PostgreSQL',
      'OpenAI GPT',
      'Docker',
      'WhatsApp API',
      'LangChain'
    ],
  },
  ctaTitle: {
    type: String,
    default: 'Ready to automate your business?',
  },
  ctaSubtitle: {
    type: String,
    default: "Let's talk about your goals and build an AI-powered solution that actually moves the needle.",
  },
  ctaBtnText: {
    type: String,
    default: 'Book a Discovery Call',
  },
  ctaBtnLink: {
    type: String,
    default: '/hire',
  },
}, {
  timestamps: true,
});

const HomeConfig = mongoose.model('HomeConfig', homeConfigSchema);
export default HomeConfig;
