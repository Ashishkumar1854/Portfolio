import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Trophy, GraduationCap, Rocket, Download, ArrowRight,
  CheckCircle, Sparkles
} from 'lucide-react';
import heroWorkstationImg from '../assets/images/about/hero-workstation.webp';
import currentAiSystemsImg from '../assets/images/about/current-ai-systems.webp';
import engineeringGrowthPathImg from '../assets/images/about/engineering-growth-path.webp';
import engineeringPrinciplesImg from '../assets/images/about/engineering-principles.webp';
import buildTogetherImg from '../assets/images/about/build-together.webp';
import useApi from '../hooks/useApi';

const ACHIEVEMENTS = [
  { icon: <Rocket size={18} />, title: 'Founder of Phoneo', desc: 'Built and launched a SaaS platform from scratch.' },
  { icon: <Trophy size={18} />, title: 'NCIIPC–AICTE Pentathon Finalist', desc: 'Recognized in a national-level cybersecurity competition.' },
  { icon: <Trophy size={18} />, title: 'CIH 2.0 National Hackathon Finalist', desc: 'Competed among 1000+ teams at national level.' },
  { icon: <GraduationCap size={18} />, title: 'B.Tech in Information Technology', desc: 'Grounded in software engineering fundamentals.' },
];

const WHY_CHOOSE = [
  { title: 'Business-First Thinking', desc: 'I build for business outcomes, not just technical correctness. Every feature has a purpose.' },
  { title: 'Full-Stack Ownership', desc: 'One engineer who handles frontend, backend, AI, DevOps — no coordination overhead.' },
  { title: 'Automation-First Mindset', desc: 'I look for opportunities to automate before building manual solutions.' },
  { title: 'Clear Communication', desc: 'Regular updates, transparent timelines, and technical explanations in plain language.' },
  { title: 'Production-Ready Code', desc: 'Security, performance, and scalability are built-in — not afterthoughts.' },
];

const JOURNEY_MILESTONES = [
  { year: '2021', title: 'Started Building', desc: 'Moved from fundamentals into real full-stack projects.' },
  { year: '2022', title: 'AI & Automation', desc: 'Started exploring n8n, OpenAI APIs, and automated systems.' },
  { year: '2023', title: 'National Finalist', desc: 'Reached finalist rounds in NCIIPC–AICTE and CIH 2.0.' },
  { year: '2024', title: 'Founded Phoneo', desc: 'Built a SaaS product from idea to deployed system.' },
  { year: '2025', title: 'Focused Direction', desc: 'Shifted deeper into AI agents, workflows, and SaaS automation.' },
  { year: '2026', title: 'Current Chapter', desc: 'Building automation systems and product foundations for growing teams.' },
];

const CREDIBILITY_STATS = [
  { value: '3+', label: 'Years building products' },
  { value: '15+', label: 'Projects shipped' },
  { value: '20+', label: 'Automation workflows' },
];

