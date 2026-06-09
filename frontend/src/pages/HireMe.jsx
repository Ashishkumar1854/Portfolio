import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import {
  Bot, Calendar, Mail, ChevronRight, Layers, Target, Zap, MessageSquare,
  Shield, Cpu, Database, Terminal, Paperclip, X as XIcon, CheckCircle, Edit3,
} from 'lucide-react';

/* ── service options ── */
const SERVICE_OPTIONS = [
  { value: 'AI Agent Development',    label: 'AI Agent Development',    icon: <Bot size={16} />,          color: 'text-accent-purple' },
  { value: 'n8n Automation',          label: 'n8n Automation',          icon: <Zap size={16} />,          color: 'text-accent-cyan'   },
  { value: 'WhatsApp Automation',     label: 'WhatsApp Automation',     icon: <MessageSquare size={16} />, color: 'text-green-500'    },
  { value: 'SaaS Development',        label: 'SaaS Development',        icon: <Layers size={16} />,       color: 'text-accent-blue'   },
  { value: 'Full Stack Application',  label: 'Full Stack Application',  icon: <Cpu size={16} />,          color: 'text-yellow-500'    },
  { value: 'AI Integration',          label: 'AI Integration',          icon: <Terminal size={16} />,     color: 'text-pink-500'      },
  { value: 'Other',                   label: 'Other / Custom',          icon: <Edit3 size={16} />,        color: 'text-text-secondary'},
];

const BUDGET_OPTIONS = [
  { value: '< ₹25,000',    label: 'Under ₹25k',   sub: 'Small task' },
  { value: '₹25k – ₹80k',  label: '₹25k – 80k',   sub: 'Mid project' },
  { value: '₹80k – ₹3L',   label: '₹80k – 3L',    sub: 'Full product' },
  { value: '₹3L+',         label: '₹3L+',          sub: 'Enterprise' },
  { value: 'Other',        label: 'Custom Budget', sub: 'I\'ll specify' },
];

const WHY_HIRE = [
  { icon: <Target size={16} />, title: '100% Custom Solutions', desc: 'Built around your exact goals, not template flipping.' },
  { icon: <Shield size={16} />, title: 'Transparent Workflow',  desc: 'Clear progress updates with Git-based collaboration.' },
  { icon: <MessageSquare size={16} />, title: 'Smooth Communication', desc: 'Technical insights translated into business value.' },
  { icon: <Zap size={16} />, title: 'Scalable Architecture', desc: 'Systems designed to grow with your user base.' },
];

/* shared input class — fully theme-aware */
const INPUT_CLS = 'w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue transition-all';
const LABEL_CLS = 'block text-xs font-bold tracking-widest uppercase text-text-secondary mb-2';

