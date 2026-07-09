import { useState } from 'react';
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
  { icon: <Target size={16} />, title: 'Clear scope first', desc: 'Requirements are clarified before code starts, so estimates stay grounded.' },
  { icon: <Shield size={16} />, title: 'Senior execution',  desc: 'Architecture, APIs, automation, deployment, and UI handled with one owner.' },
  { icon: <MessageSquare size={16} />, title: 'Direct communication', desc: 'You work directly with the engineer building the solution.' },
  { icon: <Zap size={16} />, title: 'Fast handoff', desc: 'Clean source, deployment notes, and practical next steps after delivery.' },
];

const NEXT_STEPS = [
  { icon: <Paperclip size={16} />, title: 'Submit request', desc: 'Share your scope, timeline, and references.' },
  { icon: <Target size={16} />, title: 'Review within 24h', desc: 'I will review the details and clarify requirements.' },
  { icon: <Calendar size={16} />, title: 'Discovery call', desc: 'We discuss feasibility, scope, and best approach.' },
  { icon: <CheckCircle size={16} />, title: 'Proposal & timeline', desc: 'You get a clear estimate and delivery plan.' },
];

/* shared input class — fully theme-aware */
const INPUT_CLS = 'w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 transition-all';
const LABEL_CLS = 'block text-xs font-bold tracking-widest uppercase text-text-secondary mb-2';

