import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Bot, Workflow, MessageCircle, Layers, Globe, Zap,
  Trophy, GraduationCap, Rocket, Target, Download, ArrowRight,
  CheckCircle, Mail, Phone, MapPin
} from 'lucide-react';
import currentWorkImg from '../assets/current_work.png';
import imgAiAgent from '../assets/service_ai_agent.png';
import imgN8n from '../assets/service_n8n.png';
import imgWhatsapp from '../assets/service_whatsapp.png';
import imgSaas from '../assets/service_saas.png';
import imgFullstack from '../assets/service_fullstack.png';
import imgAiIntegration from '../assets/service_ai_integration.png';
import SectionHeading from '../components/ui/SectionHeading';
import AnimatedCard from '../components/ui/AnimatedCard';
import useApi from '../hooks/useApi';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const SERVICES = [
  { 
    icon: <Bot size={22} />, 
    title: 'AI Agent Development', 
    desc: 'Custom AI agents that automate workflows and make intelligent decisions at scale.', 
    color: 'text-accent-purple', 
    bg: 'bg-accent-purple/10',
    image: imgAiAgent 
  },
  { 
    icon: <Workflow size={22} />, 
    title: 'n8n Automation', 
    desc: 'End-to-end workflow automation using n8n — eliminating manual processes.', 
    color: 'text-accent-cyan', 
    bg: 'bg-accent-cyan/10',
    image: imgN8n 
  },
  { 
    icon: <MessageCircle size={22} />, 
    title: 'WhatsApp Automation', 
    desc: 'WhatsApp Business API bots for customer support, orders, and marketing.', 
    color: 'text-green-400', 
    bg: 'bg-green-400/10',
    image: imgWhatsapp 
  },
  { 
    icon: <Layers size={22} />, 
    title: 'SaaS Development', 
    desc: 'Full-featured SaaS platforms from MVP to production-ready scale.', 
    color: 'text-accent-blue', 
    bg: 'bg-accent-blue/10',
    image: imgSaas 
  },
  { 
    icon: <Globe size={22} />, 
    title: 'Full Stack Applications', 
    desc: 'Scalable React/Node.js applications with PostgreSQL and cloud deployment.', 
    color: 'text-yellow-400', 
    bg: 'bg-yellow-400/10',
    image: imgFullstack 
  },
  { 
    icon: <Zap size={22} />, 
    title: 'AI Integrations', 
    desc: 'Plug OpenAI, LangChain, and RAG pipelines into your existing products.', 
    color: 'text-pink-400', 
    bg: 'bg-pink-400/10',
    image: imgAiIntegration 
  },
];

const ACHIEVEMENTS = [
  { icon: <Rocket size={20} />, title: 'Founder of Phoneo', desc: 'Built and launched Phoneo — a SaaS platform for businesses from scratch.' },
  { icon: <Trophy size={20} />, title: 'NCIIPC–AICTE Pentathon Finalist', desc: 'National-level cybersecurity competition finalist organized by NCIIPC & AICTE.' },
  { icon: <Trophy size={20} />, title: 'CIH 2.0 National Hackathon Finalist', desc: 'Top finalist in CIH 2.0 National Hackathon — competing with 1000+ teams.' },
  { icon: <GraduationCap size={20} />, title: 'B.Tech in Information Technology', desc: 'Computer Science fundamentals with a focus on software engineering.' },
];

const WHY_CHOOSE = [
  { title: 'Business-First Thinking', desc: 'I build for business outcomes, not just technical correctness. Every feature has a purpose.' },
  { title: 'Full-Stack Ownership', desc: 'One engineer who handles frontend, backend, AI, DevOps — no coordination overhead.' },
  { title: 'Automation-First Mindset', desc: 'I look for opportunities to automate before building manual solutions.' },
  { title: 'Clear Communication', desc: 'Regular updates, transparent timelines, and technical explanations in plain language.' },
  { title: 'Production-Ready Code', desc: 'Security, performance, and scalability are built-in — not afterthoughts.' },
];