const HireMe = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', serviceType: '', customService: '',
    scope: '', budget: '', customBudget: '', message: '',
  });
  const [attachment, setAttachment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleService = (val) => setFormData({ ...formData, serviceType: val, customService: '' });
  const handleBudget  = (val) => setFormData({ ...formData, budget: val,       customBudget:  '' });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) { toast.error('File too large (max 20 MB)'); return; }
    setAttachment(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.serviceType) { toast.error('Please select a service type'); return; }
    if (formData.serviceType === 'Other' && !formData.customService.trim()) {
      toast.error('Please describe your custom service'); return;
    }
    if (!formData.budget) { toast.error('Please select a budget range'); return; }
    if (formData.budget === 'Other' && !formData.customBudget.trim()) {
      toast.error('Please enter your custom budget'); return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      const finalService = formData.serviceType === 'Other' ? formData.customService : formData.serviceType;
      const finalBudget  = formData.budget      === 'Other' ? formData.customBudget  : formData.budget;
      payload.append('name',        formData.name);
      payload.append('email',       formData.email);
      payload.append('serviceType', finalService);
      payload.append('scope',       formData.scope);
      payload.append('budget',      finalBudget);
      payload.append('message',     formData.message);
      if (attachment) payload.append('attachment', attachment);

      await api.post('/api/hire', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSubmitted(true);
      toast.success("Proposal submitted! I'll get back to you within 24 hours.");
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="pb-24 min-h-screen bg-bg-primary"
    >
      <div className="container max-w-[1200px] mx-auto px-6">

        {/* ── HERO ── */}
        <div className="py-20 md:py-28 flex flex-col items-center justify-center text-center">
          <span className="inline-block px-5 py-2 rounded-full bg-accent-blue/10 border border-accent-blue/25 text-accent-blue text-xs font-mono mb-6">
            Available for new projects
          </span>
          <h1 className="text-4xl md:text-6xl leading-[1.1] font-display font-bold text-text-primary mb-6 max-w-3xl">
            Build the future with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-purple font-bold">technical</span> precision.
          </h1>
          <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Bridging the gap between engineering complexity and user experience. Let's build something that actually works and scales.
          </p>
        </div>

        {/* ── FEATURES GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-24">
          {/* Card 1 (span 2) */}
          <div className="lg:col-span-2 bg-bg-card border border-border-subtle rounded-2xl p-8 hover:border-border-active transition-all group">
            <Bot className="text-accent-purple mb-5" size={26} />
            <h3 className="text-xl font-bold text-text-primary mb-3">Custom AI Solutions</h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-xl">
              Implementing LLMs, fine-tuning models, and building intelligent agents that transform business workflows. From RAG pipelines to autonomous assistants.
            </p>
            <div className="flex flex-wrap gap-2">
              {['LLM Integration', 'Vector Databases', 'n8n Workflows', 'WhatsApp Bots'].map(tag => (
                <span key={tag} className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 bg-bg-elevated border border-border-subtle rounded-lg text-text-secondary">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-8 hover:border-border-active transition-all flex flex-col">
            <Terminal className="text-accent-cyan mb-5" size={26} />
            <h3 className="text-xl font-bold text-text-primary mb-3">Technical Consultation</h3>
            <p className="text-text-secondary text-sm leading-relaxed flex-grow">
              Architecting scalable infrastructures and optimizing developer workflows for performance and reliability.
            </p>
            <div className="mt-6">
              <span className="text-xs font-bold text-accent-cyan tracking-wide">10+ Successful Deployments</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-8 hover:border-border-active transition-all flex flex-col">
            <Layers className="text-pink-400 mb-5" size={26} />
            <h3 className="text-xl font-bold text-text-primary mb-3">Full Stack Development</h3>
            <p className="text-text-secondary text-sm leading-relaxed flex-grow">
              Crafting robust backend architectures and high-fidelity, responsive frontend experiences.
            </p>
            <div className="mt-6">
              <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 bg-bg-elevated border border-border-subtle rounded-lg text-text-secondary">
                React / Node / Postgres
              </span>
            </div>
          </div>

          {/* Card 4 — Why Hire (span 2) */}
          <div className="lg:col-span-2 bg-bg-card border border-border-subtle rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-7">
              <Target className="text-text-primary" size={18} />
              <h3 className="text-lg font-bold text-text-primary">Why hire a Product Engineer?</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {WHY_HIRE.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="mt-0.5 text-text-secondary flex-shrink-0">{item.icon}</span>
                  <div>
                    <h4 className="text-xs font-bold tracking-wider uppercase text-text-primary mb-1">{item.title}</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TESTIMONIALS + FORM ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24">

          {/* Left: Testimonials */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <h2 className="text-3xl font-display font-bold text-text-primary">What clients say</h2>
            <div className="space-y-5">
              {[
                { name: 'CEO, TechStart AI',      since: 'Client since 2023',  text: '"Ashish doesn\'t just write code; he understands the product vision. His AI integration saved us months of manual R&D."' },
                { name: 'Director, Nexus Labs',   since: 'Contract Project',   text: '"Reliable, technically brilliant, and surprisingly fast. The new dashboard architecture is a masterpiece of performance."' },
              ].map((t, i) => (
                <div key={i} className="border border-border-subtle p-7 rounded-2xl bg-bg-card hover:border-border-active transition-all">
                  <p className="text-text-primary italic mb-5 leading-relaxed text-sm">{t.text}</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=random&size=40`}
                      alt={t.name} className="w-9 h-9 rounded-full object-cover border border-border-subtle"
                    />
                    <div>
                      <h4 className="text-[10px] font-bold text-text-primary tracking-widest uppercase">{t.name}</h4>
                      <p className="text-[11px] text-text-muted mt-0.5">{t.since}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Assistant Card */}
            <div className="border border-border-subtle rounded-2xl p-7 bg-bg-card">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-base font-bold text-text-primary">Try my AI Assistant</h3>
                <div className="text-accent-purple bg-accent-purple/10 p-2 rounded-lg border border-accent-purple/20">
                  <Bot size={18} />
                </div>
              </div>
              <div className="bg-bg-elevated border border-border-subtle p-4 rounded-xl mb-5">
                <p className="text-text-secondary italic text-xs font-mono leading-relaxed">
                  "Ask me about Ashish's experience with AI Agents and n8n automation..."
                </p>
              </div>
              <button
                onClick={() => toast('AI Assistant feature coming soon! 🤖', { icon: '🤖' })}
                className="w-full py-3.5 border border-border-subtle hover:border-accent-purple/60 bg-transparent text-text-primary hover:text-accent-purple rounded-xl transition-all text-sm font-medium flex items-center justify-center gap-2"
              >
                Launch Assistant Chat
              </button>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-border-subtle rounded-3xl p-10 lg:p-14 bg-bg-card flex flex-col items-center justify-center text-center min-h-[500px]"
              >
                <CheckCircle size={52} className="text-green-400 mb-6" />
                <h2 className="text-3xl font-display font-bold text-text-primary mb-4">Proposal Submitted!</h2>
                <p className="text-text-secondary text-sm max-w-sm leading-relaxed">
                  Thanks for reaching out. I'll review your request and get back to you within <strong className="text-text-primary">24 hours</strong>.
                </p>
              </motion.div>
            ) : (
              <div className="border border-border-subtle rounded-3xl p-8 lg:p-10 bg-bg-card shadow-card relative overflow-hidden">
                {/* subtle top gradient */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-blue/40 to-transparent" />

                <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-2">Let's build together</h2>
                <p className="text-text-secondary text-sm mb-8">Briefly describe your project and I'll get back to you within 24 hours.</p>

                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Full Name */}
                  <div>
                    <label className={LABEL_CLS}>Full Name</label>
                    <input
                      type="text" name="name" value={formData.name} onChange={handleChange}
                      className={INPUT_CLS} placeholder="John Doe" required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className={LABEL_CLS}>Email Address</label>
                    <input
                      type="email" name="email" value={formData.email} onChange={handleChange}
                      className={INPUT_CLS} placeholder="john@company.com" required
                    />
                  </div>

                  {/* Service Type */}
                  <div>
                    <label className={LABEL_CLS}>Service Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {SERVICE_OPTIONS.map(svc => (
                        <button
                          key={svc.value} type="button" onClick={() => handleService(svc.value)}
                          className={`flex items-center gap-2 py-3 px-3.5 rounded-xl text-xs font-medium transition-all border text-left ${
                            formData.serviceType === svc.value
                              ? 'border-accent-blue bg-accent-blue/8 text-text-primary shadow-glow-blue'
                              : 'border-border-subtle bg-bg-primary text-text-secondary hover:border-border-active hover:text-text-primary'
                          }`}
                        >
                          <span className={`flex-shrink-0 ${svc.color}`}>{svc.icon}</span>
                          <span className="leading-tight">{svc.label}</span>
                        </button>
                      ))}
                    </div>
                    {/* Custom service input */}
                    {formData.serviceType === 'Other' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3"
                      >
                        <input
                          type="text"
                          name="customService"
                          value={formData.customService}
                          onChange={handleChange}
                          className={INPUT_CLS}
                          placeholder="Describe your service requirement..."
                          required
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Project Budget */}
                  <div>
                    <label className={LABEL_CLS}>Project Budget</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {BUDGET_OPTIONS.map(b => (
                        <button
                          key={b.value} type="button" onClick={() => handleBudget(b.value)}
                          className={`py-3 px-3 rounded-xl text-xs font-medium transition-all border flex flex-col items-center gap-0.5 ${
                            formData.budget === b.value
                              ? 'border-accent-blue bg-accent-blue/8 text-accent-blue shadow-glow-blue'
                              : 'bg-bg-primary border-border-subtle text-text-secondary hover:border-border-active hover:text-text-primary'
                          }`}
                        >
                          <span className="font-bold">{b.label}</span>
                          <span className="text-[10px] opacity-70">{b.sub}</span>
                        </button>
                      ))}
                    </div>
                    {/* Custom budget input */}
                    {formData.budget === 'Other' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3"
                      >
                        <input
                          type="text"
                          name="customBudget"
                          value={formData.customBudget}
                          onChange={handleChange}
                          className={INPUT_CLS}
                          placeholder="e.g. ₹50,000 or $500 or flexible..."
                          required
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Project Scope */}
                  <div>
                    <label className={LABEL_CLS}>Project Scope</label>
                    <textarea
                      name="scope" value={formData.scope} onChange={handleChange} rows={3}
                      className={INPUT_CLS + ' resize-none'}
                      placeholder="Describe the project scope, key features, integrations needed..."
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className={LABEL_CLS}>Message / Project Brief</label>
                    <textarea
                      name="message" value={formData.message} onChange={handleChange} rows={4}
                      className={INPUT_CLS + ' resize-none'}
                      placeholder="Tell me about your vision, timeline, and key technical challenges..."
                      required
                    />
                  </div>

                  {/* Attachment */}
                  <div>
                    <label className={LABEL_CLS}>Attach Document / Design (Optional)</label>
                    {!attachment ? (
                      <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-border-subtle rounded-xl py-7 cursor-pointer hover:border-accent-blue/50 hover:bg-accent-blue/3 transition-all bg-bg-primary">
                        <Paperclip size={22} className="text-text-muted mb-2.5" />
                        <p className="text-sm text-text-secondary">Click to upload PDF, DOC, DOCX, PNG, JPG</p>
                        <p className="text-xs text-text-muted mt-1">Max 20 MB</p>
                        <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={handleFileChange} className="hidden" />
                      </label>
                    ) : (
                      <div className="flex items-center justify-between bg-bg-primary border border-accent-blue/30 rounded-xl px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <Paperclip size={16} className="text-accent-blue flex-shrink-0" />
                          <span className="text-sm text-text-primary truncate max-w-[250px]">{attachment.name}</span>
                          <span className="text-xs text-text-muted">({(attachment.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <button type="button" onClick={() => setAttachment(null)} className="text-text-muted hover:text-red-400 transition-colors ml-2">
                          <XIcon size={15} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit" disabled={isSubmitting}
                    className="w-full bg-accent-blue hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-glow-blue hover:scale-[1.01] active:scale-[0.99] text-sm"
                  >
                    {isSubmitting ? 'Submitting...' : (<>Submit Proposal <ChevronRight size={17} /></>)}
                  </button>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-1">
                    <a href="mailto:contact@ashishportfolio.aigateway.in" className="flex items-center gap-2 text-text-secondary text-xs font-medium hover:text-accent-blue transition-colors">
                      <Calendar size={13} /> Book a discovery call
                    </a>
                    <a href="mailto:contact@ashishportfolio.aigateway.in" className="flex items-center gap-2 text-text-secondary text-xs font-medium hover:text-accent-blue transition-colors">
                      <Mail size={13} /> Direct Email
                    </a>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* ── BOTTOM CTA ── */}
        <div className="bg-bg-card border border-border-subtle rounded-3xl p-12 lg:p-20 text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-5">
            Ready to build something that actually works?
          </h2>
          <p className="text-text-secondary text-base max-w-lg mb-10 leading-relaxed">
            Skip the generic agencies and work directly with a product engineer who cares about your business outcome.
          </p>
          <a
            href="mailto:contact@ashishportfolio.aigateway.in"
            className="bg-accent-blue hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-glow-blue text-base hover:scale-[1.02] active:scale-[0.98]"
          >
            Let's Talk — Direct Email
          </a>
          <div className="flex gap-6 mt-12 text-text-muted opacity-30">
            <Terminal size={22} />
            <Cpu size={22} />
            <Database size={22} />
            <Bot size={22} />
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default HireMe;