const HireMe = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceType: '',
    customService: '',
    scope: '',
    budget: '',
    customBudget: '',
    message: '',
  });
  const [attachment, setAttachment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleService = (val) => setFormData({ ...formData, serviceType: val, customService: '' });
  const handleBudget  = (val) => setFormData({ ...formData, budget: val,       customBudget:  '' });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast.error('File too large. Upload a file under 20 MB.');
      e.target.value = '';
      return;
    }
    setAttachment(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!formData.serviceType) { toast.error('Please select a service type'); return; }
    if (formData.serviceType === 'Other' && !formData.customService.trim()) {
      toast.error('Please describe your custom service'); return;
    }
    if (!formData.budget) { toast.error('Please select a budget range'); return; }
    if (formData.budget === 'Other' && !formData.customBudget.trim()) {
      toast.error('Please enter your custom budget'); return;
    }
    if (!formData.scope.trim()) {
      toast.error('Please define the project scope');
      return;
    }
    if (!formData.message.trim()) {
      toast.error('Please add a short project brief');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      const finalService = formData.serviceType === 'Other' ? formData.customService.trim() : formData.serviceType;
      const finalBudget  = formData.budget      === 'Other' ? formData.customBudget.trim()  : formData.budget;
      payload.append('name',        formData.name.trim());
      payload.append('email',       formData.email.trim());
      payload.append('serviceType', finalService);
      payload.append('scope',       formData.scope.trim());
      payload.append('budget',      finalBudget);
      payload.append('message',     formData.message.trim());
      if (attachment) payload.append('attachment', attachment);

      await api.post('/api/hire', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSubmitted(true);
      toast.success("Request received. I'll reply within 24 hours.");
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit request';
      setSubmitError(message);
      toast.error(message);
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
            Hire a product engineer for AI automation, SaaS, and full-stack builds.
          </h1>
          <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Share the problem, the scope, and the outcome you need. I will review it personally and reply with the right next step within 24 hours.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#hire-form"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-blue px-6 py-3 text-sm font-bold text-white shadow-glow-blue transition-all hover:-translate-y-0.5 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
            >
              Start a Project <ChevronRight size={16} />
            </a>
            <a
              href="mailto:contact@ashishportfolio.aigateway.in"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-subtle bg-bg-card px-6 py-3 text-sm font-bold text-text-secondary transition-all hover:-translate-y-0.5 hover:border-accent-blue/35 hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
            >
              Email Directly <Mail size={15} />
            </a>
          </div>
        </div>

        {/* ── TESTIMONIALS + FORM ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-24 items-start">

          {/* Left: Conversion support */}
          <div className="lg:col-span-5 flex flex-col gap-8 lg:sticky lg:top-24">
            <div>
              <h2 className="text-3xl font-display font-bold text-text-primary mb-5">What clients say</h2>
              <div className="space-y-5">
                {[
                  { name: 'Founder, SaaS Startup', since: 'AI workflow build', text: '"Ashish understood the product goal quickly and turned a complex AI workflow into something our team could actually use."' },
                  { name: 'Director, Local Business', since: 'Automation project', text: '"Reliable, technically strong, and fast. The dashboard work improved both performance and day-to-day usability."' },
                ].map((t, i) => (
                  <div key={i} className="border border-border-subtle p-6 rounded-2xl bg-bg-card hover:border-border-active transition-all shadow-card">
                    <div className="text-accent-blue text-4xl leading-none mb-2">“</div>
                    <p className="text-text-primary italic mb-5 leading-relaxed text-sm">{t.text}</p>
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=random&size=40`}
                        alt={t.name}
                        width="40"
                        height="40"
                        loading="lazy"
                        className="w-9 h-9 rounded-full object-cover border border-border-subtle"
                      />
                      <div>
                        <h4 className="text-[10px] font-bold text-text-primary tracking-widest uppercase">{t.name}</h4>
                        <p className="text-[11px] text-text-muted mt-0.5">{t.since}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-text-primary mb-5">Why work with me</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {WHY_HIRE.map((item, i) => (
                  <div key={i} className="rounded-2xl border border-border-subtle bg-bg-card p-5 shadow-card">
                    <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-bg-elevated text-accent-blue">
                      {item.icon}
                    </span>
                    <h3 className="text-sm font-bold text-text-primary mb-2">{item.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-text-primary mb-5">What happens next?</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
                {NEXT_STEPS.map((step, i) => (
                  <div key={step.title} className="text-center">
                    <div className="relative mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-border-subtle bg-bg-card text-accent-blue shadow-card">
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-blue text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                      {step.icon}
                    </div>
                    <h3 className="text-xs font-bold text-text-primary mb-1">{step.title}</h3>
                    <p className="text-[11px] leading-relaxed text-text-muted">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-accent-blue/20 bg-accent-blue/5 p-5">
                <h3 className="text-sm font-bold text-text-primary mb-2">Best fit projects</h3>
                <div className="flex flex-wrap gap-2">
                  {['AI Automation', 'n8n Workflows', 'SaaS MVPs', 'API Integrations', 'Dashboards'].map((tag) => (
                    <span key={tag} className="rounded-full border border-border-subtle bg-bg-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
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
                <h2 className="text-3xl font-display font-bold text-text-primary mb-4">Request Received</h2>
                <p className="text-text-secondary text-sm max-w-sm leading-relaxed">
                  Thanks for sharing the details. I will review the scope and reply with a practical next step within <strong className="text-text-primary">24 hours</strong>.
                </p>
              </motion.div>
            ) : (
              <div className="border border-border-subtle rounded-3xl p-8 lg:p-10 bg-bg-card shadow-card relative overflow-hidden">
                {/* subtle top gradient */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-blue/40 to-transparent" />

                <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-2">Tell me what you need built</h2>
                <p className="text-text-secondary text-sm mb-8">A clear brief helps me reply with a useful next step, not a generic sales call.</p>

                {submitError && (
                  <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">
                    {submitError}
                  </div>
                )}

                <form id="hire-form" onSubmit={handleSubmit} className="space-y-6" aria-busy={isSubmitting}>

                  {/* Full Name */}
                  <div>
                    <label htmlFor="hire-name" className={LABEL_CLS}>Full Name <span className="text-accent-blue">*</span></label>
                    <input
                      id="hire-name"
                      type="text" name="name" value={formData.name} onChange={handleChange}
                      className={INPUT_CLS} placeholder="Your name" autoComplete="name" required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="hire-email" className={LABEL_CLS}>Email Address <span className="text-accent-blue">*</span></label>
                    <input
                      id="hire-email"
                      type="email" name="email" value={formData.email} onChange={handleChange}
                      className={INPUT_CLS} placeholder="you@company.com" autoComplete="email" required
                    />
                  </div>

                  {/* Service Type */}
                  <div>
                    <span className={LABEL_CLS}>Service Type <span className="text-accent-blue">*</span></span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5" role="radiogroup" aria-label="Service type">
                      {SERVICE_OPTIONS.map(svc => (
                        <button
                          key={svc.value} type="button" onClick={() => handleService(svc.value)}
                          role="radio"
                          aria-checked={formData.serviceType === svc.value}
                          className={`flex items-center gap-2 py-3 px-3.5 rounded-xl text-xs font-medium transition-all border text-left focus:outline-none focus:ring-2 focus:ring-accent-blue/25 ${
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
                        <label htmlFor="hire-custom-service" className="sr-only">Describe your custom service</label>
                        <input
                          id="hire-custom-service"
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
                    <span className={LABEL_CLS}>Project Budget <span className="text-accent-blue">*</span></span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5" role="radiogroup" aria-label="Project budget">
                      {BUDGET_OPTIONS.map(b => (
                        <button
                          key={b.value} type="button" onClick={() => handleBudget(b.value)}
                          role="radio"
                          aria-checked={formData.budget === b.value}
                          className={`py-3 px-3 rounded-xl text-xs font-medium transition-all border flex flex-col items-center gap-0.5 focus:outline-none focus:ring-2 focus:ring-accent-blue/25 ${
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
                        <label htmlFor="hire-custom-budget" className="sr-only">Enter custom budget</label>
                        <input
                          id="hire-custom-budget"
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
                    <label htmlFor="hire-scope" className={LABEL_CLS}>Project Scope <span className="text-accent-blue">*</span></label>
                    <textarea
                      id="hire-scope"
                      name="scope" value={formData.scope} onChange={handleChange} rows={3}
                      className={INPUT_CLS + ' resize-none'}
                      placeholder="What should be built? Include key features, systems, integrations, and constraints."
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="hire-message" className={LABEL_CLS}>Project Brief <span className="text-accent-blue">*</span></label>
                    <textarea
                      id="hire-message"
                      name="message" value={formData.message} onChange={handleChange} rows={4}
                      className={INPUT_CLS + ' resize-none'}
                      placeholder="Share the goal, timeline, current stage, and what a successful outcome looks like."
                      required
                    />
                  </div>

                  {/* Attachment */}
                  <div>
                    <span className={LABEL_CLS}>Attach Document / Design <span className="text-text-muted normal-case tracking-normal">(optional)</span></span>
                    {!attachment ? (
                      <label htmlFor="hire-attachment" className="flex flex-col items-center justify-center w-full border-2 border-dashed border-border-subtle rounded-xl py-7 cursor-pointer hover:border-accent-blue/50 hover:bg-accent-blue/3 transition-all bg-bg-primary focus-within:border-accent-blue focus-within:ring-2 focus-within:ring-accent-blue/20">
                        <Paperclip size={22} className="text-text-muted mb-2.5" />
                        <p className="text-sm text-text-secondary">Upload a brief, design, PDF, DOC, DOCX, PNG, or JPG</p>
                        <p className="text-xs text-text-muted mt-1">Max 20 MB</p>
                        <input id="hire-attachment" type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={handleFileChange} className="sr-only" />
                      </label>
                    ) : (
                      <div className="flex items-center justify-between bg-bg-primary border border-accent-blue/30 rounded-xl px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <Paperclip size={16} className="text-accent-blue flex-shrink-0" />
                          <span className="text-sm text-text-primary truncate max-w-[250px]">{attachment.name}</span>
                          <span className="text-xs text-text-muted">({(attachment.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <button type="button" onClick={() => setAttachment(null)} className="text-text-muted hover:text-red-400 transition-colors ml-2 focus:outline-none focus:ring-2 focus:ring-red-400/30 rounded" aria-label="Remove attachment">
                          <XIcon size={15} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit" disabled={isSubmitting}
                    className="w-full bg-accent-blue hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-glow-blue hover:scale-[1.01] active:scale-[0.99] text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
                  >
                    {isSubmitting ? 'Submitting Request...' : (<>Submit Request <ChevronRight size={17} /></>)}
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
            Prefer email?
          </h2>
          <p className="text-text-secondary text-base max-w-lg mb-10 leading-relaxed">
            Send the same project brief directly and I will respond with questions, feasibility notes, or a recommended next step.
          </p>
          <a
            href="mailto:contact@ashishportfolio.aigateway.in"
            className="bg-accent-blue hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-glow-blue text-base hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
          >
            Email Project Brief
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