const About = () => {
  const { data: aboutData } = useApi('/api/about');

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <span className="text-xs font-mono text-accent-blue tracking-[0.2em] uppercase mb-3 block">
                — {aboutData?.bioSubtitle || 'Who I Am'} —
              </span>
              <p className="text-sm font-semibold text-text-primary mb-3">Ashish Kumar</p>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-text-primary mb-5 leading-[1.05] tracking-tight">
                {aboutData?.bioTitle || 'AI Automation Engineer & SaaS Product Builder'}
              </h1>
              <div className="mb-6 flex flex-wrap gap-2 text-[11px] font-mono uppercase tracking-wider text-text-muted">
                <span className="rounded-full border border-border-subtle px-3 py-1">Founder</span>
                <span className="rounded-full border border-border-subtle px-3 py-1">National Finalist</span>
                <span className="rounded-full border border-border-subtle px-3 py-1">Product Builder</span>
              </div>
              <div className="max-w-2xl text-text-secondary text-[15px] space-y-3 leading-7">
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
              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <a
                  href={aboutData?.resumeUrl || '/resume.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent-blue hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-all shadow-glow-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
                >
                  <Download size={16} /> Download Resume
                </a>
                <Link
                  to="/hire"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-border-subtle hover:border-accent-purple text-text-secondary hover:text-accent-purple rounded-xl font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-purple/30"
                >
                  Hire Me <ArrowRight size={15} />
                </Link>
                <a
                  href={aboutData?.followUrl || 'https://linkedin.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border-subtle hover:border-accent-blue text-text-secondary hover:text-accent-blue rounded-xl font-semibold text-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
                >
                  Follow Ashish
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2 flex justify-center lg:pt-20"
            >
              <div className="relative w-full max-w-[640px]">
                <div className="absolute -inset-7 rounded-[2rem] bg-accent-blue/10 blur-3xl" />
                <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-bg-card p-2 shadow-[0_24px_80px_rgba(79,142,255,0.16)]">
                  <img
                    src={heroWorkstationImg}
                    alt="Premium AI engineering workstation with automation architecture"
                    width="1672"
                    height="941"
                    loading="eager"
                    decoding="async"
                    className="aspect-[16/9] w-full rounded-[1.35rem] object-contain object-center"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CURRENT WORK & VISION ── */}
        <section className="mb-24 overflow-hidden rounded-[2rem] bg-gradient-to-br from-bg-secondary via-bg-secondary to-accent-blue/5 p-7 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="text-xs font-mono text-accent-cyan tracking-[0.2em] uppercase mb-3 block">— Current Work —</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4 leading-tight">
                  Building practical AI systems for real operations.
                </h2>
                <p className="text-text-secondary leading-relaxed mb-6 text-sm md:text-base max-w-2xl">
                  Today my work is focused on productized automation: AI agents, n8n systems, WhatsApp workflows, and SaaS foundations that reduce manual work for growing teams.
                </p>
                <ul className="space-y-3">
                  {['Reusable AI agent frameworks for business automation', 'n8n workflow systems that connect APIs and internal tools', 'SaaS products and templates moving from experiments into real products'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary text-sm">
                      <CheckCircle size={15} className="text-accent-cyan flex-shrink-0 mt-0.5" /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-border-subtle/40 max-w-2xl">
                <span className="text-xs font-mono text-accent-purple tracking-[0.2em] uppercase mb-3 block">— Vision —</span>
                <h3 className="font-display text-2xl font-bold text-text-primary mb-3">Where I'm Headed</h3>
                <p className="text-text-secondary leading-relaxed text-sm">
                  The goal is to become a trusted builder for businesses that want automation without unnecessary complexity: clear scope, reliable engineering, and systems that continue working after launch.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group w-full max-w-[400px]">
                <div className="absolute -inset-5 bg-accent-blue/10 rounded-[2rem] blur-2xl opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative rounded-[1.5rem] overflow-hidden z-10 bg-white/5 shadow-[0_22px_60px_rgba(79,142,255,0.12)]">
                  <img 
                    src={currentAiSystemsImg}
                    alt="Enterprise AI automation infrastructure with connected agents and systems"
                    width="1672"
                    height="941"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-[1.025]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── JOURNEY SNAPSHOT ── */}
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-10">
            <div className="lg:col-span-6">
              <span className="text-xs font-mono text-accent-blue tracking-[0.2em] uppercase mb-3 block">— My Story —</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-3">The path from curious builder to product-focused engineer.</h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                A short version of the journey. The full timeline lives on the Journey page.
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_18px_55px_rgba(79,142,255,0.10)]">
                <img
                  src={engineeringGrowthPathImg}
                  alt="Engineering growth path from fundamentals to SaaS and AI automation"
                  width="1672"
                  height="941"
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-border-subtle/80 bg-bg-card/80">
            <div className="hidden md:block absolute left-0 right-0 top-[88px] h-px bg-border-subtle" />
            <div className="grid grid-cols-1 md:grid-cols-6">
              {JOURNEY_MILESTONES.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="relative border-b border-border-subtle p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
                >
                  <span className="text-xs font-mono text-accent-blue font-bold tracking-widest">{item.year}</span>
                  <span className="my-4 hidden h-3 w-3 rounded-full border-2 border-accent-blue bg-bg-card md:block" />
                  <h3 className="text-sm font-display font-bold text-text-primary mb-2">{item.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <Link to="/journey" className="inline-flex items-center gap-2 text-sm font-medium text-accent-blue hover:underline focus:outline-none focus:ring-2 focus:ring-accent-blue/25 rounded">
              View Complete Journey <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* ── ACHIEVEMENTS ── */}
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4">
              <span className="text-xs font-mono text-accent-purple tracking-[0.2em] uppercase mb-3 block">— Credibility —</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">Proof that the work goes beyond tutorials.</h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                The signal is simple: shipped products, national-level competitions, and a technical foundation strong enough to own full systems.
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-3 divide-x divide-border-subtle rounded-3xl bg-bg-card/80 shadow-[0_18px_50px_rgba(15,23,42,0.06)] mb-7">
                {CREDIBILITY_STATS.map((stat) => (
                  <div key={stat.label} className="p-5 text-center">
                    <div className="font-display text-3xl font-bold text-text-primary">{stat.value}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-wider text-text-muted">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {ACHIEVEMENTS.map((ach) => (
                  <div key={ach.title} className="flex gap-4 border-b border-border-subtle pb-4 last:border-b-0 last:pb-0">
                    <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue">
                      {ach.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-display font-bold text-text-primary mb-1">{ach.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">{ach.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE ME ── */}
        <section className="mb-24 overflow-hidden rounded-[2rem] bg-bg-secondary p-7 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-mono text-accent-cyan tracking-[0.2em] uppercase mb-3 block">— Working Principles —</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">Why teams trust me with messy, real-world builds.</h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                I care about the product outcome as much as the implementation. The best systems are clear, maintainable, and useful after the first launch.
              </p>
              <div className="mt-7 overflow-hidden rounded-[1.5rem] bg-white shadow-[0_18px_50px_rgba(79,142,255,0.10)]">
                <img
                  src={engineeringPrinciplesImg}
                  alt="Minimal software engineering principles and architecture illustration"
                  width="1672"
                  height="941"
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 divide-y divide-border-subtle">
              {whyChooseList.map((item, i) => (
                <div key={i} className="grid grid-cols-[44px_1fr] gap-4 py-5 first:pt-0 last:pb-0">
                  <div className="font-mono text-xs text-accent-blue pt-1">{String(i + 1).padStart(2, '0')}</div>
                  <div>
                    <h3 className="font-display font-bold text-text-primary mb-1">{item.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONVERSION CTA ── */}
        <section className="relative overflow-hidden rounded-[2rem] bg-bg-card p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:p-12">
          <div className="absolute inset-0 opacity-20">
            <img
              src={buildTogetherImg}
              alt=""
              width="1672"
              height="941"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
              aria-hidden="true"
            />
          </div>
          <div className="relative">
            <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-blue/10 text-accent-blue">
              <Sparkles size={20} />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-3">
              Ready to build something useful together?
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-text-secondary leading-relaxed">
              Bring the workflow, product idea, or operational bottleneck. I will help turn it into a clear, buildable system.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/hire"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-blue px-6 py-3 text-sm font-semibold text-white shadow-glow-blue transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
              >
                Hire Me <ArrowRight size={15} />
              </Link>
              <a
                href={aboutData?.followUrl || 'https://linkedin.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-subtle bg-bg-card/80 px-6 py-3 text-sm font-semibold text-text-secondary transition-all hover:border-accent-purple hover:text-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple/30"
              >
                Schedule a Call <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </section>

      </div>
    </motion.div>
  );
};

export default About;
