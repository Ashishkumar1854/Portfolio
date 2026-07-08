import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Clock, Lock, Search, Sparkles, X } from 'lucide-react';
import useApi from '../hooks/useApi';
import useModuleSettings from '../hooks/useModuleSettings';

const PAGE_SIZE = 6;
const CATEGORIES = ['All', 'SaaS', 'AI Automation', 'WhatsApp Automation', 'n8n', 'Full Stack', 'Other'];

const getImage = (item) => item?.coverImage || item?.imageUrl || '';
const getExcerpt = (item) => item?.excerpt || item?.subtitle || item?.overview || '';
const casePath = (item) => `/case-studies/${item.slug || item._id}`;

const CaseCard = ({ item, featured = false, locked = false }) => {
  const content = (
    <div className={`group relative block overflow-hidden rounded-[1.5rem] border border-border-subtle bg-bg-card shadow-card transition-all duration-300 ${locked ? 'cursor-not-allowed' : 'hover:-translate-y-1 hover:border-accent-blue/35 hover:shadow-[0_24px_80px_rgba(59,130,246,0.14)]'} ${featured ? 'lg:grid lg:grid-cols-[1.08fr_0.92fr]' : ''}`}>
      {locked && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-bg-primary/35 backdrop-blur-[2px]">
          <div className="rounded-2xl border border-border-subtle bg-bg-card/95 px-5 py-4 text-center shadow-xl">
            <Lock size={22} className="mx-auto mb-2 text-accent-blue" />
            <p className="text-sm font-bold text-text-primary">Case Study Locked</p>
            <p className="text-xs text-text-muted">Disabled from admin controller</p>
          </div>
        </div>
      )}
    <div className={`relative overflow-hidden bg-bg-elevated ${locked ? 'blur-[1px] grayscale' : ''} ${featured ? 'min-h-[18rem]' : 'h-56'}`}>
      {getImage(item) ? (
        <img src={getImage(item)} alt={item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-blue/10 via-bg-elevated to-accent-purple/10">
          <BarChart3 size={44} className="text-text-muted/30" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/70 via-transparent to-transparent opacity-80" />
      {item.featured && <span className="absolute left-4 top-4 rounded-full bg-accent-blue px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">Featured</span>}
    </div>
    <div className={`flex h-full flex-col p-6 md:p-7 ${locked ? 'blur-[1px] grayscale' : ''}`}>
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-mono text-text-muted">
        {(item.industry || item.category) && <span className="rounded-full border border-border-subtle bg-bg-elevated px-3 py-1">{item.industry || item.category}</span>}
        {item.projectDuration && <span>{item.projectDuration}</span>}
        <span className="inline-flex items-center gap-1"><Clock size={12} /> {item.readingTime || 1} min</span>
      </div>
      <h2 className={`${featured ? 'text-3xl' : 'text-xl'} font-display font-bold leading-tight text-text-primary`}>{item.title}</h2>
      {getExcerpt(item) && <p className="mt-4 line-clamp-3 leading-7 text-text-secondary">{getExcerpt(item)}</p>}
      {item.metrics?.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-3">
          {item.metrics.slice(0, 2).map((metric, index) => (
            <div key={index} className="rounded-xl border border-border-subtle bg-bg-elevated p-3">
              <p className="text-lg font-bold text-accent-blue">{metric.value}</p>
              <p className="text-xs text-text-muted">{metric.label}</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-5 flex flex-wrap gap-2">
        {(item.techStack || []).slice(0, 4).map((tech) => (
          <span key={tech} className="rounded-full border border-border-subtle bg-bg-elevated px-3 py-1 text-[11px] font-mono text-text-muted">{tech}</span>
        ))}
      </div>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-accent-blue">{locked ? 'Locked' : 'Read case study'} {locked ? <Lock size={15} /> : <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />}</span>
    </div>
    </div>
  );

  if (locked) return content;
  return <Link to={casePath(item)}>{content}</Link>;
};

const CaseStudies = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTech, setActiveTech] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const { settings } = useModuleSettings();

  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (activeCategory !== 'All') params.set('industry', activeCategory);
    if (activeTech !== 'All') params.set('technology', activeTech);
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    const query = params.toString();
    return query ? `/api/case-studies?${query}` : '/api/case-studies';
  }, [activeCategory, activeTech, searchQuery]);

  const { data: caseStudies = [], loading } = useApi(apiUrl);

  const technologyOptions = useMemo(() => ['All', ...Array.from(new Set((caseStudies || []).flatMap((item) => item.techStack || [])))], [caseStudies]);
  const featured = (caseStudies || []).find((item) => item.featured);
  const latest = (caseStudies || []).filter((item) => item._id !== featured?._id);
  const totalPages = Math.max(1, Math.ceil(latest.length / PAGE_SIZE));
  const paginated = latest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const lockedCaseStudyIds = useMemo(() => new Set((settings.lockedCaseStudyIds || []).map(String)), [settings.lockedCaseStudyIds]);
  const isCaseStudyLocked = (item) => lockedCaseStudyIds.has(String(item._id));

  const setFilter = (setter, value) => {
    setter(value);
    setPage(1);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }} className="relative min-h-screen overflow-hidden pb-28 pt-14">
      <div className="absolute inset-x-0 top-0 h-[30rem] bg-gradient-to-b from-accent-blue/8 via-accent-purple/5 to-transparent pointer-events-none" />
      <div className="container relative max-w-7xl">
        <section className="mb-10 rounded-[2rem] border border-border-subtle bg-bg-card/80 p-8 shadow-[0_30px_100px_rgba(59,130,246,0.10)] backdrop-blur md:p-12">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent-blue/25 bg-accent-blue/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.22em] text-accent-blue"><Sparkles size={14} /> Case Studies</span>
          <h1 className="max-w-4xl font-display text-4xl font-bold leading-tight text-text-primary md:text-6xl">Proof-backed software, automation, and SaaS execution.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-text-secondary">Detailed client and product case studies showing the problem, implementation, metrics, and business outcome.</p>
        </section>

        <section className="mb-8 rounded-2xl border border-border-subtle bg-bg-card p-4">
          <label className="relative block">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input value={searchQuery} onChange={(event) => setFilter(setSearchQuery, event.target.value)} placeholder="Search case studies, industries, technologies..." className="w-full rounded-xl border border-border-subtle bg-bg-primary py-3 pl-11 pr-10 text-sm text-text-primary outline-none transition-all focus:border-accent-blue/60" />
            {searchQuery && <button onClick={() => setFilter(setSearchQuery, '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"><X size={15} /></button>}
          </label>
        </section>

        <div className="mb-10 space-y-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button key={category} onClick={() => setFilter(setActiveCategory, category)} className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${activeCategory === category ? 'bg-accent-blue text-white shadow-glow-blue' : 'border border-border-subtle bg-bg-card text-text-secondary hover:border-border-active'}`}>{category}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {technologyOptions.slice(0, 14).map((tech) => (
              <button key={tech} onClick={() => setFilter(setActiveTech, tech)} className={`rounded-full px-3 py-1.5 text-xs font-mono transition-all ${activeTech === tech ? 'bg-accent-purple text-white' : 'border border-border-subtle bg-bg-card text-text-muted hover:text-text-primary'}`}>{tech}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">{[1, 2, 3, 4].map((item) => <div key={item} className="h-96 animate-pulse rounded-2xl bg-bg-card" />)}</div>
        ) : caseStudies.length ? (
          <>
            {featured && (
              <section className="mb-12">
                <p className="mb-4 text-xs font-mono uppercase tracking-[0.22em] text-accent-blue">Featured Case Study</p>
                <CaseCard item={featured} featured locked={isCaseStudyLocked(featured)} />
              </section>
            )}

            <section>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-text-primary">Latest Case Studies</h2>
                <p className="text-sm text-text-muted">{caseStudies.length} result{caseStudies.length === 1 ? '' : 's'}</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {paginated.map((item) => <CaseCard key={item._id} item={item} locked={isCaseStudyLocked(item)} />)}
              </div>
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
                    <button key={item} onClick={() => setPage(item)} className={`h-10 w-10 rounded-xl text-sm font-bold ${page === item ? 'bg-accent-blue text-white' : 'border border-border-subtle bg-bg-card text-text-secondary'}`}>{item}</button>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          <div className="rounded-2xl border border-border-subtle bg-bg-card p-12 text-center">
            <p className="font-display text-2xl font-bold text-text-primary">No case studies found</p>
            <p className="mt-2 text-text-secondary">Published case studies will appear here.</p>
          </div>
        )}

        <section className="mt-16 rounded-[2rem] border border-accent-blue/20 bg-gradient-to-br from-accent-blue/12 via-bg-card to-accent-purple/10 p-8 text-center md:p-12">
          <h2 className="font-display text-3xl font-bold text-text-primary">Want a similar outcome?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-text-secondary">Let’s turn your bottleneck into a measurable software or automation win.</p>
          <Link to="/hire" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-accent-blue px-6 py-3 font-bold text-white shadow-glow-blue transition-all hover:-translate-y-1">Book a Discovery Call <ArrowRight size={16} /></Link>
        </section>
      </div>
    </motion.div>
  );
};

export default CaseStudies;
