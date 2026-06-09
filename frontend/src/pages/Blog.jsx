import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowRight, BookOpen, Search, X } from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading';
import AnimatedCard from '../components/ui/AnimatedCard';
import useApi from '../hooks/useApi';

const CATEGORIES = ['All', 'AI Automation', 'AI Agents', 'n8n', 'SaaS', 'Development', 'System Design', 'Startup Journey'];

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const readingTime = (html = '') => {
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const Blog = () => {
  const { data: blogs, loading } = useApi('/api/blogs');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    if (!blogs) return [];
    let result = activeCategory === 'All' ? blogs : blogs.filter(b => b.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.subtitle?.toLowerCase().includes(q) ||
        b.category?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [blogs, activeCategory, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="pb-24 pt-12 min-h-screen"
    >
      <div className="container max-w-6xl">
        <SectionHeading
          eyebrow="Writing"
          heading="Blog & Insights"
          subtext="Deep dives on AI Automation, n8n, SaaS, and building software that actually matters."
        />

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-8">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, topic or category..."
            className="w-full pl-11 pr-10 py-3 bg-bg-card border border-border-subtle rounded-2xl text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent-blue/60 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-14">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-accent-blue text-white shadow-glow-blue'
                  : 'bg-bg-card border border-border-subtle text-text-secondary hover:border-border-active'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search result info */}
        {searchQuery && (
          <p className="text-center text-xs text-text-muted mb-8">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-bg-card animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <motion.div
            key={activeCategory + searchQuery}
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filtered.map((blog) => (
              <motion.div key={blog._id} variants={itemVariants}>
                <AnimatedCard className="flex flex-col group overflow-hidden h-full">
                  {/* Image */}
                  <div className="h-48 overflow-hidden relative bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 flex-shrink-0">
                    {blog.imageUrl ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-card/40 to-transparent z-10" />
                        <img
                          src={blog.imageUrl}
                          alt={blog.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={40} className="text-text-muted opacity-20" />
                      </div>
                    )}
                    {blog.category && (
                      <span className="absolute top-3 left-3 z-20 px-2 py-1 bg-bg-card/80 backdrop-blur-sm border border-border-subtle text-[10px] font-mono text-text-muted rounded-full">
                        {blog.category}
                      </span>
                    )}
                    {/* Like count badge */}
                    {blog.likes?.length > 0 && (
                      <span className="absolute top-3 right-3 z-20 px-2 py-1 bg-bg-card/80 backdrop-blur-sm border border-border-subtle text-[10px] font-mono text-accent-blue rounded-full">
                        ♥ {blog.likes.length}
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-xs font-mono text-text-muted mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {formatDate(blog.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {readingTime(blog.content)} min read
                      </span>
                    </div>

                    <h3 className="text-lg font-display font-bold text-text-primary mb-2 group-hover:text-accent-blue transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-text-secondary text-sm mb-5 flex-grow line-clamp-3 leading-relaxed">
                      {blog.subtitle}
                    </p>

                    <Link
                      to={`/blog/${blog._id}`}
                      className="flex items-center gap-2 text-sm font-medium text-accent-blue hover:underline mt-auto"
                    >
                      Read Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </AnimatedCard>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center text-text-muted py-20 bg-bg-card/50 rounded-2xl border border-border-subtle">
            {searchQuery
              ? `No articles found for "${searchQuery}". Try a different keyword.`
              : activeCategory === 'All'
              ? 'No articles published yet. Check back soon!'
              : `No posts in "${activeCategory}" yet.`}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Blog;
