import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  Briefcase,
  Clock,
  Filter,
  Globe,
  Layers,
  MessageCircle,
  Phone,
  Search,
  Sparkles,
  Star,
  Workflow,
  Zap,
} from 'lucide-react';
import useApi from '../hooks/useApi';
import SEO from '../seo/components/SEO';
import seoConfig from '../seo/config/seoConfig';

const PAGE_SIZE = 9;

const renderIcon = (iconName, size = 24) => {
  const icons = {
    Bot: <Bot size={size} />,
    Workflow: <Workflow size={size} />,
    MessageCircle: <MessageCircle size={size} />,
    Layers: <Layers size={size} />,
    Globe: <Globe size={size} />,
    Briefcase: <Briefcase size={size} />,
    Zap: <Zap size={size} />,
  };
  return icons[iconName] || <Zap size={size} />;
};

const getDescription = (service) => service.shortDescription || service.excerpt || service.overview;
const getPrice = (service) => service.pricingText || service.pricing || 'Custom scope';

const ServiceCard = ({ service, featured = false }) => (
  <motion.article
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className={`group overflow-hidden rounded-[2rem] border border-border-subtle bg-bg-card/90 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent-blue/35 hover:shadow-[0_30px_100px_rgba(79,142,255,0.15)] ${featured ? 'lg:grid lg:grid-cols-[1fr_1.05fr]' : ''}`}
  >
    <div className={`relative overflow-hidden border-b border-border-subtle bg-bg-elevated ${featured ? 'min-h-80 lg:border-b-0 lg:border-r' : 'h-56'}`}>
      {service.coverImage ? (
        <img src={service.coverImage} alt={service.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-blue/10 via-accent-purple/8 to-accent-cyan/10 text-accent-blue">
          {renderIcon(service.icon, 54)}
        </div>
      )}
      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
        {service.featured && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-purple/25 bg-accent-purple/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-accent-purple backdrop-blur">
            <Star size={11} /> Featured
          </span>
        )}
        <span className="rounded-full border border-accent-blue/25 bg-accent-blue/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-accent-blue backdrop-blur">
          {service.category || 'Service'}
        </span>
      </div>
    </div>
    <div className="flex h-full flex-col p-6 md:p-7">
      <div className="mb-5 flex items-center gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${service.bg || 'bg-accent-blue/10'} ${service.color || 'text-accent-blue'}`}>
          {renderIcon(service.icon)}
        </div>
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted">{service.pricingModel || 'Project based'}</p>
          <p className="text-sm font-bold text-accent-blue">{getPrice(service)}</p>
        </div>
      </div>
      <Link to={`/services/${service.slug || service._id}`} className="font-display text-2xl font-bold leading-tight text-text-primary transition-colors group-hover:text-accent-blue">
        {service.title}
      </Link>
      <p className="mt-4 line-clamp-3 flex-1 text-[15px] leading-7 text-text-secondary">{getDescription(service)}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {(service.technologyStack || []).slice(0, 4).map((tech) => (
          <span key={tech} className="rounded-full border border-border-subtle bg-bg-elevated/70 px-3 py-1 text-[10px] font-mono text-text-muted">{tech}</span>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 border-y border-border-subtle py-4 text-xs text-text-muted">
        <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {service.estimatedDelivery || `${service.readingTime || 1} min read`}</span>
        <span>{service.views || 0} views</span>
      </div>
      <Link to={`/services/${service.slug || service._id}`} className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-accent-blue px-5 py-3 text-sm font-bold text-white shadow-glow-blue transition-all hover:-translate-y-0.5 hover:bg-blue-500">
        Explore Service <ArrowRight size={15} />
      </Link>
    </div>
  </motion.article>
);

const Services = () => {
  const { data: services = [], loading, error } = useApi('/api/services?sort=order');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('order');
  const [page, setPage] = useState(1);

  const categories = useMemo(() => ['All', ...Array.from(new Set((services || []).map((item) => item.category).filter(Boolean)))], [services]);

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = (services || []).filter((item) => {
      const matchesCategory = category === 'All' || item.category === category;
      const haystack = [
        item.title,
        item.shortDescription,
        item.excerpt,
        item.overview,
        item.category,
        ...(item.technologyStack || []),
      ].join(' ').toLowerCase();
      return matchesCategory && (!query || haystack.includes(query));
    });

    return [...list].sort((a, b) => {
      if (sort === 'popular') return (b.views || 0) - (a.views || 0);
      if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === 'title') return a.title.localeCompare(b.title);
      return (a.displayOrder || 0) - (b.displayOrder || 0);
    });
  }, [services, search, category, sort]);

  const featuredServices = useMemo(() => filteredServices.filter((item) => item.featured).slice(0, 2), [filteredServices]);
  const totalPages = Math.max(1, Math.ceil(filteredServices.length / PAGE_SIZE));
  const paginatedServices = filteredServices.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilter = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const seoMeta = {
    title: 'AI Automation & SaaS Development Services | Ashish Kumar',
    description: 'Explore production-ready AI automation, SaaS, n8n, WhatsApp automation, and full-stack development services by Ashish Kumar.',
    canonical: `${seoConfig.site.baseUrl}/services`,
    path: '/services',
    breadcrumbItems: [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
    ],
  };

  return (
    <>
      <SEO page="services" meta={seoMeta} />
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }} className="relative min-h-screen overflow-hidden pb-28 pt-14">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-gradient-to-b from-accent-blue/8 via-accent-purple/5 to-transparent pointer-events-none" />
        <div className="container relative">
          <section className="mb-10 rounded-[2.25rem] border border-border-subtle bg-bg-card/80 p-8 shadow-[0_30px_100px_rgba(79,142,255,0.10)] backdrop-blur md:p-12">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent-blue/25 bg-accent-blue/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.22em] text-accent-blue">
              <Sparkles size={14} /> Services
            </span>
            <h1 className="max-w-4xl font-display text-4xl font-bold leading-tight text-text-primary md:text-6xl">
              Production services for AI, automation, and SaaS execution.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-text-secondary">
              Database-driven service offerings with clear scope, workflow, deliverables, pricing guidance, and implementation detail.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#services-library" className="inline-flex items-center gap-2 rounded-2xl bg-accent-blue px-6 py-3.5 text-sm font-bold text-white shadow-glow-blue transition-all hover:-translate-y-0.5 hover:bg-blue-500">
                Browse Services <ArrowRight size={16} />
              </a>
              <Link to="/hire" className="inline-flex items-center gap-2 rounded-2xl border border-border-subtle bg-bg-primary/70 px-6 py-3.5 text-sm font-bold text-text-secondary transition-all hover:-translate-y-0.5 hover:border-accent-blue/35 hover:text-text-primary">
                <Phone size={16} /> Hire Me
              </Link>
            </div>
          </section>

          <section className="mb-8 rounded-[2rem] border border-border-subtle bg-bg-card/80 p-4 shadow-card backdrop-blur">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
              <label className="relative">
                <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input value={search} onChange={(e) => handleFilter(setSearch, e.target.value)} placeholder="Search AI, SaaS, n8n, automation..." className="h-12 w-full rounded-2xl border border-border-subtle bg-bg-primary pl-11 pr-4 text-sm text-text-primary outline-none transition-all focus:border-accent-blue" />
              </label>
              <select value={category} onChange={(e) => handleFilter(setCategory, e.target.value)} className="h-12 rounded-2xl border border-border-subtle bg-bg-primary px-4 text-sm text-text-secondary outline-none focus:border-accent-blue">
                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <label className="relative">
                <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <select value={sort} onChange={(e) => handleFilter(setSort, e.target.value)} className="h-12 w-full rounded-2xl border border-border-subtle bg-bg-primary pl-11 pr-4 text-sm text-text-secondary outline-none focus:border-accent-blue">
                  <option value="order">Recommended</option>
                  <option value="popular">Popular</option>
                  <option value="newest">Newest</option>
                  <option value="title">A-Z</option>
                </select>
              </label>
            </div>
          </section>

          {loading ? (
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-[32rem] animate-pulse rounded-[2rem] bg-bg-card" />)}</div>
          ) : error ? (
            <div className="rounded-[2rem] border border-red-500/20 bg-red-500/5 p-14 text-center text-red-300">
              Unable to load services right now. Please try again shortly.
            </div>
          ) : (
            <>
              {featuredServices.length > 0 && (
                <section className="mb-14">
                  <p className="mb-5 text-xs font-mono uppercase tracking-[0.22em] text-accent-blue">Featured Services</p>
                  <div className="grid gap-7">{featuredServices.map((service) => <ServiceCard key={service._id} service={service} featured />)}</div>
                </section>
              )}

              <section id="services-library" className="scroll-mt-24">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="font-display text-3xl font-bold text-text-primary">All Services</h2>
                    <p className="text-sm text-text-muted">{filteredServices.length} service{filteredServices.length === 1 ? '' : 's'} found</p>
                  </div>
                </div>

                {paginatedServices.length > 0 ? (
                  <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
                    {paginatedServices.map((service) => <ServiceCard key={service._id} service={service} />)}
                  </div>
                ) : (
                  <div className="rounded-[2rem] border border-border-subtle bg-bg-card/70 p-14 text-center text-text-muted">
                    No services found. Try another search or filter.
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
                      <button key={item} onClick={() => setPage(item)} className={`h-10 w-10 rounded-xl text-sm font-bold ${page === item ? 'bg-accent-blue text-white' : 'border border-border-subtle bg-bg-card text-text-secondary'}`}>{item}</button>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          <section className="mt-16 rounded-[2rem] border border-accent-blue/20 bg-gradient-to-br from-accent-blue/12 via-bg-card to-accent-purple/10 p-8 text-center md:p-12">
            <h2 className="font-display text-3xl font-bold text-text-primary">Need a custom implementation?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-text-secondary">Tell me the business outcome. I’ll map the workflow, stack, timeline, and delivery plan.</p>
            <Link to="/hire" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-accent-blue px-6 py-3 font-bold text-white shadow-glow-blue transition-all hover:-translate-y-1">
              Book a Discovery Call <ArrowRight size={16} />
            </Link>
          </section>
        </div>
      </motion.div>
    </>
  );
};

export default Services;
