import React, { useState } from 'react';
import { Bot, Workflow, Layers, Globe, Brain, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/ui/SectionHeading';
import SkillIcon from '../components/ui/SkillIcon';
import useApi from '../hooks/useApi';

/* ─── Expertise cards data ─── */
const EXPERTISE = [
  {
    label: 'AI Automation',
    stars: 4,
    icon: <Bot size={20} />,
    color: 'from-blue-500/20 to-blue-600/5',
    border: 'border-blue-500/20',
    iconBg: 'bg-blue-500/10 text-blue-400',
  },
  {
    label: 'n8n Workflows',
    stars: 5,
    icon: <Workflow size={20} />,
    color: 'from-orange-500/20 to-orange-600/5',
    border: 'border-orange-500/20',
    iconBg: 'bg-orange-500/10 text-orange-400',
  },
  {
    label: 'MERN Stack',
    stars: 4,
    icon: <Layers size={20} />,
    color: 'from-emerald-500/20 to-emerald-600/5',
    border: 'border-emerald-500/20',
    iconBg: 'bg-emerald-500/10 text-emerald-400',
  },
  {
    label: 'SaaS Development',
    stars: 4,
    icon: <Globe size={20} />,
    color: 'from-purple-500/20 to-purple-600/5',
    border: 'border-purple-500/20',
    iconBg: 'bg-purple-500/10 text-purple-400',
  },
  {
    label: 'RAG Systems',
    stars: 3,
    icon: <Brain size={20} />,
    color: 'from-pink-500/20 to-pink-600/5',
    border: 'border-pink-500/20',
    iconBg: 'bg-pink-500/10 text-pink-400',
  },
  {
    label: 'Agentic AI',
    stars: 3,
    icon: <Cpu size={20} />,
    color: 'from-cyan-500/20 to-cyan-600/5',
    border: 'border-cyan-500/20',
    iconBg: 'bg-cyan-500/10 text-cyan-400',
  },
];

/* ─── Summary highlight boxes ─── */
const HIGHLIGHTS = [
  {
    icon: <Workflow size={24} />,
    title: 'End-to-end Automation',
    desc: 'From trigger to action — I build workflows that run on their own so you never miss a step.',
  },
  {
    icon: <Bot size={24} />,
    title: 'AI-powered Agents',
    desc: 'Custom LLM agents with memory, tools, and RAG pipelines that actually solve real problems.',
  },
  {
    icon: <Layers size={24} />,
    title: 'Scalable SaaS Builds',
    desc: 'Full-stack MERN products with auth, billing, dashboards — shipped fast, built to scale.',
  },
];

/* ─── Star renderer ─── */
const Stars = ({ count, max = 5 }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: max }).map((_, i) => (
      <span
        key={i}
        className={`text-sm ${i < count ? 'text-yellow-400' : 'text-text-muted/25'}`}
      >
        ★
      </span>
    ))}
  </div>
);

const categories = [
  'Frontend', 'Backend', 'AI & Agentic AI',
  'Automation', 'Databases', 'DevOps & Cloud', 'Tools',
];

const Skills = () => {
  const { data: skills, loading } = useApi('/api/skills');
  const [activeTab, setActiveTab] = useState('Frontend');

  const filteredSkills = skills?.filter(s => s.category === activeTab) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="pb-24 pt-12 min-h-screen"
    >
      <div className="container max-w-5xl">
        <SectionHeading
          eyebrow="Capabilities"
          heading="Technical Skills"
          subtext="A comprehensive overview of my technical expertise, tools, and areas of specialisation."
        />

        {/* ── Highlight boxes ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          {HIGHLIGHTS.map((h, i) => (
            <div
              key={h.title}
              className="bg-bg-card/60 border border-border-subtle rounded-2xl p-5 flex gap-4 items-start hover:border-accent-blue/25 transition-all group overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-blue/10 text-accent-blue flex-shrink-0 mt-0.5 flex items-center justify-center group-hover:scale-110 transition-transform">
                {h.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary mb-1">{h.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{h.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Expertise star cards ── */}
        <div className="mb-14">
          <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-5 text-center">
            Core Expertise
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {EXPERTISE.map((e, i) => (
              <div
                key={e.label}
                className={`bg-bg-card border ${e.border} rounded-2xl p-4 flex flex-col items-center gap-3 text-center cursor-default transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-md transform-gpu will-change-transform`}
              >
                <div className={`w-10 h-10 rounded-xl ${e.iconBg} flex items-center justify-center`}>
                  {e.icon}
                </div>
                <p className="text-xs font-semibold text-text-primary leading-tight">{e.label}</p>
                <Stars count={e.stars} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Category filter tabs ── */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === cat
                  ? 'bg-accent-blue text-white shadow-glow-blue'
                  : 'bg-bg-card border border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-active'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Skills grid ── */}
        <div className="bg-bg-card/95 sm:bg-bg-card/50 md:backdrop-blur-sm border border-border-subtle rounded-3xl p-6 md:p-8 min-h-[300px]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 bg-bg-secondary animate-pulse rounded-xl" />
              ))}
            </div>
          ) : filteredSkills.length > 0 ? (
            <div key={activeTab} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSkills.map((skill, index) => (
                  <div
                    key={skill._id}
                    className="p-4 bg-bg-elevated border border-border-subtle rounded-2xl flex flex-col gap-3 hover:border-accent-blue/20 transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-bg-primary border border-border-subtle flex items-center justify-center">
                          <SkillIcon icon={skill.icon} />
                        </div>
                        <span className="font-semibold text-sm text-text-primary">{skill.name}</span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        skill.badge === 'Expert'
                          ? 'bg-accent-blue/10 border-accent-blue/30 text-accent-blue'
                          : skill.badge === 'Proficient'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : skill.badge === 'Learning'
                          ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                          : 'bg-bg-primary border-border-subtle text-text-muted'
                      }`}>
                        {skill.badge}
                      </span>
                    </div>

                    {/* Proficiency bar */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] text-text-muted font-mono">Proficiency</span>
                        <span className="text-[10px] text-text-muted font-mono">{skill.proficiency}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-bg-primary rounded-full overflow-hidden">
                        <div
                          style={{ width: `${skill.proficiency}%` }}
                          className="h-full bg-gradient-to-r from-accent-blue to-accent-purple rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] gap-3 text-text-muted">
              <span className="text-3xl opacity-30">🔧</span>
              <p className="text-sm">No skills added for <span className="text-text-secondary font-medium">{activeTab}</span> yet.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Skills;
