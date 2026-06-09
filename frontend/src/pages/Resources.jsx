import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Download, Eye, Lock, FileText, ArrowRight, Workflow, Bot, MessageSquare, Terminal, Database, CheckSquare, LogIn } from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading';
import AnimatedCard from '../components/ui/AnimatedCard';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const CATEGORIES = [
  'All',
  'AI Agent Templates',
  'n8n Workflows',
  'Prompt Libraries',
  'Docker Guides',
  'Deployment Checklists',
  'PostgreSQL Schemas',
  'Architecture Templates',
  'Business Automation Blueprints'
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const getResourceIcon = (category) => {
  const icons = {
    'AI Agent Templates': <Bot size={24} />,
    'n8n Workflows': <Workflow size={24} />,
    'Prompt Libraries': <MessageSquare size={24} />,
    'Docker Guides': <Terminal size={24} />,
    'Deployment Checklists': <CheckSquare size={24} />,
    'PostgreSQL Schemas': <Database size={24} />,
    'Architecture Templates': <FileText size={24} />,
    'Business Automation Blueprints': <FileText size={24} />,
  };
  return icons[category] || <FileText size={24} />;
};

const getCategoryColor = (category) => {
  const colors = {
    'AI Agent Templates': 'text-accent-purple bg-accent-purple/10 border-accent-purple/20',
    'n8n Workflows': 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20',
    'Prompt Libraries': 'text-green-400 bg-green-400/10 border-green-400/20',
    'Docker Guides': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    'Deployment Checklists': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    'PostgreSQL Schemas': 'text-accent-blue bg-accent-blue/10 border-accent-blue/20',
    'Architecture Templates': 'text-pink-400 bg-pink-400/10 border-pink-400/20',
    'Business Automation Blueprints': 'text-accent-green bg-accent-green/10 border-accent-green/20',
  };
  return colors[category] || 'text-text-secondary bg-bg-elevated border-border-subtle';
};

const Resources = () => {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResources = async () => {
    setLoading(true);
    try {
      let url = '/api/resources';
      const params = [];
      if (selectedCategory !== 'All') params.push(`category=${encodeURIComponent(selectedCategory)}`);
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const { data } = await api.get(url);
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [selectedCategory, search]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="pb-24 pt-12 min-h-screen"
    >
      <div className="container">
        <SectionHeading
          eyebrow="Free & Premium Templates"
          heading="Automation & Development Resources"
          subtext="Ready-to-import n8n workflows, Docker templates, prompting libraries, and system database schemas."
        />

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 justify-between items-center bg-bg-card/40 border border-border-subtle p-4 rounded-2xl backdrop-blur-sm">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-3 flex items-center text-text-muted">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-bg-primary border border-border-subtle hover:border-border-active focus:border-accent-blue rounded-xl py-2 pl-10 pr-4 text-sm text-text-primary outline-none transition-all"
            />
          </div>

          {/* Categories Grid or Scroll */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
            {CATEGORIES.slice(0, 4).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-accent-blue text-white shadow-glow-blue'
                    : 'bg-bg-primary border border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-active'
                }`}
              >
                {cat}
              </button>
            ))}
            {CATEGORIES.length > 4 && (
              <select
                value={CATEGORIES.slice(4).includes(selectedCategory) ? selectedCategory : ''}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-bg-primary border border-border-subtle text-text-secondary text-xs px-3 py-1.5 rounded-full hover:border-border-active outline-none cursor-pointer"
              >
                <option value="">More Categories...</option>
                {CATEGORIES.slice(4).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Login nudge banner — only when not logged in */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between gap-4 bg-accent-blue/5 border border-accent-blue/20 rounded-2xl px-5 py-3.5 mb-8 text-sm"
          >
            <div className="flex items-center gap-2.5 text-text-secondary">
              <Lock size={15} className="text-accent-blue flex-shrink-0" />
              <span>Free account required to download resources — takes 30 seconds.</span>
            </div>
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-accent-blue hover:bg-blue-500 px-4 py-2 rounded-xl transition-all shadow-glow-blue whitespace-nowrap"
            >
              <LogIn size={13} /> Login Free
            </Link>
          </motion.div>
        )}

        {/* Resource cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 bg-bg-card border border-border-subtle animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : resources.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {resources.map((res) => {
              const theme = getCategoryColor(res.category);
              const colorClass = theme.split(' ')[0];
              const bgClass = theme.split(' ')[1];

              return (
                <motion.div key={res._id} variants={itemVariants}>
                  <AnimatedCard className="p-7 flex flex-col h-full hover:border-accent-blue/30 transition-all duration-300 relative group overflow-hidden">
                    <div className="flex items-start justify-between mb-5">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bgClass} ${colorClass}`}>
                        {getResourceIcon(res.category)}
                      </div>
                      {res.isPremium ? (
                        <span className="px-3 py-1 bg-accent-amber/10 border border-accent-amber/20 text-[10px] font-bold text-accent-amber rounded-full tracking-wider uppercase flex items-center gap-1 shadow-sm">
                          <Lock size={10} /> Premium
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-accent-green/10 border border-accent-green/20 text-[10px] font-bold text-accent-green rounded-full tracking-wider uppercase">
                          Free
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-display font-bold text-text-primary mb-3 group-hover:text-accent-blue transition-colors duration-200">
                      {res.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-5 flex-grow line-clamp-3">
                      {res.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-text-muted font-mono mb-6 border-t border-border-subtle pt-4">
                      <span className="flex items-center gap-1.5">
                        <Download size={13} /> {res.downloads} downloads
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Eye size={13} /> {res.views} views
                      </span>
                    </div>

                    <Link
                      to={`/resources/${res.slug}`}
                      className="inline-flex items-center justify-center gap-2 text-xs font-semibold bg-bg-elevated hover:bg-accent-blue hover:text-white border border-border-subtle hover:border-accent-blue px-4 py-3 rounded-xl transition-all shadow-sm"
                    >
                      View Template Details <ArrowRight size={13} />
                    </Link>
                  </AnimatedCard>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center py-16 bg-bg-card/20 border border-border-subtle rounded-3xl text-text-muted">
            No templates found. Check back later!
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-20 bg-bg-card border border-border-subtle rounded-3xl p-12 md:p-16 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-6">
            Need a custom solution?
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-xl mx-auto">
            These templates are a start — but every business has different needs. Let's design a custom n8n workflow or AI agent tailored to your workflow.
          </p>
          <Link
            to="/hire"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-blue hover:bg-blue-500 text-white rounded-xl font-bold text-base transition-all shadow-glow-blue hover:scale-[1.02] active:scale-[0.98]"
          >
            Book a Discovery Call <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Resources;
