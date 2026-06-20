import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Workflow,
  MessageCircle,
  Layers,
  Globe,
  Zap,
  Trophy,
  Users,
  Briefcase,
  Code2,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Terminal,
  Server,
  Database,
  Cpu,
  Shield,
} from "lucide-react";
import SectionHeading from "../components/ui/SectionHeading";
import AnimatedCard from "../components/ui/AnimatedCard";
import useApi from "../hooks/useApi";
import heroIllustrationImg from "../assets/hero_illustration.png";
import imgAiAgent from "../assets/service_ai_agent.png";
import imgN8n from "../assets/service_n8n.png";
import imgWhatsapp from "../assets/service_whatsapp.png";
import imgSaas from "../assets/service_saas.png";
import imgFullstack from "../assets/service_fullstack.png";
import imgAiIntegration from "../assets/service_ai_integration.png";

const getServiceImage = (title, index) => {
  const t = (title || "").toLowerCase();
  if (t.includes("agent")) return imgAiAgent;
  if (t.includes("n8n") || t.includes("automation")) {
    if (t.includes("whatsapp")) return imgWhatsapp;
    return imgN8n;
  }
  if (t.includes("saas")) return imgSaas;
  if (
    t.includes("full stack") ||
    t.includes("web") ||
    t.includes("application")
  )
    return imgFullstack;
  if (t.includes("integration") || t.includes("ai")) return imgAiIntegration;
  const images = [
    imgAiAgent,
    imgN8n,
    imgWhatsapp,
    imgSaas,
    imgFullstack,
    imgAiIntegration,
  ];
  return images[index % images.length];
};

/* ── animation variants ── */
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ── animated counter hook ── */
const useCountUp = (target, duration = 1800, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
};

/* ── floating tech badge ── */
/* ── floating tech badge ── */
const TechBadge = ({ label, delay = 0 }) => (
  <motion.span
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{
      y: -4,
      scale: 1.05,
      borderColor: "rgba(34, 211, 238, 0.4)",
      boxShadow: "0 4px 15px rgba(34, 211, 238, 0.15)",
    }}
    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-bg-elevated/50 border border-border-subtle text-text-secondary hover:text-accent-cyan text-xs font-mono backdrop-blur-md cursor-default transition-all duration-300"
  >
    <span
      className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse"
      style={{ animationDuration: "3s" }}
    />
    {label}
  </motion.span>
);

/* ── stat card with count-up ── */
const StatCard = ({ value, suffix = "", label, icon, started }) => {
  const num = parseInt(value) || 0;
  const count = useCountUp(num, 1600, started);
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6, scale: 1.03 }}
      className="bg-bg-card/75 border border-border-subtle rounded-2xl p-6 text-center shadow-card hover:border-accent-blue/30 transition-all duration-300 backdrop-blur-sm group"
    >
      <div className="text-3xl mb-3 flex justify-center text-accent-blue group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-text-primary via-white to-text-secondary mb-1">
        {count}
        {suffix}
      </div>
      <div className="text-xs text-text-muted font-mono tracking-widest uppercase mt-2">
        {label}
      </div>
    </motion.div>
  );
};

/* ── services map icon helper ── */
const getServiceIcon = (iconName, colorClass = "text-accent-blue") => {
  const icons = {
    Bot: <Bot size={22} className={colorClass} />,
    Workflow: <Workflow size={22} className={colorClass} />,
    MessageCircle: <MessageCircle size={22} className={colorClass} />,
    Layers: <Layers size={22} className={colorClass} />,
    Globe: <Globe size={22} className={colorClass} />,
    Zap: <Zap size={22} className={colorClass} />,
    Trophy: <Trophy size={22} className={colorClass} />,
    Users: <Users size={22} className={colorClass} />,
    Briefcase: <Briefcase size={22} className={colorClass} />,
    Code2: <Code2 size={22} className={colorClass} />,
    Cpu: <Cpu size={22} className={colorClass} />,
    Server: <Server size={22} className={colorClass} />,
    Database: <Database size={22} className={colorClass} />,
    Shield: <Shield size={22} className={colorClass} />,
  };
  return icons[iconName] || <Bot size={22} className={colorClass} />;
};

