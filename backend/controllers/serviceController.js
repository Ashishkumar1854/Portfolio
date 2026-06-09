import Service from '../models/Service.js';

// Default services to seed if empty
const DEFAULT_SERVICES = [
  {
    icon: 'Bot',
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
    category: 'Automation'
  },
  {
    icon: 'Workflow',
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
    category: 'Automation'
  },
  {
    icon: 'MessageCircle',
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
    category: 'Automation'
  },
  {
    icon: 'Layers',
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
    category: 'SaaS'
  },
  {
    icon: 'Globe',
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
    category: 'SaaS'
  },
  {
    icon: 'Zap',
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
    category: 'AI'
  }
];

// @desc    Get all services (seeds if empty)
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res) => {
  try {
    let services = await Service.find().sort({ createdAt: 1 });
    
    if (services.length === 0) {
      console.log('Seeding default services...');
      await Service.insertMany(DEFAULT_SERVICES);
      services = await Service.find().sort({ createdAt: 1 });
    }
    
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new service
// @route   POST /api/services
// @access  Private/Admin
export const createService = async (req, res) => {
  try {
    const { title, icon, color, bg, overview, deliverables, process, pricing, faq, category } = req.body;
    
    const service = await Service.create({
      title,
      icon,
      color,
      bg,
      overview,
      deliverables: deliverables || [],
      process: process || [],
      pricing,
      faq: faq || [],
      category
    });
    
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
export const updateService = async (req, res) => {
  try {
    const { title, icon, color, bg, overview, deliverables, process, pricing, faq, category } = req.body;
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    service.title = title || service.title;
    service.icon = icon || service.icon;
    service.color = color || service.color;
    service.bg = bg || service.bg;
    service.overview = overview || service.overview;
    service.deliverables = deliverables || service.deliverables;
    service.process = process || service.process;
    service.pricing = pricing || service.pricing;
    service.faq = faq || service.faq;
    service.category = category || service.category;
    
    const updatedService = await service.save();
    res.json(updatedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    await service.deleteOne();
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
