import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Clock, Copy, ExternalLink, Eye, Lock, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import useApi from '../hooks/useApi';
import SEO from '../seo/components/SEO';
import seoConfig from '../seo/config/seoConfig';
import articleSchema from '../seo/schemas/articleSchema';
import faqSchema from '../seo/schemas/faqSchema';
import useModuleSettings from '../hooks/useModuleSettings';

const WHATSAPP_LINK = import.meta.env.VITE_COMMUNITY_WHATSAPP_LINK || '#';

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

const getImage = (item) => item?.coverImage || item?.imageUrl || item?.ogImage || '';
const getExcerpt = (item) => item?.excerpt || item?.subtitle || item?.overview || '';
const casePath = (item) => `/case-studies/${item.slug || item._id}`;

const RichBlock = ({ title, children, accent = false }) => {
  if (!children) return null;
  return (
    <section className="rounded-[1.5rem] border border-border-subtle bg-bg-card p-6 shadow-card md:p-8">
      <p className="mb-4 text-xs font-mono uppercase tracking-[0.22em] text-accent-blue">{title}</p>
      <div className={`${accent ? 'rounded-2xl border border-accent-blue/20 bg-accent-blue/5 p-5 text-text-primary' : 'text-text-secondary'} leading-8 whitespace-pre-wrap`}>{children}</div>
    </section>
  );
};

const CaseStudyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: cs, loading, error } = useApi(`/api/case-studies/${id}`);
  const { settings, loading: settingsLoading } = useModuleSettings();

  const seoMeta = useMemo(() => {
    if (!cs) return {};
    const path = casePath(cs);
    return {
      title: cs.seoTitle || `${cs.title} | Case Study`,
      description: cs.seoDescription || getExcerpt(cs) || seoConfig.defaults.description,
      keywords: [cs.focusKeyword, cs.industry, cs.category, ...(cs.techStack || [])].filter(Boolean),
      canonical: cs.canonicalUrl || `${seoConfig.site.baseUrl}${path}`,
      ogImage: cs.ogImage || getImage(cs) || seoConfig.branding.ogImage,
      index: !cs.noIndex,
      follow: true,
      ogType: 'article',
      publishedTime: cs.publishedAt || cs.createdAt,
      modifiedTime: cs.updatedAt,
      path,
      breadcrumbItems: [
        { name: 'Home', url: '/' },
        { name: 'Case Studies', url: '/case-studies' },
        { name: cs.title, url: path },
      ],
    };
  }, [cs]);

  if (loading || settingsLoading) {
    return <div className="container max-w-5xl py-24 space-y-6">{[1, 2, 3].map((item) => <div key={item} className="h-40 animate-pulse rounded-2xl bg-bg-card" />)}</div>;
  }

  if (error || !cs) {
    return (
      <div className="container py-24 text-center">
        <h2 className="mb-4 text-2xl font-bold text-text-primary">Case study not found</h2>
        <Link to="/case-studies" className="text-accent-blue hover:underline">Back to Case Studies</Link>
      </div>
    );
  }

  const caseStudyLocked = (settings.lockedCaseStudyIds || []).map(String).includes(String(cs._id));

  if (caseStudyLocked) {
    return (
      <div className="container py-24 text-center">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-border-subtle bg-bg-card p-10 shadow-xl">
          <Lock size={42} className="mx-auto mb-4 text-accent-blue" />
          <h2 className="mb-3 font-display text-3xl font-bold text-text-primary">Case study is locked</h2>
          <p className="mb-6 text-text-secondary">This case study is currently disabled from the admin controller.</p>
          <Link to="/case-studies" className="inline-flex items-center gap-2 rounded-2xl bg-accent-blue px-6 py-3 font-bold text-white shadow-glow-blue">
            Back to Case Studies
          </Link>
        </div>
      </div>
    );
  }

  const image = getImage(cs);
  const canonicalShareUrl = seoMeta.canonical || `${seoConfig.site.baseUrl}${casePath(cs)}`;
  const encodedShareUrl = encodeURIComponent(canonicalShareUrl);
  const encodedShareTitle = encodeURIComponent(cs.title);
  const gallery = cs.gallery?.length ? cs.gallery : (cs.screenshots || []).map((url) => ({ url, caption: '' }));
  const related = cs.relatedCaseStudies || [];

  const handleCopy = () => {
    navigator.clipboard.writeText(canonicalShareUrl)
      .then(() => toast.success('Link copied'))
      .catch(() => toast.error('Failed to copy link'));
  };

  return (
    <>
      <SEO page="caseStudies" meta={seoMeta} schemas={[articleSchema({
        ...cs,
        type: 'Article',
        description: seoMeta.description,
        image,
        ogImage: seoMeta.ogImage,
        keywords: seoMeta.keywords,
        url: seoMeta.canonical,
        path: casePath(cs),
      }), faqSchema(cs.faq)]} />
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }} className="relative overflow-hidden pb-28 pt-8">
        <div className="absolute inset-x-0 top-0 h-[30rem] bg-gradient-to-b from-accent-blue/8 via-accent-purple/5 to-transparent pointer-events-none" />
        <div className="container relative max-w-7xl">
          <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-sm font-medium text-text-muted transition-colors hover:text-text-primary">
            <ArrowLeft size={18} /> Back to Case Studies
          </button>

          <section className="mb-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-mono text-text-muted">
                {cs.featured && <span className="rounded-full bg-accent-blue px-3 py-1 font-bold uppercase tracking-widest text-white">Featured</span>}
                {(cs.industry || cs.category) && <span className="rounded-full border border-border-subtle bg-bg-card px-3 py-1">{cs.industry || cs.category}</span>}
                <span className="inline-flex items-center gap-1"><Calendar size={12} /> Published {formatDate(cs.publishedAt || cs.createdAt)}</span>
                <span>Updated {formatDate(cs.updatedAt)}</span>
                <span className="inline-flex items-center gap-1"><Clock size={12} /> {cs.readingTime || 1} min read</span>
                <span className="inline-flex items-center gap-1"><Eye size={12} /> {cs.views || 0}</span>
              </div>
              <h1 className="font-display text-4xl font-bold leading-tight text-text-primary md:text-6xl">{cs.title}</h1>
              {getExcerpt(cs) && <p className="mt-6 max-w-3xl text-lg leading-8 text-text-secondary">{getExcerpt(cs)}</p>}
            </div>

            <aside className="rounded-[1.5rem] border border-border-subtle bg-bg-card/85 p-5 shadow-xl backdrop-blur lg:sticky lg:top-28 lg:self-start">
              <p className="mb-4 text-xs font-mono uppercase tracking-widest text-accent-blue">Project Overview</p>
              <div className="space-y-4 text-sm">
                {cs.clientName && <div><p className="text-text-muted">Client</p><p className="font-semibold text-text-primary">{cs.clientName}</p></div>}
                {(cs.industry || cs.category) && <div><p className="text-text-muted">Industry</p><p className="font-semibold text-text-primary">{cs.industry || cs.category}</p></div>}
                {cs.projectDuration && <div><p className="text-text-muted">Duration</p><p className="font-semibold text-text-primary">{cs.projectDuration}</p></div>}
                {cs.completionDate && <div><p className="text-text-muted">Completed</p><p className="font-semibold text-text-primary">{formatDate(cs.completionDate)}</p></div>}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {(cs.techStack || []).slice(0, 8).map((tech) => <span key={tech} className="rounded-full border border-border-subtle bg-bg-elevated px-3 py-1 text-[11px] font-mono text-text-muted">{tech}</span>)}
              </div>
              <div className="mt-5 border-t border-border-subtle pt-5">
                <p className="mb-3 text-sm font-semibold text-text-primary">Share</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={handleCopy} className="inline-flex items-center gap-2 rounded-xl border border-border-subtle px-3 py-2 text-sm font-bold text-text-secondary hover:text-text-primary"><Copy size={14} /> Copy</button>
                  <a href={`https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodedShareTitle}`} target="_blank" rel="noreferrer" className="rounded-xl border border-border-subtle px-3 py-2 text-sm font-bold text-text-secondary hover:text-text-primary">Twitter</a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`} target="_blank" rel="noreferrer" className="rounded-xl border border-border-subtle px-3 py-2 text-sm font-bold text-text-secondary hover:text-text-primary">LinkedIn</a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`} target="_blank" rel="noreferrer" className="rounded-xl border border-border-subtle px-3 py-2 text-sm font-bold text-text-secondary hover:text-text-primary">Facebook</a>
                  <a href={`https://wa.me/?text=${encodedShareTitle}%20${encodedShareUrl}`} target="_blank" rel="noreferrer" className="rounded-xl border border-border-subtle px-3 py-2 text-sm font-bold text-text-secondary hover:text-text-primary">WhatsApp</a>
                </div>
              </div>
              {cs.tableOfContents?.length > 0 && (
                <nav className="mt-5 border-t border-border-subtle pt-5">
                  <p className="mb-3 text-sm font-semibold text-text-primary">On this page</p>
                  <div className="space-y-2">
                    {cs.tableOfContents.map((item, index) => (
                      <a key={index} href={`#${item.anchor}`} className="block text-sm text-text-secondary hover:text-accent-blue">{item.title}</a>
                    ))}
                  </div>
                </nav>
              )}
            </aside>
          </section>

          {image && (
            <div className="mb-12 overflow-hidden rounded-[2rem] border border-border-subtle bg-bg-card p-3 shadow-[0_30px_100px_rgba(15,23,42,0.14)]">
              <img src={image} alt={cs.title} className="max-h-[34rem] w-full rounded-[1.5rem] object-cover" />
            </div>
          )}

          {cs.metrics?.length > 0 && (
            <section className="mb-12 grid gap-4 md:grid-cols-3">
              {cs.metrics.map((metric, index) => (
                <div key={index} className="rounded-2xl border border-border-subtle bg-bg-card p-6 shadow-card">
                  <p className="font-display text-3xl font-bold text-accent-blue">{metric.value}</p>
                  <p className="mt-2 font-semibold text-text-primary">{metric.label}</p>
                  {metric.description && <p className="mt-2 text-sm leading-6 text-text-secondary">{metric.description}</p>}
                </div>
              ))}
            </section>
          )}

          {cs.content && (
            <article className="blog-content prose prose-invert prose-lg mb-12 max-w-none rounded-[2rem] border border-border-subtle bg-bg-card/80 p-6 shadow-xl md:p-10 prose-headings:font-display prose-headings:text-text-primary prose-p:leading-8 prose-p:text-text-secondary prose-a:text-accent-blue prose-strong:text-text-primary prose-code:text-accent-cyan prose-pre:rounded-2xl prose-blockquote:border-accent-blue prose-img:rounded-2xl" dangerouslySetInnerHTML={{ __html: cs.content }} />
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <RichBlock title="Overview">{cs.overview}</RichBlock>
            <RichBlock title="Challenge">{cs.challenge || cs.problem}</RichBlock>
            <RichBlock title="Solution">{cs.solution || cs.architecture}</RichBlock>
            <RichBlock title="Implementation">{cs.implementation}</RichBlock>
            <RichBlock title="Results" accent>{cs.results}</RichBlock>
            <RichBlock title="Conclusion">{cs.conclusion || cs.lessonsLearned}</RichBlock>
          </div>

          {gallery.length > 0 && (
            <section className="mt-14">
              <p className="mb-5 text-xs font-mono uppercase tracking-[0.22em] text-accent-blue">Project Gallery</p>
              <div className="grid gap-5 md:grid-cols-2">
                {gallery.map((item, index) => (
                  <a key={item.url || index} href={item.url} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-[1.5rem] border border-border-subtle bg-bg-card shadow-card transition-all hover:-translate-y-1 hover:border-accent-blue/40">
                    <div className="overflow-hidden bg-bg-elevated">
                      <img src={item.url} alt={item.caption || `${cs.title} screenshot ${index + 1}`} loading="lazy" className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                    </div>
                    {item.caption && <p className="p-5 leading-7 text-text-secondary">{item.caption}</p>}
                  </a>
                ))}
              </div>
            </section>
          )}

          {cs.testimonial?.quote && (
            <section className="mt-14 rounded-[2rem] border border-accent-purple/20 bg-accent-purple/10 p-8 md:p-10">
              <p className="font-display text-2xl font-bold leading-relaxed text-text-primary">“{cs.testimonial.quote}”</p>
              <div className="mt-6 flex items-center gap-4">
                {cs.testimonial.clientImage && <img src={cs.testimonial.clientImage} alt={cs.testimonial.clientName} className="h-14 w-14 rounded-full object-cover" />}
                <div>
                  <p className="font-bold text-text-primary">{cs.testimonial.clientName}</p>
                  <p className="text-sm text-text-secondary">{[cs.testimonial.designation, cs.testimonial.company].filter(Boolean).join(', ')}</p>
                </div>
              </div>
            </section>
          )}

          {cs.faq?.length > 0 && (
            <section className="mt-14">
              <h2 className="mb-5 font-display text-2xl font-bold text-text-primary">FAQ</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {cs.faq.map((item, index) => (
                  <div key={index} className="rounded-2xl border border-border-subtle bg-bg-card p-6">
                    <h3 className="font-bold text-text-primary">{item.question}</h3>
                    <p className="mt-2 leading-7 text-text-secondary">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section className="mt-14">
              <h2 className="mb-5 font-display text-2xl font-bold text-text-primary">Related Case Studies</h2>
              <div className="grid gap-5 md:grid-cols-3">
                {related.map((item) => (
                  <Link key={item._id} to={casePath(item)} className="rounded-2xl border border-border-subtle bg-bg-card p-5 transition-all hover:-translate-y-1 hover:border-accent-blue/40">
                    <h3 className="font-bold text-text-primary">{item.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-text-secondary">{getExcerpt(item)}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mt-14 rounded-[2rem] border border-accent-blue/20 bg-gradient-to-br from-accent-blue/12 via-bg-card to-accent-purple/10 p-8 text-center md:p-12">
            <h2 className="font-display text-3xl font-bold text-text-primary">Want a similar solution?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-text-secondary">I help teams turn business bottlenecks into measurable software and automation outcomes.</p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/hire" className="inline-flex items-center gap-2 rounded-2xl bg-accent-blue px-6 py-3 font-bold text-white shadow-glow-blue transition-all hover:-translate-y-1">Book a Discovery Call <ArrowRight size={16} /></Link>
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-border-subtle bg-bg-card px-6 py-3 font-bold text-text-secondary transition-all hover:text-text-primary"><MessageCircle size={16} /> Discuss on WhatsApp <ExternalLink size={14} /></a>
            </div>
          </section>
        </div>
      </motion.div>
    </>
  );
};

export default CaseStudyDetail;