/* ── skills map icon helper ── */
const getSkillIcon = (iconName) => {
  const icons = {
    Code2: <Code2 size={15} />,
    Server: <Server size={15} />,
    Database: <Database size={15} />,
    Cpu: <Cpu size={15} />,
    Workflow: <Workflow size={15} />,
    Terminal: <Terminal size={15} />,
  };
  if (icons[iconName]) return icons[iconName];
  return <span className="text-sm mr-1">{iconName}</span>;
};

/* ── hardcoded fallbacks ── */
const DEFAULT_HOME_CONFIG = {
  heroBadge: "Hello World 👋 •",
  heroTitle: "AI Automation Engineer & SaaS Product Builder",
  heroSubtitle:
    "Helping businesses automate operations using AI Agents, n8n workflows, WhatsApp automation, and scalable SaaS solutions.",
  heroCtaText: "View Case Studies",
  heroCtaLink: "/case-studies",
  heroSecondaryText: "Hire Me",
  heroSecondaryLink: "/hire",
  heroTechBadges: [
    "n8n Automation",
    "React / Next.js",
    "Node.js",
    "PostgreSQL",
    "OpenAI GPT",
    "Docker",
    "WhatsApp API",
    "LangChain",
  ],
  ctaTitle: "Ready to automate your business?",
  ctaSubtitle:
    "Let's talk about your goals and build an AI-powered solution that actually moves the needle.",
  ctaBtnText: "Book a Discovery Call",
  ctaBtnLink: "/hire",
};

const DEFAULT_SERVICES = [
  {
    icon: <Bot size={22} />,
    title: "AI Agent Development",
    desc: "Custom AI agents that automate complex workflows, handle customer interactions, and make intelligent decisions at scale.",
    color: "text-accent-purple",
  },
  {
    icon: <Workflow size={22} />,
    title: "n8n Automation",
    desc: "End-to-end workflow automation using n8n — connecting APIs, databases, and services to eliminate manual processes.",
    color: "text-accent-cyan",
  },
  {
    icon: <MessageCircle size={22} />,
    title: "WhatsApp Automation",
    desc: "WhatsApp Business API integrations: chatbots, order tracking, customer support, and bulk messaging pipelines.",
    color: "text-green-400",
  },
  {
    icon: <Layers size={22} />,
    title: "SaaS Development",
    desc: "Full-featured SaaS platforms with auth, billing, multi-tenancy, and dashboards — from MVP to production.",
    color: "text-accent-blue",
  },
  {
    icon: <Globe size={22} />,
    title: "Full Stack Applications",
    desc: "React/Next.js frontends + Node.js backends + PostgreSQL/MongoDB — scalable, secure, production-ready.",
    color: "text-yellow-400",
  },
  {
    icon: <Zap size={22} />,
    title: "AI Integrations",
    desc: "Plug OpenAI, LangChain, RAG pipelines, and vector databases into your existing products and workflows.",
    color: "text-pink-400",
  },
];

const DEFAULT_PROCESS = [
  {
    step: "01",
    title: "Discovery",
    desc: "Understanding your goals, constraints, and ideal outcomes.",
  },
  {
    step: "02",
    title: "Architecture",
    desc: "Designing the system, data flow, and technology stack.",
  },
  {
    step: "03",
    title: "Development",
    desc: "Building iteratively with regular progress updates.",
  },
  {
    step: "04",
    title: "Testing",
    desc: "Thorough QA, edge-case testing, and performance checks.",
  },
  {
    step: "05",
    title: "Deployment",
    desc: "Production-ready launch with CI/CD and monitoring.",
  },
  {
    step: "06",
    title: "Support",
    desc: "Post-launch maintenance, updates, and scaling support.",
  },
];

const DEFAULT_FAQS = [
  {
    q: "How much does a project cost?",
    a: "Pricing depends on complexity and scope. AI automation projects typically start at ₹25,000. Full SaaS platforms range from ₹80,000–₹3,00,000+. Let's discuss your requirements for a precise quote.",
  },
  {
    q: "How long does development take?",
    a: "Simple automation scripts: 1–2 weeks. Full-stack web apps: 4–8 weeks. SaaS platforms: 8–16 weeks. Timeline depends on feature complexity and feedback cycles.",
  },
  {
    q: "Do you provide post-launch support?",
    a: "Yes — all projects include 30 days of free bug-fix support. Extended maintenance packages are available monthly or quarterly.",
  },
  {
    q: "Can you work with existing systems?",
    a: "Absolutely. I specialize in integrating AI and automation into existing infrastructure — whether it's a legacy system, existing CRM, or third-party APIs.",
  },
];

