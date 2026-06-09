import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Bot, Workflow, MessageCircle, Layers, Globe, Zap, ChevronDown, ChevronUp,
  ArrowRight, CheckCircle, Phone,
} from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading';
import useApi from '../hooks/useApi';
import imgAiAgent from '../assets/service_ai_agent.png';
import imgN8n from '../assets/service_n8n.png';
import imgWhatsapp from '../assets/service_whatsapp.png';
import imgSaas from '../assets/service_saas.png';
import imgFullstack from '../assets/service_fullstack.png';
import imgAiIntegration from '../assets/service_ai_integration.png';

const getServiceImage = (title, index) => {
  const t = (title || '').toLowerCase();
  if (t.includes('agent')) return imgAiAgent;
  if (t.includes('n8n') || t.includes('automation')) {
    if (t.includes('whatsapp')) return imgWhatsapp;
    return imgN8n;
  }
  if (t.includes('saas')) return imgSaas;
  if (t.includes('full stack') || t.includes('web') || t.includes('application')) return imgFullstack;
  if (t.includes('integration') || t.includes('ai')) return imgAiIntegration;
  const images = [imgAiAgent, imgN8n, imgWhatsapp, imgSaas, imgFullstack, imgAiIntegration];
  return images[index % images.length];
};

const renderIcon = (iconName) => {
  switch (iconName) {
    case 'Bot': return <Bot size={28} />;
    case 'Workflow': return <Workflow size={28} />;
    case 'MessageCircle': return <MessageCircle size={28} />;
    case 'Layers': return <Layers size={28} />;
    case 'Globe': return <Globe size={28} />;
    case 'Zap': return <Zap size={28} />;
    default: return <Zap size={28} />;
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ── full services data ── */
const SERVICES = [
  {
    icon: <Bot size={28} />,
    color: 'text-accent-purple',
    bg: 'bg-accent-purple/10',
    title: 'AI Agent Development',
    overview: 'Custom AI agents that autonomously handle tasks, make decisions, and orchestrate multi-step workflows — reducing manual effort by 80%+.',
    deliverables: [
      'Custom LLM-powered agent with defined goals',
      'Tool integration (web search, APIs, databases)',
      'Memory & context management',
      'Monitoring dashboard',
      'Full deployment + documentation',
    ],
    process: ['Requirements & goal mapping', 'Agent architecture design', 'Tool + memory setup', 'Testing & evaluation', 'Deployment & handoff'],
    pricing: '₹30,000 – ₹1,50,000',
    faq: [
      { q: 'Which LLMs do you use?', a: 'GPT-4o, Claude 3.5, Gemini 1.5, or open-source (Llama 3, Mistral) depending on requirements and budget.' },
      { q: 'Can the agent use my existing data?', a: 'Yes — we can plug into your databases, documents, or APIs via RAG or tool-calling.' },
    ],
  },
  {
    icon: <Workflow size={28} />,
    color: 'text-accent-cyan',
    bg: 'bg-accent-cyan/10',
    title: 'n8n Automation',
    overview: 'End-to-end workflow automation using n8n — connecting apps, APIs, and databases to eliminate manual processes and save hundreds of hours.',
    deliverables: [
      'Custom n8n workflows (hosted or cloud)',
      'API integrations (REST, webhooks, GraphQL)',
      'Error handling & retry logic',
      'Scheduled & triggered automations',
      'Documentation & training',
    ],
    process: ['Process audit & mapping', 'Workflow design', 'Integration setup', 'Testing & QA', 'Deployment & monitoring'],
    pricing: '₹15,000 – ₹60,000',
    faq: [
      { q: 'Can you host n8n for me?', a: 'Yes — I can set up n8n on your VPS or cloud instance (AWS/GCP/Hetzner).' },
      { q: 'Which apps can you connect?', a: 'Any app with an API: Gmail, Slack, Notion, Airtable, CRMs, databases, and 400+ n8n native integrations.' },
    ],
  },
  {
    icon: <MessageCircle size={28} />,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    title: 'WhatsApp Automation',
    overview: 'WhatsApp Business API integrations: AI chatbots, order tracking, automated follow-ups, customer support, and bulk messaging pipelines.',
    deliverables: [
      'WhatsApp Business API setup & verification',
      'Custom chatbot flows (FAQ, lead capture, booking)',
      'CRM / database integration',
      'Bulk broadcast campaigns',
      'Analytics & reporting dashboard',
    ],
    process: ['Business API onboarding', 'Flow design & scripting', 'CRM integration', 'Testing', 'Launch & monitoring'],
    pricing: '₹20,000 – ₹80,000',
    faq: [
      { q: 'Do you handle WhatsApp API approval?', a: 'Yes — I manage the Meta Business API application process end-to-end.' },
      { q: 'Can the bot handle AI responses?', a: 'Yes — bots can use GPT-4 or fine-tuned models for intelligent, context-aware replies.' },
    ],
  },
  {
    icon: <Layers size={28} />,
    color: 'text-accent-blue',
    bg: 'bg-accent-blue/10',
    title: 'SaaS Development',
    overview: 'Full-featured SaaS platforms from MVP to production — with auth, billing, multi-tenancy, dashboards, and scalable infrastructure.',
    deliverables: [
      'Full SaaS application (frontend + backend)',
      'Authentication & authorization (JWT/OAuth)',
      'Subscription billing (Stripe/Razorpay)',
      'Multi-tenant architecture',
      'Admin dashboard & analytics',
      'CI/CD pipeline & deployment',
    ],
    process: ['Product scope & MVP definition', 'Architecture planning', 'Sprint-based development', 'QA & security review', 'Production deployment'],
    pricing: '₹80,000 – ₹3,00,000+',
    faq: [
      { q: 'How long does a SaaS MVP take?', a: 'A lean MVP typically takes 6–10 weeks depending on feature set.' },
      { q: 'Which tech stack do you use?', a: 'React/Next.js + Node.js/Express + PostgreSQL + Redis — or adapted to your preferences.' },
    ],
  },
  {
    icon: <Globe size={28} />,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    title: 'Full Stack Applications',
    overview: 'Scalable, production-ready web applications — React/Next.js frontends with Node.js backends, PostgreSQL/MongoDB, and cloud deployment.',
    deliverables: [
      'Responsive React/Next.js frontend',
      'REST API backend (Node.js/Express)',
      'Database design & optimization',
      'Authentication & security',
      'Cloud deployment (Vercel, Render, AWS)',
    ],
    process: ['Requirements gathering', 'UI/UX wireframes', 'Frontend + backend build', 'Integration & testing', 'Deployment'],
    pricing: '₹30,000 – ₹1,20,000',
    faq: [
      { q: 'Can you work with my existing codebase?', a: 'Yes — I can extend, refactor, or optimize existing projects.' },
      { q: 'Do you provide mobile-responsive designs?', a: 'All apps are fully responsive across desktop, tablet, and mobile.' },
    ],
  },
  {
    icon: <Zap size={28} />,
    color: 'text-pink-400',
    bg: 'bg-pink-400/10',
    title: 'AI Integrations',
    overview: 'Add AI superpowers to your existing products — plug in OpenAI, LangChain, RAG pipelines, embeddings, and vector databases seamlessly.',
    deliverables: [
      'OpenAI / Claude / Gemini API integration',
      'RAG pipeline (document Q&A)',
      'Vector database setup (Pinecone, Qdrant)',
      'Prompt engineering & optimization',
      'Cost monitoring & rate limiting',
    ],
    process: ['AI feature scoping', 'Prompt & pipeline design', 'Integration development', 'Testing & evaluation', 'Deployment'],
    pricing: '₹20,000 – ₹80,000',
    faq: [
      { q: 'How do you keep API costs low?', a: 'Smart caching, model selection (GPT-3.5 vs GPT-4o), token optimization, and response streaming.' },
      { q: 'Can you fine-tune a model on my data?', a: 'Yes — for GPT-3.5 fine-tuning and open-source models (Llama, Mistral) on custom datasets.' },
    ],
  },
];

/* ── service card with expand ── */
const ServiceCard = ({ svc, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      className="group bg-bg-card border border-border-subtle rounded-3xl overflow-hidden hover:border-accent-blue/30 hover:shadow-glow-blue transition-all duration-300 flex flex-col justify-between"
    >
      {/* Card Header Image */}
      <div className="h-44 w-full overflow-hidden relative bg-bg-secondary border-b border-border-subtle">
        <img 
          src={getServiceImage(svc.title, index)} 
          alt={svc.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card/30 to-transparent" />
      </div>

      {/* header */}
      <div className="p-8">
        <div className="flex items-center gap-3.5 mb-5">
          <div className={`w-11 h-11 rounded-xl ${svc.bg} flex items-center justify-center flex-shrink-0 ${svc.color}`}>
            {typeof svc.icon === 'string' ? renderIcon(svc.icon) : svc.icon}
          </div>
          <h3 className="text-xl font-display font-bold text-text-primary leading-tight">{svc.title}</h3>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">{svc.overview}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-mono text-text-muted">{svc.pricing}</span>
          <button
            onClick={() => setOpen(!open)}
            className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg border transition-all cursor-pointer ${
              open ? 'border-accent-blue text-accent-blue bg-accent-blue/8' : 'border-border-subtle text-text-secondary hover:border-border-active'
            }`}
          >
            {open ? 'Less' : 'View Details'} {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* expanded details */}
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-border-subtle"
        >
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* deliverables */}
            <div>
              <h4 className="text-xs font-mono text-text-muted uppercase tracking-widest mb-4">Deliverables</h4>
              <ul className="space-y-2">
                {svc.deliverables.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <CheckCircle size={14} className={`mt-0.5 flex-shrink-0 ${svc.color}`} />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            {/* process + faq */}
            <div>
              <h4 className="text-xs font-mono text-text-muted uppercase tracking-widest mb-4">Process</h4>
              <ol className="space-y-2 mb-8">
                {svc.process.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className={`text-xs font-bold font-mono flex-shrink-0 mt-0.5 ${svc.color}`}>{String(i + 1).padStart(2, '0')}</span>
                    {p}
                  </li>
                ))}
              </ol>
              <h4 className="text-xs font-mono text-text-muted uppercase tracking-widest mb-4">FAQ</h4>
              <div className="space-y-4">
                {svc.faq.map((f, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium text-text-primary mb-1">{f.q}</p>
                    <p className="text-xs text-text-secondary leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="px-8 pb-8">
            <Link
              to="/hire"
              className="inline-flex items-center gap-2 px-5 py-3 bg-accent-blue hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all"
            >
              Get a Quote <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

/* ════════════════════════════════════════ */
const Services = () => {
  const { data: apiServices, loading } = useApi('/api/services');
  const servicesList = apiServices && apiServices.length > 0 ? apiServices : SERVICES;

  if (loading && !apiServices) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
          eyebrow="What I Offer"
          heading="Services"
          subtext="End-to-end solutions across AI, automation, and software development. Click any service to see full details, deliverables, and pricing."
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24"
        >
          {servicesList.map((svc, i) => (
            <ServiceCard key={svc._id || i} svc={svc} index={i} />
          ))}
        </motion.div>

        {/* CTA */}
        <div className="bg-bg-card border border-border-subtle rounded-3xl p-12 md:p-16 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-6">
            Not sure which service you need?
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-xl mx-auto">
            Let's hop on a free 30-minute discovery call. I'll help you figure out the best approach for your goals.
          </p>
          <Link
            to="/hire"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-blue hover:bg-blue-500 text-white rounded-xl font-bold text-base transition-all shadow-glow-blue"
          >
            <Phone size={17} /> Book Discovery Call
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Services;
