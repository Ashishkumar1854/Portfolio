import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Layers, Workflow, MessageCircle, Globe, Zap } from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading';
import AnimatedCard from '../components/ui/AnimatedCard';
import useApi from '../hooks/useApi';

const CATEGORIES = ['All', 'SaaS', 'AI Automation', 'WhatsApp Automation', 'n8n', 'Full Stack'];

const catIcon = (cat) => {
  const map = {
    SaaS: <Layers size={14} />,
    'AI Automation': <Bot size={14} />,
    'WhatsApp Automation': <MessageCircle size={14} />,
    'n8n': <Workflow size={14} />,
    'Full Stack': <Globe size={14} />,
    Other: <Zap size={14} />,
  };
  return map[cat] || <Zap size={14} />;
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ── fallback placeholder data shown before API has real data ── */
const FALLBACK_CASES = [
  {
    _id: 'ph-1',
    title: 'Phoneo SaaS Platform',
    subtitle: 'A full-featured SaaS platform with auth, billing, multi-tenancy, and real-time analytics dashboard.',
    category: 'SaaS',
    featured: true,
    techStack: ['Next.js', 'PostgreSQL', 'Stripe', 'Redis'],
    imageUrl: '',
    results: '200% faster user onboarding, ₹0 to ₹50k MRR in 3 months.',
  },
  {
    _id: 'ph-2',
    title: 'AI Email Automation',
    subtitle: 'GPT-4 powered email drafting, scheduling, and follow-up automation using n8n and Gmail API.',
    category: 'AI Automation',
    featured: true,
    techStack: ['n8n', 'OpenAI GPT-4', 'Gmail API', 'Airtable'],
    imageUrl: '',
    results: 'Saved 20+ hours/week of manual email work per team.',
  },
  {
    _id: 'ph-3',
    title: 'WhatsApp Customer Bot',
    subtitle: 'WhatsApp Business API chatbot for order tracking, customer support, and automated follow-ups.',
    category: 'WhatsApp Automation',
    featured: false,
    techStack: ['WhatsApp API', 'Node.js', 'MongoDB', 'Meta Cloud API'],
    imageUrl: '',
    results: '70% reduction in customer support queries, 24/7 availability.',
  },
  {
    _id: 'ph-4',
    title: 'Instagram Lead Automation',
    subtitle: 'Automated Instagram DM responses and lead qualification pipeline using n8n workflows.',
    category: 'n8n',
    featured: false,
    techStack: ['n8n', 'Instagram API', 'PostgreSQL', 'Resend'],
    imageUrl: '',
    results: '300+ leads/month automatically captured and qualified.',
  },
];

const CaseStudies = () => {
  const { data: caseStudies, loading } = useApi('/api/case-studies');
  const [activeCategory, setActiveCategory] = useState('All');

  const data = (!loading && caseStudies && caseStudies.length > 0) ? caseStudies : FALLBACK_CASES;
  const filtered = activeCategory === 'All' ? data : data.filter(cs => cs.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="pb-24 pt-12"
    >
      <div className="container">
        <SectionHeading
          eyebrow="Business Impact"
          heading="Case Studies"
          subtext="Real client problems, engineered solutions, and measurable results."
        />

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-accent-blue text-white shadow-glow-blue'
                  : 'bg-bg-card border border-border-subtle text-text-secondary hover:border-border-active'
              }`}
            >
              {cat !== 'All' && <span>{catIcon(cat)}</span>}
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-80 bg-bg-card animate-pulse rounded-2xl" />)}
          </div>
        ) : (
          <motion.div
            key={activeCategory}
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {filtered.length > 0 ? filtered.map((cs) => (
              <motion.div key={cs._id} variants={itemVariants}>
                <AnimatedCard className="flex flex-col group overflow-hidden h-full">
                  {/* Image / placeholder */}
                  <div className="h-52 overflow-hidden relative">
                    {cs.imageUrl ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent z-10 opacity-70" />
                        <img src={cs.imageUrl} alt={cs.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-accent-blue/10 via-bg-elevated to-accent-purple/10 flex items-center justify-center">
                        <div className="text-text-muted opacity-20">{catIcon(cs.category)}</div>
                        <Bot size={40} className="text-text-muted opacity-20 ml-2" />
                      </div>
                    )}
                    {cs.featured && (
                      <span className="absolute top-4 left-4 z-20 px-3 py-1 bg-accent-blue text-white text-[10px] font-bold tracking-widest uppercase rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="p-7 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-accent-blue">{catIcon(cs.category)}</span>
                      <span className="text-xs font-mono text-text-muted">{cs.category}</span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-text-primary mb-2">{cs.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-4 flex-grow">{cs.subtitle}</p>

                    {cs.results && (
                      <div className="bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 mb-5">
                        <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-1">Result</p>
                        <p className="text-sm text-text-primary">{cs.results}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-5">
                      {(cs.techStack || []).slice(0, 4).map(t => (
                        <span key={t} className="text-[10px] font-mono px-2 py-1 bg-bg-elevated border border-border-subtle rounded text-text-muted">{t}</span>
                      ))}
                      {(cs.techStack || []).length > 4 && (
                        <span className="text-[10px] font-mono px-2 py-1 bg-bg-elevated border border-border-subtle rounded text-text-muted">+{cs.techStack.length - 4}</span>
                      )}
                    </div>

                    {!cs._id.startsWith('ph-') && (
                      <Link
                        to={`/case-studies/${cs._id}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-accent-blue hover:underline"
                      >
                        Read Full Case Study <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>
                </AnimatedCard>
              </motion.div>
            )) : (
              <div className="col-span-2 text-center text-text-muted py-20">
                No case studies in this category yet.
              </div>
            )}
          </motion.div>
        )}

        {/* CTA */}
        <div className="mt-20 text-center">
          <p className="text-text-secondary mb-6">Have a project in mind?</p>
          <Link
            to="/hire"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-blue hover:bg-blue-500 text-white rounded-xl font-bold text-base transition-all shadow-glow-blue"
          >
            Book a Discovery Call <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CaseStudies;