const DEFAULT_SKILLS_PILLS = [
  { name: "React / Next.js", icon: <Code2 size={15} /> },
  { name: "Node.js", icon: <Server size={15} /> },
  { name: "PostgreSQL", icon: <Database size={15} /> },
  { name: "OpenAI / LangChain", icon: <Cpu size={15} /> },
  { name: "n8n Automation", icon: <Workflow size={15} /> },
  { name: "Docker / Linux", icon: <Terminal size={15} /> },
];

/* ════════════════════════════════════════ */
const Home = () => {
  const { data: projects, loading: projectsLoading } = useApi("/api/projects");
  const { data: achievements, loading: achLoading } =
    useApi("/api/achievements");
  const { data: testimonials } = useApi("/api/testimonials");
  const { data: caseStudies } = useApi("/api/case-studies");

  // New dynamic fetches
  const { data: homeConfig } = useApi("/api/home-config");
  const { data: dbServices } = useApi("/api/services");
  const { data: dbTrustBadges } = useApi("/api/trust-badges");
  const { data: dbProcessSteps } = useApi("/api/process-steps");
  const { data: dbFaqs } = useApi("/api/faqs");
  const { data: dbSkills } = useApi("/api/skills");

  const featuredProjects = projects
    ? projects.filter((p) => p.featured).slice(0, 3)
    : [];
  const featuredCases = caseStudies
    ? caseStudies.filter((c) => c.featured).slice(0, 3)
    : [];

  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  /* auto-advance testimonials */
  useEffect(() => {
    if (!testimonials || testimonials.length === 0) return;
    const id = setInterval(
      () => setTestimonialIdx((i) => (i + 1) % testimonials.length),
      5000,
    );
    return () => clearInterval(id);
  }, [testimonials]);

  /* trigger count-up when stats section enters view */
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* default stats achievements fallback */
  const defaultAchievements = [
    {
      label: "Projects Built",
      value: "15",
      suffix: "+",
      icon: <Briefcase size={20} className="text-accent-blue mx-auto" />,
    },
    {
      label: "Automation Systems",
      value: "20",
      suffix: "+",
      icon: <Workflow size={20} className="text-accent-purple mx-auto" />,
    },
    {
      label: "Years of Experience",
      value: "3",
      suffix: "+",
      icon: <Trophy size={20} className="text-yellow-400 mx-auto" />,
    },
    {
      label: "Hackathon Finalist",
      value: "2",
      suffix: "×",
      icon: <Users size={20} className="text-accent-cyan mx-auto" />,
    },
  ];

  const dbAchievements =
    !achLoading && achievements && achievements.length > 0
      ? achievements
          .filter((a) => Number.isFinite(Number.parseInt(a.value, 10)))
          .slice(0, 4)
          .map((a) => ({
            label: a.label,
            value: a.value,
            suffix: a.suffix || "+",
            icon: <Trophy size={20} className="text-yellow-400 mx-auto" />,
          }))
      : [];

  const displayedAchievements =
    dbAchievements.length === 4 ? dbAchievements : defaultAchievements;

  /* resolving dynamic values with seeder fallbacks */
  const displayedConfig = homeConfig || DEFAULT_HOME_CONFIG;

  const defaultTrustBadges = [
    { icon: "🚀", text: "Founder of AiGateway" },
    { icon: "🏆", text: "NCIIPC–AICTE Pentathon Finalist" },
    { icon: "🥇", text: "CIH 2.0 National Hackathon Finalist" },
    { icon: "🎓", text: "B.Tech IT Graduate" },
  ];
  const displayedTrustBadges =
    dbTrustBadges && dbTrustBadges.length > 0
      ? dbTrustBadges
      : defaultTrustBadges;

  const displayedServices =
    dbServices && dbServices.length > 0
      ? dbServices.slice(0, 6).map((s) => ({
          icon: getServiceIcon(s.icon, s.color),
          title: s.title,
          desc: s.overview || s.description,
          color: s.color || "text-accent-blue",
        }))
      : DEFAULT_SERVICES;

  const displayedProcessSteps =
    dbProcessSteps && dbProcessSteps.length > 0
      ? dbProcessSteps.map((step, idx) => ({
          step: String(idx + 1).padStart(2, "0"),
          title: step.title,
          desc: step.desc,
        }))
      : DEFAULT_PROCESS;

  const displayedFaqs =
    dbFaqs && dbFaqs.length > 0
      ? dbFaqs.map((faq) => ({ q: faq.question, a: faq.answer }))
      : DEFAULT_FAQS;

  const highlightedSkills =
    dbSkills && dbSkills.filter((s) => s.showOnHome).length > 0
      ? dbSkills
          .filter((s) => s.showOnHome)
          .map((s) => ({ name: s.name, icon: getSkillIcon(s.icon) }))
      : DEFAULT_SKILLS_PILLS;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="pb-24"
    >
      {/* ═══════════════════════════════════════
          SECTION 1 — HERO
      ═══════════════════════════════════════ */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden pt-6 pb-8 lg:pt-6 lg:pb-8">
        <div className="hero-bg absolute inset-0 -z-10" />
        <div className="grid-bg absolute inset-0 -z-20 opacity-30" />

        {/* ambient orbs */}
        <div className="absolute top-1/4 right-[10%] w-[500px] h-[500px] bg-accent-blue/5 blur-[150px] rounded-full -z-10 pointer-events-none" />
        <div className="absolute bottom-1/4 left-[10%] w-[500px] h-[500px] bg-accent-purple/5 blur-[150px] rounded-full -z-10 pointer-events-none" />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="hero-galaxy-card mx-auto mb-6 grid w-full max-w-[920px] grid-cols-1 items-center gap-5 rounded-[2rem] px-7 py-3 backdrop-blur-xs md:grid-cols-[1fr_auto_1fr] lg:mb-7 xl:max-w-[1040px]"
          >
            <div className="flex justify-center">
              <div
                className="ai-orbit"
                aria-label="AI hub orchestrating n8n, React, Node, and CI/CD"
              >
                <div className="ai-orbit-ring">
                  {[
                    {
                      label: "n8n",
                      className: "orbit-node orbit-node-top text-accent-purple",
                    },
                    {
                      label: "React",
                      className: "orbit-node orbit-node-right text-accent-cyan",
                    },
                    {
                      label: "Node",
                      className:
                        "orbit-node orbit-node-bottom text-accent-green",
                    },
                    {
                      label: "CI/CD",
                      className: "orbit-node orbit-node-left text-green-400",
                    },
                  ].map((item) => (
                    <span key={item.label} className={item.className}>
                      {item.label}
                    </span>
                  ))}
                </div>
                <div className="ai-orbit-core">AI</div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <span className="inline-flex items-center gap-2.5 px-7 py-2.5 rounded-full bg-accent-blue/10 border border-accent-blue/25 text-accent-blue text-lg font-mono shadow-glow-blue/10">
                Hello World 👋
                <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
              </span>
              <span className="mt-2.5 inline-flex items-center gap-1.5 font-display text-3xl font-extrabold italic tracking-[0.06em] md:text-4xl">
                {["I", "'", "m"].map((char, idx) => (
                  <motion.span
                    key={`${char}-${idx}`}
                    initial={{ opacity: 0, scale: 0.35, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: 0.3 + idx * 0.14,
                      duration: 0.34,
                      type: "spring",
                      stiffness: 340,
                      damping: 20,
                    }}
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan"
                  >
                    {char}
                  </motion.span>
                ))}
                <span className="inline-block w-1.5" />
                <span className="inline-flex fire-name-text">
                  {"Ashish".split("").map((char, idx) => (
                    <motion.span
                      key={`${char}-${idx}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 1.08 + idx * 0.05,
                        duration: 0.13,
                        ease: "easeOut",
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              </span>
            </div>

            <div className="hidden justify-center md:flex">
              <div className="system-status-card">
                <div className="flex items-center gap-2 text-xs font-medium text-green-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.8)] animate-pulse" />
                  System online
                </div>
                <div className="mt-2 flex items-end justify-between gap-4">
                  <div>
                    <div className="text-[11px] text-slate-400">
                      Active workflows
                    </div>
                    <div className="font-display text-2xl font-bold leading-none text-white">
                      12
                    </div>
                  </div>
                  <div className="flex h-7 items-end gap-1">
                    {[14, 20, 24, 17, 28, 22].map((height, idx) => (
                      <span
                        key={idx}
                        className="w-2 rounded-t-sm bg-accent-blue/90 shadow-[0_0_10px_rgba(79,142,255,0.35)]"
                        style={{ height }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-center">
            {/* Left Column (6 cols on desktop) */}
            <div className="lg:col-span-6 text-left flex flex-col items-start">
              {/* Main heading */}
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.35,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-[4.25rem] font-bold text-text-primary mb-4 leading-[1.06] tracking-tight"
              >
                {displayedConfig.heroTitle.split("&")[0].trim()}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan">
                  &amp;{" "}
                  {displayedConfig.heroTitle.split("&")[1]?.trim() ||
                    "SaaS Product Builder"}
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-base md:text-lg text-text-secondary mb-5 font-light leading-relaxed max-w-xl"
              >
                {displayedConfig.heroSubtitle}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center gap-4 mb-6 w-full sm:w-auto"
              >
                <Link
                  to={displayedConfig.heroCtaLink}
                  className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-accent-blue to-accent-cyan hover:from-blue-500 hover:to-cyan-400 text-white rounded-2xl font-bold text-base transition-all hover:scale-[1.04] hover:shadow-[0_0_30px_rgba(79,142,255,0.5)] active:scale-[0.97] flex items-center justify-center gap-2.5 shadow-glow-blue"
                >
                  {displayedConfig.heroCtaText} <ArrowRight size={20} />
                </Link>
                <Link
                  to={displayedConfig.heroSecondaryLink}
                  className="w-full sm:w-auto px-7 py-3 bg-bg-elevated/50 backdrop-blur-md border border-border-subtle hover:border-accent-purple/50 hover:bg-bg-card hover:scale-[1.04] text-text-primary rounded-2xl font-bold text-base transition-all active:scale-[0.97] text-center"
                >
                  {displayedConfig.heroSecondaryText} →
                </Link>
              </motion.div>

              {/* floating tech badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}
                className="flex flex-wrap gap-2 max-w-xl"
              >
                {(displayedConfig.heroTechBadges || []).map((t, i) => (
                  <TechBadge key={t} label={t} delay={0.8 + i * 0.04} />
                ))}
              </motion.div>
            </div>

            {/* Right Column (6 cols on desktop) */}
            <div className="lg:col-span-6 hidden lg:flex justify-center lg:justify-end lg:pr-8 xl:pr-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative group w-full max-w-[470px] xl:max-w-[500px]"
              >
                {/* Glow behind the illustration */}
                <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue/15 to-accent-purple/15 rounded-3xl blur-2xl opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative rounded-3xl border border-border-subtle overflow-hidden z-10 shadow-glow-blue bg-bg-card">
                  <img
                    src={heroIllustrationImg}
                    alt="AI automation network pipelines"
                    className="w-full max-h-[63vh] object-cover transform transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 2 — TRUST & ACHIEVEMENTS
      ═══════════════════════════════════════ */}
      <section className="py-20 bg-bg-secondary/40 border-y border-border-subtle relative">
        <div className="container">
          {/* trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {displayedTrustBadges.map((badge, idx) => (
              <motion.div
                key={idx}
                whileHover={{
                  y: -3,
                  scale: 1.03,
                  borderColor: "rgba(255,255,255,0.15)",
                }}
                className="flex items-center gap-2.5 px-4.5 py-2 bg-bg-card border border-border-subtle rounded-full text-sm text-text-secondary cursor-default shadow-sm transition-all duration-300"
              >
                <span className="text-lg">{badge.icon}</span>
                <span className="font-medium">{badge.text}</span>
              </motion.div>
            ))}
          </div>

          {/* animated stat cards */}
          <div ref={statsRef}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {displayedAchievements.map((stat, i) => (
                <StatCard key={i} {...stat} started={statsStarted} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 3 — SERVICES PREVIEW
      ═══════════════════════════════════════ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-purple/3 to-transparent -z-10" />
        <div className="container">
          <SectionHeading
            eyebrow="What I Build"
            heading="Services"
            subtext="End-to-end solutions across AI, automation, and software development."
          />
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {displayedServices.map((svc, i) => (
              <motion.div key={i} variants={itemVariants} className="h-full">
                <div className="group h-full flex flex-col rounded-3xl border border-border-subtle bg-bg-card overflow-hidden hover:border-accent-blue/30 hover:shadow-glow-blue transition-all duration-300">
                  {/* Card Header Image */}
                  <div className="h-44 w-full overflow-hidden relative bg-bg-secondary border-b border-border-subtle">
                    <img
                      src={getServiceImage(svc.title, i)}
                      alt={svc.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-card/30 to-transparent" />
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center flex-shrink-0 ${svc.color}`}
                        >
                          {svc.icon}
                        </div>
                        <h3 className="text-lg font-display font-bold text-text-primary leading-tight">
                          {svc.title}
                        </h3>
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {svc.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border-subtle hover:border-accent-blue hover:text-accent-blue text-text-secondary hover:scale-[1.03] active:scale-[0.98] rounded-xl text-sm font-medium transition-all"
            >
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 4 — FEATURED CASE STUDIES
      ═══════════════════════════════════════ */}
      <section className="py-24 bg-bg-secondary/30 border-y border-border-subtle relative">
        <div className="container">
          <SectionHeading
            eyebrow="Business Impact"
            heading="Featured Case Studies"
            subtext="Real problems. Real solutions. Measured results."
          />
          {featuredCases.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {featuredCases.map((cs) => (
                <motion.div key={cs._id} variants={itemVariants}>
                  <AnimatedCard className="flex flex-col group overflow-hidden hover:border-accent-cyan/35 hover:shadow-card-hover transition-all duration-300 h-full">
                    {cs.imageUrl && (
                      <div className="h-44 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent z-10 opacity-70" />
                        <img
                          src={cs.imageUrl}
                          alt={cs.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-xs font-mono text-accent-cyan mb-2">
                        {cs.category}
                      </span>
                      <h3 className="text-lg font-display font-bold text-text-primary mb-2 group-hover:text-accent-cyan transition-colors duration-300">
                        {cs.title}
                      </h3>
                      <p className="text-text-secondary text-sm mb-4 flex-grow line-clamp-2">
                        {cs.subtitle}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(cs.techStack || []).slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-mono px-2 py-1 bg-bg-elevated border border-border-subtle rounded text-text-muted"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <Link
                        to={`/case-studies/${cs._id}`}
                        className="text-xs font-medium text-accent-blue hover:underline flex items-center gap-1"
                      >
                        Read Case Study <ArrowRight size={13} />
                      </Link>
                    </div>
                  </AnimatedCard>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* fallback placeholder cards */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Phoneo SaaS Platform",
                  cat: "SaaS",
                  desc: "Full SaaS platform with auth, billing, and real-time dashboard.",
                  tech: ["Next.js", "PostgreSQL", "Stripe"],
                },
                {
                  title: "AI Email Automation",
                  cat: "AI Automation",
                  desc: "GPT-4 powered email drafting & scheduling automation via n8n.",
                  tech: ["n8n", "OpenAI", "Gmail API"],
                },
                {
                  title: "WhatsApp Automation",
                  cat: "Automation",
                  desc: "WhatsApp Business API bot for order tracking and customer support.",
                  tech: ["WhatsApp API", "Node.js", "MongoDB"],
                },
              ].map((cs, i) => (
                <AnimatedCard
                  key={i}
                  className="p-6 flex flex-col hover:border-accent-cyan/20 hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="h-32 bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 rounded-xl mb-4 flex items-center justify-center">
                    <Bot size={32} className="text-text-muted opacity-40" />
                  </div>
                  <span className="text-xs font-mono text-accent-cyan mb-2">
                    {cs.cat}
                  </span>
                  <h3 className="text-lg font-display font-bold text-text-primary mb-2">
                    {cs.title}
                  </h3>
                  <p className="text-text-secondary text-sm mb-4 flex-grow">
                    {cs.desc}
                  </p>
                  <div className="flex gap-2">
                    {cs.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-2 py-1 bg-bg-elevated border border-border-subtle rounded text-text-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </AnimatedCard>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              to="/case-studies"
              className="inline-flex items-center gap-2 text-text-primary hover:text-accent-blue hover:scale-[1.03] font-medium transition-all"
            >
              View All Case Studies <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 5 — FEATURED PROJECTS
      ═══════════════════════════════════════ */}
      <section className="py-24">
        <div className="container">
          <SectionHeading
            eyebrow="Portfolio"
            heading="Featured Projects"
            subtext="A selection of my recent projects focusing on full-stack development, AI, and automation."
          />
          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-80 bg-bg-card animate-pulse rounded-2xl"
                />
              ))}
            </div>
          ) : featuredProjects.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {featuredProjects.map((project) => (
                <motion.div key={project._id} variants={itemVariants}>
                  <AnimatedCard className="flex flex-col group overflow-hidden hover:border-accent-blue/30 hover:shadow-card-hover transition-all duration-300 h-full">
                    <div className="h-48 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent z-10 opacity-60" />
                      {project.imageUrl ? (
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 flex items-center justify-center">
                          <Code2
                            size={36}
                            className="text-text-muted opacity-30"
                          />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-xs font-mono text-accent-blue mb-2">
                        {project.category}
                      </span>
                      <h3 className="text-xl font-display font-bold mb-2 text-text-primary group-hover:text-accent-blue transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-text-secondary text-sm mb-4 line-clamp-2 flex-grow">
                        {project.problem}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-mono px-2 py-1 bg-bg-elevated border border-border-subtle rounded-md text-text-muted"
                          >
                            {t}
                          </span>
                        ))}
                        {project.tech.length > 3 && (
                          <span className="text-[10px] font-mono px-2 py-1 bg-bg-elevated border border-border-subtle rounded-md text-text-muted">
                            +{project.tech.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </AnimatedCard>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center text-text-muted py-12">
              Projects coming soon.
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-text-primary hover:text-accent-blue hover:scale-[1.03] transition-all font-medium"
            >
              View All Projects <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 6 — SKILLS SNAPSHOT
      ═══════════════════════════════════════ */}
      <section className="py-16 bg-bg-secondary/50 border-y border-border-subtle">
        <div className="container">
          <p className="text-center text-xs font-mono text-text-muted mb-8 uppercase tracking-widest">
            Core Tech Stack
          </p>
          <div className="flex flex-wrap justify-center gap-3.5 max-w-3xl mx-auto">
            {highlightedSkills.map((sk, i) => (
              <motion.div
                key={sk.name}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  borderColor: "rgba(79, 142, 255, 0.4)",
                  boxShadow: "0 4px 15px rgba(79, 142, 255, 0.15)",
                }}
                className="flex items-center gap-2.5 px-4.5 py-2.5 bg-bg-card/75 border border-border-subtle rounded-full text-text-secondary text-sm hover:text-accent-blue transition-all cursor-default backdrop-blur-sm"
              >
                <span className="text-accent-blue">{sk.icon}</span>
                <span className="font-semibold text-text-primary hover:text-accent-blue transition-colors duration-200">
                  {sk.name}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/skills"
              className="text-xs font-mono text-text-muted hover:text-accent-blue transition-colors"
            >
              View Full Skills →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 7 — PROCESS TIMELINE
      ═══════════════════════════════════════ */}
      <section className="py-24 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent-blue/4 blur-[120px] rounded-full -z-10" />
        <div className="container">
          <SectionHeading
            eyebrow="How I Work"
            heading="My Process"
            subtext="A clear, transparent workflow from first call to final deployment."
          />
          <div className="relative max-w-4xl mx-auto">
            {/* vertical line (desktop) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border-subtle -translate-x-1/2" />
            <div className="space-y-8">
              {displayedProcessSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div
                    className={`flex-1 ${i % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"}`}
                  >
                    <div className="bg-bg-card/65 backdrop-blur-sm border border-border-subtle rounded-2xl p-6 hover:border-accent-blue/40 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group">
                      <h3 className="font-display font-bold text-text-primary mb-2 group-hover:text-accent-blue transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                  {/* center badge */}
                  <div className="hidden md:flex flex-shrink-0 w-12 h-12 rounded-full bg-bg-elevated border-2 border-accent-blue/40 items-center justify-center text-accent-blue font-mono text-xs font-bold z-10 group-hover:scale-110 transition-transform">
                    {step.step}
                  </div>
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 8 — TESTIMONIALS
      ═══════════════════════════════════════ */}
      <section className="py-24 bg-bg-secondary/30 border-y border-border-subtle relative overflow-hidden">
        <div className="container">
          <SectionHeading eyebrow="Social Proof" heading="Client Reviews" />
          {testimonials && testimonials.length > 0 ? (
            <div className="max-w-3xl mx-auto relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIdx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-bg-card border border-border-subtle rounded-3xl p-10 text-center"
                >
                  <div className="flex justify-center gap-1 mb-6">
                    {Array.from({
                      length: testimonials[testimonialIdx].rating || 5,
                    }).map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-text-primary text-lg italic leading-relaxed mb-8 opacity-90">
                    "{testimonials[testimonialIdx].content}"
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-accent-blue font-bold">
                      {testimonials[testimonialIdx].clientName?.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="text-text-primary text-sm font-bold">
                        {testimonials[testimonialIdx].clientName}
                      </p>
                      <p className="text-text-muted text-xs">
                        {testimonials[testimonialIdx].projectTitle}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIdx(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === testimonialIdx ? "bg-accent-blue w-6" : "bg-border-subtle"}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* fallback placeholder */
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: "CEO, TechStart AI",
                  review:
                    '"Ashish doesn\'t just write code; he understands the product vision. His AI integration saved us months of manual R&D."',
                  rating: 5,
                },
                {
                  name: "Director, Nexus Labs",
                  review:
                    '"Reliable, technically brilliant, and fast. The new dashboard architecture is a masterpiece of performance."',
                  rating: 5,
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className="bg-bg-card border border-border-subtle rounded-2xl p-8 hover:border-accent-purple/20 hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <span key={j} className="text-yellow-400">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-text-primary italic text-sm leading-relaxed mb-6 opacity-90">
                    {t.review}
                  </p>
                  <p className="text-text-muted text-xs font-bold tracking-widest uppercase">
                    {t.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 9 — FAQ
      ═══════════════════════════════════════ */}
      <section className="py-24">
        <div className="container max-w-3xl mx-auto">
          <SectionHeading eyebrow="Questions" heading="Frequently Asked" />
          <div className="space-y-4">
            {displayedFaqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden hover:border-accent-blue/25 transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-bg-elevated/40 transition-colors"
                >
                  <span className="font-semibold text-text-primary pr-4">
                    {faq.q}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp
                      size={18}
                      className="text-accent-blue flex-shrink-0"
                    />
                  ) : (
                    <ChevronDown
                      size={18}
                      className="text-text-muted flex-shrink-0"
                    />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-text-secondary text-sm leading-relaxed border-t border-border-subtle pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 10 — FINAL CTA
      ═══════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-card to-[#0d0d20] -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-accent-purple/8 blur-[100px] rounded-full -z-10" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto bg-bg-elevated/40 backdrop-blur-md border border-border-subtle p-12 md:p-16 rounded-3xl text-center shadow-glow-purple hover:border-accent-purple/30 transition-all duration-300">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs font-mono mb-6">
              Ready to automate?
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-6">
              {displayedConfig.ctaTitle.split(" ").slice(0, -2).join(" ")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-cyan font-bold">
                {displayedConfig.ctaTitle.split(" ").slice(-2).join(" ")}
              </span>
            </h2>
            <p className="text-text-secondary text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              {displayedConfig.ctaSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={displayedConfig.ctaBtnLink}
                className="px-8 py-4 bg-white text-bg-primary hover:bg-accent-cyan hover:text-bg-primary hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(34,211,238,0.45)] rounded-xl font-bold transition-all shadow-lg text-base active:scale-[0.98]"
              >
                {displayedConfig.ctaBtnText}
              </Link>
              <Link
                to={displayedConfig.heroCtaLink}
                className="px-8 py-4 bg-bg-elevated/40 backdrop-blur-md border border-border-subtle hover:border-accent-purple text-text-secondary hover:text-accent-purple hover:scale-[1.03] rounded-xl font-semibold transition-all text-base active:scale-[0.98]"
              >
                View Case Studies
              </Link>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