const About = () => {
  const { data: aboutData } = useApi('/api/about');
  const { user, setUser } = useContext(AuthContext);

  const whyChooseList = aboutData?.whyChooseMe && aboutData.whyChooseMe.length > 0
    ? aboutData.whyChooseMe
    : WHY_CHOOSE;


  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="pb-24 pt-12"
    >
      <div className="container">

        {/* ── WHO I AM ── */}
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <span className="text-xs font-mono text-accent-blue tracking-[0.2em] uppercase mb-4 block">
                — {aboutData?.bioSubtitle || 'Who I Am'} —
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-6 leading-tight">
                {aboutData?.bioTitle || 'AI Automation Engineer & SaaS Product Builder'}
              </h1>
              <div className="text-text-secondary text-base space-y-4 leading-relaxed">
                {aboutData?.bioParagraphs && aboutData.bioParagraphs.length > 0 ? (
                  aboutData.bioParagraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))
                ) : (
                  <>
                    <p>
                      I'm <strong className="text-text-primary">Ashish Kumar</strong> — an AI Automation Engineer, SaaS Product Builder, and Full Stack Developer. I help startups and businesses automate their operations using AI Agents, n8n workflows, WhatsApp automation, and scalable software solutions.
                    </p>
                    <p>
                      I founded <strong className="text-text-primary">Phoneo</strong>, a SaaS platform built from scratch. I've been a finalist at national-level hackathons including NCIIPC–AICTE Pentathon and CIH 2.0, competing against hundreds of teams.
                    </p>
                    <p>
                      My philosophy: technology should serve real business outcomes. Whether it's an AI agent that saves 20 hours a week or a WhatsApp bot that handles 300 support tickets automatically — I build things that actually move the needle.
                    </p>
                  </>
                )}
              </div>

              {/* Resume Download */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <a
                  href={aboutData?.resumeUrl || '/resume.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent-blue hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-all shadow-glow-blue"
                >
                  <Download size={16} /> Download Resume
                </a>
                <Link
                  to="/hire"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-border-subtle hover:border-accent-purple text-text-secondary hover:text-accent-purple rounded-xl font-semibold text-sm transition-all"
                >
                  Hire Me <ArrowRight size={15} />
                </Link>
                <a
                  href={aboutData?.followUrl || 'https://linkedin.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border-subtle hover:border-accent-blue text-text-secondary hover:text-accent-blue rounded-xl font-semibold text-sm transition-all cursor-pointer"
                >
                  Follow Ashish
                </a>
              </div>
            </motion.div>

            {/* Photo placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2 flex justify-center"
            >
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue to-accent-purple rounded-3xl rotate-3 opacity-20 blur-xl" />
                <div className="absolute inset-0 bg-bg-card border border-border-subtle rounded-3xl overflow-hidden z-10 shadow-glow-blue flex items-center justify-center">
                  {aboutData?.avatarUrl ? (
                    <img 
                      src={aboutData.avatarUrl} 
                      alt="Ashish Kumar" 
                      className="w-full h-full object-cover rounded-3xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex flex-col items-center justify-center gap-3">
                      <span className="text-7xl font-display font-bold text-text-muted">A</span>
                      <span className="text-xs font-mono text-text-muted tracking-widest font-bold">ASHISH KUMAR</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── JOURNEY SNAPSHOT ── */}
        <section className="mb-24">
          <SectionHeading eyebrow="My Story" heading="The Journey" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { year: '2021', title: 'Started Coding', desc: 'Began with HTML/CSS → JavaScript → React. Built my first full-stack app.' },
              { year: '2022', title: 'Into AI & Automation', desc: 'Discovered n8n, OpenAI APIs, and the world of intelligent automation.' },
              { year: '2023', title: 'Hackathon Finalist', desc: 'NCIIPC–AICTE Pentathon and CIH 2.0 National Hackathon finalist.' },
              { year: '2024', title: 'Founded Phoneo', desc: 'Launched Phoneo SaaS — built the entire product solo from design to deployment.' },
              { year: '2025', title: 'AI Automation Focus', desc: 'Specializing in AI Agents, WhatsApp automation, and enterprise n8n workflows.' },
              { year: '2026', title: 'Current', desc: 'Building AI-powered SaaS products and automation systems for global clients.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-bg-card border border-border-subtle rounded-2xl p-6 hover:border-border-active transition-colors"
              >
                <span className="text-xs font-mono text-accent-blue font-bold tracking-widest">{item.year}</span>
                <h3 className="text-base font-display font-bold text-text-primary mt-2 mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/journey" className="text-sm font-medium text-accent-blue hover:underline flex items-center justify-center gap-2">
              View Full Journey Timeline <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* ── ACHIEVEMENTS ── */}
        <section className="mb-24">
          <SectionHeading eyebrow="Milestones" heading="Achievements" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ACHIEVEMENTS.map((ach, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <AnimatedCard className="p-7 flex gap-5">
                  <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                    {ach.icon}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-text-primary mb-2">{ach.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{ach.desc}</p>
                  </div>
                </AnimatedCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CURRENT WORK & VISION ── */}
        <section className="mb-24 bg-bg-secondary border border-border-subtle rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Text sections (7 cols) */}
            <div className="lg:col-span-7 space-y-10">
              <div>
                <span className="text-xs font-mono text-accent-cyan tracking-[0.2em] uppercase mb-3 block">— Current Work —</span>
                <h2 className="font-display text-3xl font-bold text-text-primary mb-4">What I'm Building Now</h2>
                <p className="text-text-secondary leading-relaxed mb-6 text-sm">
                  Currently focused on building AI-powered automation systems for startups and small businesses — helping them scale without scaling their team. Working on multiple n8n automation projects and AI agent deployments.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['AI agent frameworks for business automation', 'n8n workflow templates library', 'WhatsApp bot platforms', 'SaaS products in stealth mode'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-text-secondary text-xs">
                      <CheckCircle size={14} className="text-accent-cyan flex-shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-border-subtle/40">
                <span className="text-xs font-mono text-accent-purple tracking-[0.2em] uppercase mb-3 block">— Vision —</span>
                <h2 className="font-display text-2xl font-bold text-text-primary mb-4">Where I'm Headed</h2>
                <p className="text-text-secondary leading-relaxed text-sm">
                  My goal is to become the go-to engineer for businesses that want to leverage AI automation without the complexity. I'm building a portfolio of SaaS products and automation templates that help businesses of all sizes automate their operations cost-effectively.
                </p>
              </div>
            </div>

            {/* Right: Technical visual asset (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group w-full max-w-[400px]">
                {/* Glow behind image */}
                <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue/20 to-accent-purple/20 rounded-2xl blur-xl opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative rounded-2xl border border-border-subtle overflow-hidden z-10 shadow-glow-blue bg-bg-card">
                  <img 
                    src={currentWorkImg} 
                    alt="AI Workflows and Architectures" 
                    className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section className="mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent-purple/5 blur-[120px] rounded-full -z-10" />
          <SectionHeading
            eyebrow="Expertise"
            heading="What I Do"
            subtext="End-to-end solutions across AI, automation, and full-stack development."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((svc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="h-full"
              >
                <div className="group h-full flex flex-col rounded-3xl border border-border-subtle bg-bg-card overflow-hidden hover:border-accent-blue/30 hover:shadow-glow-blue transition-all duration-300">
                  {/* Card Header Image */}
                  <div className="h-44 w-full overflow-hidden relative bg-bg-secondary border-b border-border-subtle">
                    <img 
                      src={svc.image} 
                      alt={svc.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-card/30 to-transparent" />
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-6 md:p-7 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 ${svc.bg} ${svc.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          {svc.icon}
                        </div>
                        <h3 className="text-lg font-display font-bold text-text-primary leading-tight">{svc.title}</h3>
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed">{svc.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/services" className="inline-flex items-center gap-2 text-accent-blue hover:underline text-sm font-medium">
              View Detailed Services <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* ── WHY CHOOSE ME ── */}
        <section className="bg-bg-secondary border border-border-subtle rounded-3xl p-8 md:p-12">
          <SectionHeading heading="Why Work With Me?" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {whyChooseList.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-bold text-text-primary mb-1 text-sm">{item.title}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CONTACT INFORMATION ── */}
        <section className="mb-24">
          <SectionHeading eyebrow="Get in Touch" heading="Contact Information" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            
            {/* Email Card */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-bg-card border border-border-subtle hover:border-accent-blue/30 p-8 rounded-2xl transition-all shadow-card flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue mb-5 group-hover:scale-110 transition-transform">
                <Mail size={22} />
              </div>
              <h3 className="text-sm font-mono text-text-muted uppercase tracking-wider mb-2">Email Address</h3>
              <a 
                href={`mailto:${aboutData?.contactEmail || 'ashish@example.com'}`}
                className="text-text-primary hover:text-accent-blue font-semibold transition-colors break-all text-sm"
              >
                {aboutData?.contactEmail || 'ashish@example.com'}
              </a>
            </motion.div>

            {/* Phone Card */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-bg-card border border-border-subtle hover:border-accent-purple/30 p-8 rounded-2xl transition-all shadow-card flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-purple/10 flex items-center justify-center text-accent-purple mb-5 group-hover:scale-110 transition-transform">
                <Phone size={22} />
              </div>
              <h3 className="text-sm font-mono text-text-muted uppercase tracking-wider mb-2">Contact Number</h3>
              <a 
                href={`tel:${aboutData?.contactPhone || '+91 98765 43210'}`}
                className="text-text-primary hover:text-accent-purple font-semibold transition-colors text-sm"
              >
                {aboutData?.contactPhone || '+91 98765 43210'}
              </a>
            </motion.div>

            {/* Address Card */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-bg-card border border-border-subtle hover:border-accent-cyan/30 p-8 rounded-2xl transition-all shadow-card flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan mb-5 group-hover:scale-110 transition-transform">
                <MapPin size={22} />
              </div>
              <h3 className="text-sm font-mono text-text-muted uppercase tracking-wider mb-2">Office Location</h3>
              <span className="text-text-primary font-semibold text-sm">
                {aboutData?.contactAddress || 'New Delhi, India'}
              </span>
            </motion.div>

          </div>
        </section>

      </div>
    </motion.div>
  );
};

export default About;
