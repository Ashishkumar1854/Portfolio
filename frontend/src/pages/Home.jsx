import { useState, useEffect, useMemo, useRef } from "react";
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
  Server,
  Database,
  Cpu,
  Shield,
  Brain,
  GitBranch,
} from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiDocker,
  SiRedis,
  SiNginx,
  SiOpenai,
  SiN8N,
  SiJavascript,
  SiTypescript,
  SiTailwindcss,
  SiVite,
  SiLinux,
  SiGithub,
  SiGit,
  SiPrisma,
  SiFirebase,
  SiVercel,
  SiCloudflare,
  SiJsonwebtokens,
  SiOpenapiinitiative,
  SiLangchain,
  SiHuggingface,
  SiGooglegemini,
  SiCloudinary,
  SiPostman,
  SiFigma,
  SiMysql,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
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
    let frameId = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [target, duration, start]);
  return count;
};

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

/* ── technology icon helper ── */
const normalizeTechnologyName = (value = "") =>
  value.toLowerCase().replace(/[^a-z0-9+#.]/g, "");

const TECHNOLOGY_ICONS = [
  { keys: ["react"], icon: SiReact },
  { keys: ["nextjs", "next"], icon: SiNextdotjs },
  { keys: ["nodejs", "node"], icon: SiNodedotjs },
  { keys: ["express"], icon: SiExpress },
  { keys: ["mongodb", "mongo"], icon: SiMongodb },
  { keys: ["postgresql", "postgres"], icon: SiPostgresql },
  { keys: ["docker"], icon: SiDocker },
  { keys: ["redis"], icon: SiRedis },
  { keys: ["aws", "amazonwebservices"], icon: FaAws },
  { keys: ["nginx"], icon: SiNginx },
  { keys: ["openai", "gpt"], icon: SiOpenai },
  { keys: ["n8n"], icon: SiN8N },
  { keys: ["llm", "llms"], icon: Brain },
  { keys: ["vps", "server"], icon: Server },
  { keys: ["jwt"], icon: SiJsonwebtokens },
  { keys: ["restapi", "restapis", "openapi"], icon: SiOpenapiinitiative },
  { keys: ["rag", "langchain"], icon: SiLangchain },
  { keys: ["huggingface"], icon: SiHuggingface },
  { keys: ["gemini"], icon: SiGooglegemini },
  { keys: ["cicd", "pipeline", "githubactions"], icon: GitBranch },
  { keys: ["javascript", "js"], icon: SiJavascript },
  { keys: ["typescript", "ts"], icon: SiTypescript },
  { keys: ["tailwind"], icon: SiTailwindcss },
  { keys: ["vite"], icon: SiVite },
  { keys: ["linux"], icon: SiLinux },
  { keys: ["github"], icon: SiGithub },
  { keys: ["git"], icon: SiGit },
  { keys: ["prisma"], icon: SiPrisma },
  { keys: ["firebase"], icon: SiFirebase },
  { keys: ["vercel"], icon: SiVercel },
  { keys: ["cloudflare"], icon: SiCloudflare },
  { keys: ["cloudinary"], icon: SiCloudinary },
  { keys: ["postman"], icon: SiPostman },
  { keys: ["figma"], icon: SiFigma },
  { keys: ["mysql"], icon: SiMysql },
];

const TECHNOLOGY_SUBTITLES = [
  { keys: ["react"], subtitle: "Frontend Framework" },
  { keys: ["nextjs", "next"], subtitle: "React Framework" },
  { keys: ["nodejs", "node"], subtitle: "Backend Runtime" },
  { keys: ["express"], subtitle: "Backend Framework" },
  { keys: ["mongodb", "mongo"], subtitle: "NoSQL Database" },
  { keys: ["postgresql", "postgres"], subtitle: "Relational Database" },
  { keys: ["docker"], subtitle: "Containerization" },
  { keys: ["nginx"], subtitle: "Reverse Proxy" },
  { keys: ["redis"], subtitle: "Cache Layer" },
  { keys: ["aws", "amazonwebservices"], subtitle: "Cloud Platform" },
  { keys: ["openai", "gpt"], subtitle: "AI Platform" },
  { keys: ["n8n"], subtitle: "Workflow Automation" },
  { keys: ["jwt"], subtitle: "Authentication" },
  { keys: ["restapi", "restapis", "api"], subtitle: "API Integration" },
  { keys: ["rag"], subtitle: "Retrieval Pipeline" },
  { keys: ["llm", "llms"], subtitle: "AI Models" },
  { keys: ["javascript", "js"], subtitle: "Programming Language" },
  { keys: ["typescript", "ts"], subtitle: "Typed JavaScript" },
  { keys: ["tailwind"], subtitle: "Styling System" },
  { keys: ["git", "github"], subtitle: "Developer Workflow" },
  { keys: ["vercel"], subtitle: "Deployment Platform" },
  { keys: ["cloudinary"], subtitle: "Media Platform" },
  { keys: ["firebase"], subtitle: "App Platform" },
];

const getTechnologyIcon = (name, iconName) => {
  const normalized = normalizeTechnologyName(`${name || ""} ${iconName || ""}`);
  const matchedIcon = TECHNOLOGY_ICONS.find(({ keys }) =>
    keys.some((key) => normalized.includes(key)),
  )?.icon;
  const Icon = matchedIcon || Code2;
  return <Icon size={24} aria-hidden="true" focusable="false" />;
};

const getTechnologySubtitle = (name, iconName) => {
  const normalized = normalizeTechnologyName(`${name || ""} ${iconName || ""}`);
  return TECHNOLOGY_SUBTITLES.find(({ keys }) =>
    keys.some((key) => normalized.includes(key)),
  )?.subtitle || "Engineering Tool";
};

/* ── hardcoded fallbacks ── */
const DEFAULT_HOME_CONFIG = {
  heroBadge: "AI Automation • SaaS Development",
  heroTitle: "AI Automation & Custom SaaS Development",
  heroSubtitle:
    "I build AI automation, n8n workflows, SaaS platforms, business process automation, and custom full-stack software for teams that need reliable systems.",
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
    "Share your workflow, SaaS idea, or custom software requirement and I will help you map the next practical build step.",
  ctaBtnText: "Book a Discovery Call",
  ctaBtnLink: "/hire",
};

const DEFAULT_SERVICES = [
  {
    icon: <Bot size={22} />,
    title: "AI Automation Systems",
    desc: "Custom AI agents and automation flows that reduce manual work, route data, and support business operations with reliable guardrails.",
    color: "text-accent-purple",
  },
  {
    icon: <Workflow size={22} />,
    title: "n8n Automation",
    desc: "Production-ready n8n workflows that connect APIs, databases, CRMs, email, and internal tools without fragile manual handoffs.",
    color: "text-accent-cyan",
  },
  {
    icon: <MessageCircle size={22} />,
    title: "WhatsApp Automation",
    desc: "WhatsApp Business API automation for lead capture, support, order updates, reminders, and customer communication workflows.",
    color: "text-green-400",
  },
  {
    icon: <Layers size={22} />,
    title: "Custom SaaS Development",
    desc: "SaaS platforms with authentication, dashboards, API integration, admin workflows, and scalable foundations from MVP to production.",
    color: "text-accent-blue",
  },
  {
    icon: <Globe size={22} />,
    title: "Full Stack Applications",
    desc: "Custom software built with modern frontend, backend, database, and deployment practices for real business use cases.",
    color: "text-yellow-400",
  },
  {
    icon: <Zap size={22} />,
    title: "AI Integrations",
    desc: "Integrate OpenAI, RAG, vector search, and AI features into existing products, support workflows, and internal platforms.",
    color: "text-pink-400",
  },
];

const DEFAULT_PROCESS = [
  {
    step: "01",
    title: "Discovery",
    desc: "Clarify the business goal, users, current workflow, constraints, and success criteria.",
  },
  {
    step: "02",
    title: "Planning",
    desc: "Define the scope, data flow, integrations, milestones, and the simplest reliable build path.",
  },
  {
    step: "03",
    title: "Development",
    desc: "Build the automation, SaaS feature, API, or full-stack system in focused delivery cycles.",
  },
  {
    step: "04",
    title: "Testing",
    desc: "Validate core flows, edge cases, integrations, performance, and production readiness.",
  },
  {
    step: "05",
    title: "Deployment",
    desc: "Launch with environment setup, deployment checks, and clear handoff notes.",
  },
  {
    step: "06",
    title: "Support",
    desc: "Provide post-launch fixes, improvements, and scaling guidance as the product grows.",
  },
];

const DEFAULT_FAQS = [
  {
    q: "How much does an AI automation project cost?",
    a: "Cost depends on the workflow, number of integrations, data sources, and reliability requirements. Small automations are usually scoped differently from multi-step AI systems or SaaS integrations.",
  },
  {
    q: "How long does a SaaS project take?",
    a: "A focused SaaS MVP can often be planned in phases, starting with core authentication, dashboards, workflows, and integrations. Timeline depends on feature depth and how quickly feedback is available.",
  },
  {
    q: "Do you work with startups and small businesses?",
    a: "Yes. I work with founders, growing teams, and small businesses that need practical AI automation, custom software, or SaaS development without unnecessary complexity.",
  },
  {
    q: "Can you work with existing systems?",
    a: "Yes. Existing tools, spreadsheets, CRMs, APIs, websites, and internal systems can often be connected or automated using n8n, API integration, and custom backend logic.",
  },
  {
    q: "Do you provide ongoing support?",
    a: "Yes. After launch, I can help with bug fixes, workflow improvements, deployment support, monitoring, and future feature planning.",
  },
];

const DEFAULT_ACHIEVEMENTS = [
  {
    label: "Projects Delivered",
    value: "15",
    suffix: "+",
    icon: <Briefcase size={20} className="text-accent-blue mx-auto" />,
  },
  {
    label: "Automation Workflows",
    value: "20",
    suffix: "+",
    icon: <Workflow size={20} className="text-accent-purple mx-auto" />,
  },
  {
    label: "Business Solutions",
    value: "10",
    suffix: "+",
    icon: <Users size={20} className="text-accent-cyan mx-auto" />,
  },
  {
    label: "Years Building",
    value: "3",
    suffix: "+",
    icon: <Trophy size={20} className="text-yellow-400 mx-auto" />,
  },
];

const DEFAULT_TRUST_BADGES = [
  { icon: "🚀", text: "AI Automation & SaaS Builder" },
  { icon: "🏆", text: "NCIIPC–AICTE Pentathon Finalist" },
  { icon: "🥇", text: "National Hackathon Finalist" },
  { icon: "🎓", text: "Full Stack Engineering Background" },
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

  const featuredProjects = useMemo(
    () => (projects ? projects.filter((p) => p.featured).slice(0, 3) : []),
    [projects],
  );
  const projectImage = (project) => project.thumbnail || project.imageUrl || project.ogImage;
  const projectTech = (project) => project.techStack?.length ? project.techStack : project.tech || [];
  const projectDescription = (project) => project.shortDescription || project.problem || project.overview;
  const featuredProjectGridClass = featuredProjects.length === 1
    ? "mx-auto grid max-w-3xl grid-cols-1 gap-8"
    : featuredProjects.length === 2
      ? "mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2 gap-8"
      : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 2xl:gap-10";
  const featuredCases = useMemo(
    () => (caseStudies ? caseStudies.filter((c) => c.featured).slice(0, 3) : []),
    [caseStudies],
  );

  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  /* auto-advance testimonials */
  useEffect(() => {
    if (!testimonials || testimonials.length <= 1) return;
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

  const dbAchievements = useMemo(
    () => (
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
        : []
    ),
    [achLoading, achievements],
  );

  const displayedAchievements = useMemo(
    () => (dbAchievements.length === 4 ? dbAchievements : DEFAULT_ACHIEVEMENTS),
    [dbAchievements],
  );

  /* resolving dynamic values with seeder fallbacks */
  const displayedConfig = useMemo(
    () => ({ ...DEFAULT_HOME_CONFIG, ...(homeConfig || {}) }),
    [homeConfig],
  );
  const heroTitleParts = displayedConfig.heroTitle.includes("&")
    ? displayedConfig.heroTitle.split("&")
    : [displayedConfig.heroTitle, ""];

  const displayedTrustBadges = useMemo(
    () => (dbTrustBadges && dbTrustBadges.length > 0 ? dbTrustBadges : DEFAULT_TRUST_BADGES),
    [dbTrustBadges],
  );

  const displayedServices = useMemo(
    () => (
      dbServices && dbServices.length > 0
        ? dbServices.slice(0, 6).map((s) => ({
            icon: getServiceIcon(s.icon, s.color),
            title: s.title,
            slug: s.slug,
            desc: s.overview || s.description,
            color: s.color || "text-accent-blue",
          }))
        : DEFAULT_SERVICES
    ),
    [dbServices],
  );

  const displayedProcessSteps = useMemo(
    () => (
      dbProcessSteps && dbProcessSteps.length > 0
        ? dbProcessSteps.map((step, idx) => ({
            step: String(idx + 1).padStart(2, "0"),
            title: step.title,
            desc: step.desc,
          }))
        : DEFAULT_PROCESS
    ),
    [dbProcessSteps],
  );

  const displayedFaqs = useMemo(
    () => (dbFaqs && dbFaqs.length > 0 ? dbFaqs.map((faq) => ({ q: faq.question, a: faq.answer })) : DEFAULT_FAQS),
    [dbFaqs],
  );

  const highlightedSkills = useMemo(
    () => {
      const skills = dbSkills || [];
      const homeSkills = skills.filter((s) => s.showOnHome);
      const selectedSkills = (homeSkills.length > 0 ? homeSkills : skills)
        .filter((skill) => skill?.name)
        .slice(0, 12);
      return selectedSkills.map((skill) => ({
        name: skill.name,
        icon: getTechnologyIcon(skill.name, skill.icon),
        subtitle: getTechnologySubtitle(skill.name, skill.icon),
      }));
    },
    [dbSkills],
  );

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
                {displayedConfig.heroBadge}
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
                {heroTitleParts[0].trim()}
                {heroTitleParts[1] && (
                  <>
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan">
                      &amp; {heroTitleParts.slice(1).join("&").trim()}
                    </span>
                  </>
                )}
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
                className="flex flex-col sm:flex-row items-center gap-4 mb-4 w-full sm:w-auto"
              >
                <Link
                  to={displayedConfig.heroCtaLink}
                  className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-accent-blue to-accent-cyan hover:from-blue-500 hover:to-cyan-400 text-white rounded-2xl font-bold text-base transition-all hover:scale-[1.04] hover:shadow-[0_0_30px_rgba(79,142,255,0.5)] active:scale-[0.97] flex items-center justify-center gap-2.5 shadow-glow-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
                >
                  {displayedConfig.heroCtaText} <ArrowRight size={20} />
                </Link>
                <Link
                  to={displayedConfig.heroSecondaryLink}
                  className="w-full sm:w-auto px-7 py-3 bg-bg-elevated/50 backdrop-blur-md border border-border-subtle hover:border-accent-purple/50 hover:bg-bg-card hover:scale-[1.04] text-text-primary rounded-2xl font-bold text-base transition-all active:scale-[0.97] text-center focus:outline-none focus:ring-2 focus:ring-accent-purple/35"
                >
                  {displayedConfig.heroSecondaryText} →
                </Link>
              </motion.div>

              {/* compact trust line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}
                className="max-w-xl text-sm text-text-muted"
              >
                Trusted approach • Production-ready engineering • Long-term support
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
                    alt="AI automation, SaaS development, and full-stack engineering workflow"
                    width="1024"
                    height="1024"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    sizes="(min-width: 1280px) 500px, (min-width: 1024px) 470px, 0px"
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
            heading="AI Automation and SaaS Services"
            subtext="Focused services for automation, API integration, SaaS platforms, and custom software development."
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
                      alt={`${svc.title} service preview`}
                      width="1024"
                      height="1024"
                      loading="lazy"
                      decoding="async"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
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
                          {svc.slug ? (
                            <Link
                              to={`/services/${svc.slug}`}
                              className="hover:text-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/25 rounded"
                            >
                              {svc.title}
                            </Link>
                          ) : (
                            svc.title
                          )}
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
              className="inline-flex items-center gap-2 px-6 py-3 border border-border-subtle hover:border-accent-blue hover:text-accent-blue text-text-secondary hover:scale-[1.03] active:scale-[0.98] rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
            >
              Explore Services <ArrowRight size={16} />
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
            subtext="Selected examples of automation, SaaS, and full-stack solutions built around business outcomes."
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
                          alt={`${cs.title} case study preview`}
                          loading="lazy"
                          decoding="async"
                          sizes="(min-width: 768px) 33vw, 100vw"
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
                        className="text-xs font-medium text-accent-blue hover:underline flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-accent-blue/25 rounded"
                      >
                        View Case Study <ArrowRight size={13} />
                      </Link>
                    </div>
                  </AnimatedCard>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* fallback case study cards */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Phoneo SaaS Platform",
                  cat: "SaaS",
                  desc: "A SaaS platform concept with secure authentication, subscription flow, and an operational dashboard for business users.",
                  tech: ["Next.js", "PostgreSQL", "Stripe"],
                },
                {
                  title: "AI Email Workflow Automation",
                  cat: "AI Automation",
                  desc: "An n8n and OpenAI workflow concept for drafting, routing, and scheduling repetitive customer emails.",
                  tech: ["n8n", "OpenAI", "Gmail API"],
                },
                {
                  title: "WhatsApp Customer Updates",
                  cat: "Automation",
                  desc: "A WhatsApp Business API automation concept for order updates, customer support, and lead follow-up.",
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
              className="inline-flex items-center gap-2 text-text-primary hover:text-accent-blue hover:scale-[1.03] font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent-blue/25 rounded"
              aria-label="Explore all case studies"
            >
              Explore Case Studies <ArrowRight size={16} />
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
            subtext="Recent work across full-stack applications, AI automation, API integration, and product-focused software."
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
              className={featuredProjectGridClass}
            >
              {featuredProjects.map((project) => (
                <motion.div key={project._id} variants={itemVariants}>
                  <AnimatedCard className="relative flex flex-col group overflow-hidden rounded-[2rem] border-white/10 bg-bg-card/90 hover:border-accent-blue/40 hover:shadow-[0_28px_90px_rgba(79,142,255,0.18)] transition-all duration-300 ease-out h-full">
                    <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    <div className="p-4 pb-0">
                      <div className="aspect-[2.14/1] overflow-hidden relative rounded-[1.6rem] border border-border-subtle bg-gradient-to-br from-bg-primary via-bg-elevated/50 to-bg-primary shadow-inner">
                      {projectImage(project) ? (
                        <img
                          src={projectImage(project)}
                          alt={`${project.title} project preview`}
                          loading="lazy"
                          decoding="async"
                          sizes={featuredProjects.length === 1 ? "(min-width: 768px) 768px, 100vw" : "(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"}
                          className="w-full h-full object-cover object-center scale-[0.985] group-hover:scale-100 transition-transform duration-300 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 flex items-center justify-center">
                          <Code2
                            size={36}
                            className="text-text-muted opacity-30"
                          />
                        </div>
                      )}
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      </div>
                    </div>
                    <div className="p-7 pt-6 flex flex-col flex-grow">
                      <span className="inline-flex w-fit rounded-full border border-accent-blue/25 bg-accent-blue/10 px-3.5 py-1.5 text-[11px] font-mono text-accent-blue mb-4 shadow-sm">
                        {project.category}
                      </span>
                      <h3 className="text-2xl md:text-[1.7rem] font-display font-bold mb-3 leading-tight text-text-primary group-hover:text-accent-blue transition-colors duration-300">
                        {project.slug ? (
                          <Link
                            to={`/projects/${project.slug}`}
                            className="focus:outline-none focus:ring-2 focus:ring-accent-blue/25 rounded"
                          >
                            {project.title}
                          </Link>
                        ) : (
                          project.title
                        )}
                      </h3>
                      <p className="text-text-secondary text-[15px] leading-7 mb-7 line-clamp-3 flex-grow">
                        {projectDescription(project)}
                      </p>
                      <div className="flex flex-wrap gap-2.5 mt-auto border-t border-border-subtle/70 pt-5">
                        {projectTech(project).slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-mono px-3 py-1.5 bg-bg-elevated/80 border border-border-subtle rounded-full text-text-muted shadow-sm"
                          >
                            {t}
                          </span>
                        ))}
                        {projectTech(project).length > 3 && (
                          <span className="text-[10px] font-mono px-3 py-1.5 bg-bg-elevated/80 border border-border-subtle rounded-full text-text-muted shadow-sm">
                            +{projectTech(project).length - 3}
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
              className="inline-flex items-center gap-2 text-text-primary hover:text-accent-blue hover:scale-[1.03] transition-all font-medium focus:outline-none focus:ring-2 focus:ring-accent-blue/25 rounded"
            >
              View Project Work <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 6 — SKILLS SNAPSHOT
      ═══════════════════════════════════════ */}
      <section className="py-8 bg-bg-secondary/50 border-y border-border-subtle">
        <div className="container">
          <div className="mx-auto mb-5 max-w-2xl text-center">
            <h2 className="text-xs font-mono text-text-muted uppercase tracking-widest">
              CORE ENGINEERING STACK
            </h2>
            <p className="mt-3 text-sm text-text-secondary">
              The technologies behind scalable AI automation and SaaS products.
            </p>
          </div>

          {highlightedSkills.length > 0 ? (
            <div className="mx-auto grid w-fit max-w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {highlightedSkills.map((sk, index) => (
                <div
                  key={sk.name}
                  className={`group flex h-full min-h-[76px] w-[250px] max-w-full items-center gap-2.5 rounded-xl border border-border-subtle bg-white/95 px-2.5 py-2.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-blue/40 hover:shadow-[0_10px_24px_rgba(79,142,255,0.12)] ${
                    highlightedSkills.length % 3 === 2 && index >= highlightedSkills.length - 2
                      ? "lg:translate-x-[129px]"
                      : ""
                  } ${
                    highlightedSkills.length % 3 === 1 && index === highlightedSkills.length - 1
                      ? "lg:col-start-2"
                      : ""
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent-blue/10 bg-accent-blue/10 text-accent-blue transition-colors duration-300 group-hover:border-accent-blue/20 group-hover:bg-accent-blue/15">
                    {sk.icon}
                  </span>
                  <div className="min-w-0 pr-1">
                    <h3 className="whitespace-nowrap text-[13px] font-display font-bold leading-tight text-slate-950">
                      {sk.name}
                    </h3>
                    <p className="mt-0.5 whitespace-nowrap text-[10px] font-medium leading-snug text-gray-500">
                      {sk.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-text-muted">
              Technology stack is managed from the CMS.
            </p>
          )}

          <div className="text-center mt-5">
            <Link
              to="/skills"
              aria-label="View complete skills stack"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border-subtle bg-white/90 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent-blue/35 hover:text-accent-blue hover:shadow-[0_10px_24px_rgba(79,142,255,0.12)] focus:outline-none focus:ring-2 focus:ring-accent-blue/25"
            >
              View Complete Stack →
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
            heading="Delivery Process"
            subtext="A simple workflow for turning business requirements into tested, deployed software."
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
                  <div className="flex justify-center gap-1 mb-6" aria-label={`${testimonials[testimonialIdx].rating || 5} out of 5 rating`}>
                    {Array.from({
                      length: testimonials[testimonialIdx].rating || 5,
                    }).map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl" aria-hidden="true">
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
                    aria-label={`Show testimonial ${i + 1}`}
                    aria-pressed={i === testimonialIdx}
                    className={`w-2 h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-accent-blue/35 ${i === testimonialIdx ? "bg-accent-blue w-6" : "bg-border-subtle"}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* fallback testimonials */
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: "Founder, FinTech Startup",
                  review:
                    '"Ashish helped us turn a messy manual reporting process into a clear automation workflow. He asked practical questions and delivered something our team could actually use."',
                  rating: 5,
                },
                {
                  name: "Director, Local Business",
                  review:
                    '"We needed a custom system that connected our daily operations without adding more tools. The work was structured, clear, and easy for our staff to adopt."',
                  rating: 5,
                },
                {
                  name: "Product Lead, SaaS Startup",
                  review:
                    '"The SaaS dashboard and API integration work gave us a cleaner foundation for our MVP. Communication was direct and the handoff was easy to follow."',
                  rating: 5,
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className="bg-bg-card border border-border-subtle rounded-2xl p-8 hover:border-accent-purple/20 hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="flex gap-1 mb-4" aria-label={`${t.rating} out of 5 rating`}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <span key={j} className="text-yellow-400" aria-hidden="true">
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
          <SectionHeading eyebrow="Questions" heading="Frequently Asked Questions" />
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
                  aria-expanded={openFaq === i}
                  aria-controls={`home-faq-${i}`}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-bg-elevated/40 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-blue/25"
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
                      <div id={`home-faq-${i}`} className="px-6 pb-6 text-text-secondary text-sm leading-relaxed border-t border-border-subtle pt-4">
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
                className="px-8 py-4 bg-white text-bg-primary hover:bg-accent-cyan hover:text-bg-primary hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(34,211,238,0.45)] rounded-xl font-bold transition-all shadow-lg text-base active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-accent-cyan/45"
              >
                {displayedConfig.ctaBtnText}
              </Link>
              <Link
                to={displayedConfig.heroCtaLink}
                className="px-8 py-4 bg-bg-elevated/40 backdrop-blur-md border border-border-subtle hover:border-accent-purple text-text-secondary hover:text-accent-purple hover:scale-[1.03] rounded-xl font-semibold transition-all text-base active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-accent-purple/35"
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
