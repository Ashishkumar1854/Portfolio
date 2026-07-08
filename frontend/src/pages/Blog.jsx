import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar, Clock, Search, Tag, X } from 'lucide-react';
import useApi from '../hooks/useApi';

const CATEGORIES = ['All', 'AI Automation', 'AI Agents', 'n8n', 'SaaS', 'Development', 'System Design', 'Startup Journey'];
const PAGE_SIZE = 6;

const formatDate = (dateString) =>
  dateString ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Draft';

const getImage = (blog) => blog.coverImage || blog.imageUrl || blog.ogImage || '';
const getExcerpt = (blog) => blog.excerpt || blog.subtitle || '';
const getHref = (blog) => `/blog/${blog.slug || blog._id}`;

const BlogCard = ({ blog, featured = false }) => (
  <Link
    to={getHref(blog)}
    className={`group block overflow-hidden rounded-[1.75rem] border border-border-subtle bg-bg-card/90 shadow-[0_18px_60px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-accent-purple/35 hover:shadow-[0_28px_90px_rgba(139,92,246,0.16)] ${featured ? 'md:grid md:grid-cols-[1.1fr_0.9fr]' : ''}`}
  >
    <div className={`relative overflow-hidden bg-gradient-to-br from-accent-purple/10 to-accent-blue/10 ${featured ? 'min-h-72' : 'h-56'}`}>
      {getImage(blog) ? (
        <img src={getImage(blog)} alt={blog.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <BookOpen size={42} className="text-text-muted/30" />
        </div>
      )}
      {blog.featured && (
        <span className="absolute left-4 top-4 rounded-full border border-accent-purple/30 bg-accent-purple/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent-purple backdrop-blur">
          Featured
        </span>
      )}
    </div>
    <div className="flex h-full flex-col p-6 md:p-8">
      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-mono text-text-muted">
        {blog.category && <span className="rounded-full border border-border-subtle bg-bg-primary px-3 py-1">{blog.category}</span>}
        <span className="flex items-center gap-1"><Calendar size={12} /> Published {formatDate(blog.publishedAt || blog.createdAt)}</span>
        {blog.updatedAt && <span>Updated {formatDate(blog.updatedAt)}</span>}
        <span className="flex items-center gap-1"><Clock size={12} /> {blog.readingTime || 1} min</span>
      </div>
      <h3 className={`${featured ? 'text-3xl' : 'text-xl'} mb-3 font-display font-bold leading-tight text-text-primary transition-colors group-hover:text-accent-purple`}>
        {blog.title}
      </h3>
      <p className="line-clamp-3 flex-grow text-sm leading-7 text-text-secondary">{getExcerpt(blog)}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {(blog.tags || []).slice(0, 3).map((item) => (
          <span key={item} className="inline-flex items-center gap-1 rounded-full bg-bg-elevated px-3 py-1 text-[11px] font-mono text-text-muted">
            <Tag size={10} /> {item}
          </span>
        ))}
      </div>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-accent-purple">
        Read Article <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
      </span>
    </div>
  </Link>
);

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTag, setActiveTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (activeCategory !== 'All') params.set('category', activeCategory);
    if (activeTag !== 'All') params.set('tag', activeTag);
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    const query = params.toString();
    return query ? `/api/blogs?${query}` : '/api/blogs';
  }, [activeCategory, activeTag, searchQuery]);

  const { data: blogs = [], loading } = useApi(apiUrl);

  const tags = useMemo(() => ['All', ...Array.from(new Set((blogs || []).flatMap((blog) => blog.tags || [])))], [blogs]);

  const featured = (blogs || []).filter((blog) => blog.featured);
  const latest = (blogs || []).filter((blog) => !blog.featured);
  const totalPages = Math.max(1, Math.ceil(latest.length / PAGE_SIZE));
  const paginated = latest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const setFilter = (setter, value) => {
    setter(value);
    setPage(1);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }} className="relative min-h-screen overflow-hidden pb-28 pt-14">
      <div className="absolute inset-x-0 top-0 h-[30rem] bg-gradient-to-b from-accent-purple/7 via-accent-blue/5 to-transparent pointer-events-none" />
      <div className="container relative max-w-7xl">
        <section className="mb-10 rounded-[2rem] border border-border-subtle bg-bg-card/80 p-8 shadow-[0_30px_100px_rgba(139,92,246,0.10)] backdrop-blur md:p-12">
          <span className="mb-5 inline-flex rounded-full border border-accent-purple/25 bg-accent-purple/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.22em] text-accent-purple">Technical Writing</span>
          <h1 className="max-w-4xl font-display text-4xl font-bold leading-tight text-text-primary md:text-6xl">Practical AI, SaaS, and full-stack engineering notes.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-text-secondary">Deep technical articles for hiring teams, founders, developers, and clients evaluating production software thinking.</p>
        </section>

        <section className="mb-8 rounded-2xl border border-border-subtle bg-bg-card p-4">
          <label className="relative block">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input value={searchQuery} onChange={(e) => setFilter(setSearchQuery, e.target.value)} placeholder="Search articles, topics, tags..." className="w-full rounded-xl border border-border-subtle bg-bg-primary py-3 pl-11 pr-10 text-sm text-text-primary outline-none transition-all focus:border-accent-purple/60" />
            {searchQuery && <button onClick={() => setFilter(setSearchQuery, '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"><X size={15} /></button>}
          </label>
        </section>

        <div className="mb-10 space-y-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button key={category} onClick={() => setFilter(setActiveCategory, category)} className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${activeCategory === category ? 'bg-accent-purple text-white shadow-glow-purple' : 'border border-border-subtle bg-bg-card text-text-secondary hover:border-border-active'}`}>{category}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 12).map((tag) => (
              <button key={tag} onClick={() => setFilter(setActiveTag, tag)} className={`rounded-full px-3 py-1.5 text-xs font-mono transition-all ${activeTag === tag ? 'bg-accent-blue text-white' : 'border border-border-subtle bg-bg-card text-text-muted hover:text-text-primary'}`}>#{tag}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-96 animate-pulse rounded-[1.75rem] bg-bg-card" />)}</div>
        ) : blogs.length > 0 ? (
          <>
            {featured.length > 0 && (
              <section className="mb-14">
                <h2 className="mb-5 font-display text-2xl font-bold text-text-primary">Featured Posts</h2>
                <div className="grid gap-8">{featured.slice(0, 2).map((blog) => <BlogCard key={blog._id} blog={blog} featured />)}</div>
              </section>
            )}
            <section>
              <h2 className="mb-5 font-display text-2xl font-bold text-text-primary">Latest Posts</h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">{paginated.map((blog) => <BlogCard key={blog._id} blog={blog} />)}</div>
              {totalPages > 1 && (
                <div className="mt-10 flex justify-center gap-2">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button key={index} onClick={() => setPage(index + 1)} className={`h-10 w-10 rounded-full text-sm font-bold ${page === index + 1 ? 'bg-accent-purple text-white' : 'border border-border-subtle bg-bg-card text-text-secondary'}`}>{index + 1}</button>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          <div className="rounded-2xl border border-border-subtle bg-bg-card/70 py-20 text-center text-text-muted">No articles found.</div>
        )}
      </div>
    </motion.div>
  );
};

export default Blog;
