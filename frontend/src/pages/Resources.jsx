import React, { useContext, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  CheckSquare,
  Database,
  Download,
  Eye,
  FileText,
  Filter,
  Lock,
  MessageSquare,
  Search,
  SortDesc,
  Star,
  Terminal,
  Workflow,
  Zap,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import SEO from '../seo/components/SEO';
import seoConfig from '../seo/config/seoConfig';

const CATEGORIES = [
  'AI Agent Templates',
  'n8n Workflows',
  'Prompt Libraries',
  'Docker Guides',
  'Deployment Checklists',
  'PostgreSQL Schemas',
  'Architecture Templates',
  'Business Automation Blueprints',
];

const SORT_OPTIONS = [
  ['newest', 'Newest'],
  ['updated', 'Recently Updated'],
  ['popular', 'Most Popular'],
  ['downloads', 'Most Downloaded'],
  ['title', 'A-Z'],
];

const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const ACCESS = ['All', 'Free', 'Premium'];

const slugify = (value = '') =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const categoryFromSlug = (slug) => CATEGORIES.find((category) => slugify(category) === slug);

const getResourceIcon = (category, size = 22) => {
  const icons = {
    'AI Agent Templates': <Bot size={size} />,
    'n8n Workflows': <Workflow size={size} />,
    'Prompt Libraries': <MessageSquare size={size} />,
    'Docker Guides': <Terminal size={size} />,
    'Deployment Checklists': <CheckSquare size={size} />,
    'PostgreSQL Schemas': <Database size={size} />,
    'Architecture Templates': <FileText size={size} />,
    'Business Automation Blueprints': <FileText size={size} />,
  };
  return icons[category] || <FileText size={size} />;
};

const getCategoryColor = (category) => {
  const colors = {
    'AI Agent Templates': 'text-accent-purple bg-accent-purple/10 border-accent-purple/25',
    'n8n Workflows': 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/25',
    'Prompt Libraries': 'text-green-400 bg-green-400/10 border-green-400/25',
    'Docker Guides': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/25',
    'Deployment Checklists': 'text-orange-400 bg-orange-400/10 border-orange-400/25',
    'PostgreSQL Schemas': 'text-accent-blue bg-accent-blue/10 border-accent-blue/25',
    'Architecture Templates': 'text-pink-400 bg-pink-400/10 border-pink-400/25',
    'Business Automation Blueprints': 'text-accent-green bg-accent-green/10 border-accent-green/25',
  };
  return colors[category] || 'text-text-secondary bg-bg-elevated border-border-subtle';
};

const formatDate = (value) => {
  if (!value) return 'Recently';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
};

const getThumbnail = (resource) => resource.thumbnail || resource.ogImage || resource.seo?.ogImage || '';
const getDescription = (resource) => resource.excerpt || resource.description;

const ResourceCard = ({ resource, featured = false }) => {
  const theme = getCategoryColor(resource.category);
  const image = getThumbnail(resource);
  const tags = resource.tags?.length ? resource.tags.slice(0, featured ? 5 : 3) : [resource.resourceType || 'Template'];
  const includedPreview = resource.includedFiles?.slice(0, 3) || [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border-subtle bg-bg-card/90 shadow-[0_20px_70px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-accent-blue/35 hover:shadow-[0_30px_100px_rgba(79,142,255,0.16)] ${featured ? 'lg:grid lg:grid-cols-[1.05fr_1fr]' : ''}`}
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className={`relative overflow-hidden border-b border-border-subtle bg-bg-primary/70 ${featured ? 'min-h-72 lg:border-b-0 lg:border-r' : 'aspect-[2.14/1]'}`}>
        {image ? (
          <img
            src={image}
            alt={resource.title}
            loading="lazy"
            className="h-full w-full object-cover object-center scale-[0.985] transition-transform duration-300 group-hover:scale-100"
          />
        ) : (
          <div className={`flex h-full min-h-56 items-center justify-center ${theme}`}>
            {getResourceIcon(resource.category, 44)}
          </div>
        )}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur ${resource.isPremium ? 'border-accent-amber/25 bg-accent-amber/15 text-accent-amber' : 'border-accent-green/25 bg-accent-green/15 text-accent-green'}`}>
            {resource.isPremium ? <Lock size={11} /> : <Zap size={11} />}
            {resource.isPremium ? 'Premium' : 'Free'}
          </span>
          {resource.featured && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-purple/25 bg-accent-purple/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-accent-purple backdrop-blur">
              <Star size={11} /> Featured
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-mono ${theme}`}>
            {getResourceIcon(resource.category, 13)}
            {resource.category}
          </span>
          <span className="rounded-full border border-border-subtle bg-bg-primary/70 px-3 py-1.5 text-[11px] font-mono text-text-muted">
            {resource.difficulty || 'Beginner'}
          </span>
          <span className="rounded-full border border-border-subtle bg-bg-primary/70 px-3 py-1.5 text-[11px] font-mono text-text-muted">
            v{resource.version || '1.0.0'}
          </span>
        </div>

        <Link to={`/resources/${resource.slug}`} className="mb-3 block font-display text-2xl font-bold leading-tight text-text-primary transition-colors group-hover:text-accent-blue">
          {resource.title}
        </Link>
        <p className="mb-6 line-clamp-3 flex-1 text-[15px] leading-7 text-text-secondary">
          {getDescription(resource)}
        </p>

        <div className="mb-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full border border-border-subtle bg-bg-elevated/70 px-3 py-1 text-[10px] font-mono text-text-muted">
              {tag}
            </span>
          ))}
        </div>

        {includedPreview.length > 0 && (
          <div className="mb-5 rounded-2xl border border-border-subtle bg-bg-primary/45 p-3">
            <p className="mb-2 text-[10px] font-mono uppercase tracking-widest text-text-muted">Included</p>
            <div className="flex flex-wrap gap-2">
              {includedPreview.map((item) => (
                <span key={item} className="rounded-full bg-bg-elevated/80 px-2.5 py-1 text-[10px] text-text-secondary">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-5 grid grid-cols-2 gap-2 border-y border-border-subtle py-4 text-xs text-text-muted md:grid-cols-4">
          <span className="flex items-center gap-1.5"><Download size={13} /> {resource.downloads || 0}</span>
          <span className="flex items-center gap-1.5"><Eye size={13} /> {resource.views || 0}</span>
          <span>{formatDate(resource.updatedAtDisplay || resource.updatedAt)}</span>
          <span>{resource.setupTime || resource.resourceType || 'Template'}</span>
        </div>

        <Link
          to={`/resources/${resource.slug}`}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent-blue px-5 py-3 text-sm font-bold text-white shadow-glow-blue transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500"
        >
          View Resource <ArrowRight size={15} />
        </Link>
      </div>
    </motion.article>
  );
};

const Resources = () => {
  const { user } = useContext(AuthContext);
  const { categorySlug } = useParams();
  const routeCategory = categoryFromSlug(categorySlug);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(routeCategory || 'All');
  const [difficulty, setDifficulty] = useState('All');
  const [access, setAccess] = useState('All');
  const [sort, setSort] = useState('newest');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSelectedCategory(routeCategory || 'All');
  }, [routeCategory]);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== 'All') params.set('category', selectedCategory);
        if (search) params.set('search', search);
        if (difficulty !== 'All') params.set('difficulty', difficulty);
        if (access !== 'All') params.set('isPremium', access === 'Premium' ? 'true' : 'false');
        if (sort) params.set('sort', sort);
        const { data } = await api.get(`/api/resources${params.toString() ? `?${params.toString()}` : ''}`);
        setResources(data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [selectedCategory, search, difficulty, access, sort]);

  const featuredResources = useMemo(() => resources.filter((item) => item.featured).slice(0, 2), [resources]);
  const popularResources = useMemo(() => [...resources].sort((a, b) => (b.views + b.downloads) - (a.views + a.downloads)).slice(0, 3), [resources]);
  const recentResources = useMemo(() => [...resources].sort((a, b) => new Date(b.updatedAtDisplay || b.updatedAt) - new Date(a.updatedAtDisplay || a.updatedAt)).slice(0, 3), [resources]);

  const seoMeta = {
    title: routeCategory
      ? `${routeCategory} | Developer Resource Library`
      : 'Developer Resource Library | AI, n8n, Docker & SaaS Templates',
    description: routeCategory
      ? `Browse production-ready ${routeCategory.toLowerCase()} by Ashish Kumar with SEO-friendly documentation, setup guides, templates, checklists, and reusable developer assets.`
      : 'Browse production-ready AI agent templates, n8n workflows, prompt libraries, Docker guides, database schemas, deployment checklists, and automation blueprints.',
    canonical: `${seoConfig.site.baseUrl}${routeCategory ? `/resources/category/${slugify(routeCategory)}` : '/resources'}`,
    path: routeCategory ? `/resources/category/${slugify(routeCategory)}` : '/resources',
    keywords: [routeCategory, 'developer resources', 'n8n workflows', 'AI templates', 'SaaS templates', 'Docker guides'].filter(Boolean),
    breadcrumbItems: [
      { name: 'Home', url: '/' },
      { name: 'Resources', url: '/resources' },
      ...(routeCategory ? [{ name: routeCategory, url: `/resources/category/${slugify(routeCategory)}` }] : []),
    ],
  };

  return (
    <>
      <SEO page="resources" meta={seoMeta} />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35 }}
        className="relative min-h-screen overflow-hidden pb-28 pt-14"
      >
        <div className="absolute inset-x-0 top-0 h-[32rem] bg-gradient-to-b from-accent-blue/6 via-accent-purple/5 to-transparent pointer-events-none" />
        <div className="container relative">
          <section className="mb-10 rounded-[2.25rem] border border-border-subtle bg-bg-card/80 p-8 shadow-[0_30px_100px_rgba(79,142,255,0.10)] backdrop-blur md:p-12">
            <div className="max-w-4xl">
              <span className="mb-5 inline-flex rounded-full border border-accent-blue/25 bg-accent-blue/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.22em] text-accent-blue">
                Resource Library
              </span>
              <h1 className="mb-5 font-display text-4xl font-bold leading-tight text-text-primary md:text-6xl">
                Ship faster with production-ready developer resources.
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-text-secondary">
                A curated library of AI templates, n8n workflows, deployment guides, prompts, schemas, and automation blueprints built for real projects.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#resource-library" className="inline-flex items-center gap-2 rounded-2xl bg-accent-blue px-6 py-3.5 text-sm font-bold text-white shadow-glow-blue transition-all hover:-translate-y-0.5 hover:bg-blue-500">
                  Browse Resources <ArrowRight size={16} />
                </a>
                <Link to="/hire" className="inline-flex items-center gap-2 rounded-2xl border border-border-subtle bg-bg-primary/70 px-6 py-3.5 text-sm font-bold text-text-secondary transition-all hover:-translate-y-0.5 hover:border-accent-blue/35 hover:text-text-primary">
                  Hire Me
                </Link>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                ['Resources', resources.length],
                ['Downloads', resources.reduce((sum, item) => sum + (item.downloads || 0), 0)],
                ['Views', resources.reduce((sum, item) => sum + (item.views || 0), 0)],
                ['Categories', CATEGORIES.length],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-border-subtle bg-bg-primary/70 p-4 shadow-sm">
                  <p className="font-display text-2xl font-bold text-text-primary">{value.toLocaleString?.() || value}</p>
                  <p className="text-xs font-mono uppercase tracking-widest text-text-muted">{label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8 rounded-[2rem] border border-border-subtle bg-bg-card/80 p-4 shadow-card backdrop-blur">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
              <label className="relative">
                <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search templates, workflows, guides..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-border-subtle bg-bg-primary pl-11 pr-4 text-sm text-text-primary outline-none transition-all focus:border-accent-blue"
                />
              </label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="h-12 rounded-2xl border border-border-subtle bg-bg-primary px-4 text-sm text-text-secondary outline-none focus:border-accent-blue">
                {DIFFICULTIES.map((item) => <option key={item} value={item}>{item} difficulty</option>)}
              </select>
              <select value={access} onChange={(e) => setAccess(e.target.value)} className="h-12 rounded-2xl border border-border-subtle bg-bg-primary px-4 text-sm text-text-secondary outline-none focus:border-accent-blue">
                {ACCESS.map((item) => <option key={item} value={item}>{item} access</option>)}
              </select>
              <label className="relative">
                <SortDesc size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-12 w-full rounded-2xl border border-border-subtle bg-bg-primary pl-11 pr-4 text-sm text-text-secondary outline-none focus:border-accent-blue">
                  {SORT_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
            </div>
          </section>

          <nav className="mb-12 flex gap-2 overflow-x-auto pb-2">
            <button onClick={() => setSelectedCategory('All')} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all ${selectedCategory === 'All' ? 'border-accent-blue bg-accent-blue text-white shadow-glow-blue' : 'border-border-subtle bg-bg-card/80 text-text-secondary hover:border-border-active hover:text-text-primary'}`}>
              All Categories
            </button>
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                to={`/resources/category/${slugify(category)}`}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all ${selectedCategory === category ? 'border-accent-blue bg-accent-blue text-white shadow-glow-blue' : 'border-border-subtle bg-bg-card/80 text-text-secondary hover:border-border-active hover:text-text-primary'}`}
              >
                {category}
              </Link>
            ))}
          </nav>

          {!user && (
            <div className="mb-10 flex flex-col gap-3 rounded-3xl border border-accent-blue/20 bg-accent-blue/5 p-5 text-sm text-text-secondary md:flex-row md:items-center md:justify-between">
              <span className="flex items-center gap-2"><Lock size={16} className="text-accent-blue" /> Free account required to download resources and save bookmarks.</span>
              <Link to="/login" className="inline-flex items-center justify-center rounded-2xl bg-accent-blue px-5 py-3 text-xs font-bold text-white shadow-glow-blue">
                Login Free
              </Link>
            </div>
          )}

          {featuredResources.length > 0 && (
            <section className="mb-14">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-text-primary">Featured Resources</h2>
                <Filter size={18} className="text-text-muted" />
              </div>
              <div className="grid grid-cols-1 gap-7">
                {featuredResources.map((resource) => <ResourceCard key={resource._id} resource={resource} featured />)}
              </div>
            </section>
          )}

          <section id="resource-library" className="mb-14 scroll-mt-24">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-3xl font-bold text-text-primary">All Resources</h2>
                <p className="text-sm text-text-muted">{loading ? 'Loading library...' : `${resources.length} resource${resources.length === 1 ? '' : 's'} found`}</p>
              </div>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-[32rem] animate-pulse rounded-[2rem] border border-border-subtle bg-bg-card" />)}
              </div>
            ) : resources.length > 0 ? (
              <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
                {resources.map((resource) => <ResourceCard key={resource._id} resource={resource} />)}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-border-subtle bg-bg-card/70 p-14 text-center text-text-muted">
                No resources found. Try a different category, search, or filter.
              </div>
            )}
          </section>

          {(popularResources.length > 0 || recentResources.length > 0) && (
            <section className="grid grid-cols-1 gap-7 lg:grid-cols-2">
              {[
                ['Popular Resources', popularResources],
                ['Recently Updated', recentResources],
              ].map(([title, items]) => (
                <div key={title} className="rounded-[2rem] border border-border-subtle bg-bg-card/80 p-6 shadow-card">
                  <h2 className="mb-4 font-display text-xl font-bold text-text-primary">{title}</h2>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <Link key={item._id} to={`/resources/${item.slug}`} className="flex items-center gap-4 rounded-2xl border border-border-subtle bg-bg-primary/55 p-4 transition-all hover:border-accent-blue/35">
                        <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border ${getCategoryColor(item.category)}`}>
                          {getResourceIcon(item.category, 18)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold text-text-primary">{item.title}</span>
                          <span className="text-xs text-text-muted">{item.downloads || 0} downloads • {formatDate(item.updatedAtDisplay || item.updatedAt)}</span>
                        </span>
                        <ArrowRight size={15} className="text-text-muted" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Resources;
