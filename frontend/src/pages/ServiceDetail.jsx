import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle,
  Clock,
  Copy,
  Eye,
  Globe,
  Layers,
  MessageCircle,
  Share2,
  Workflow,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import useApi from '../hooks/useApi';
import SEO from '../seo/components/SEO';
import seoConfig from '../seo/config/seoConfig';
import serviceSchema from '../seo/schemas/serviceSchema';
import faqSchema from '../seo/schemas/faqSchema';

const renderIcon = (iconName, size = 22) => {
  const icons = {
    Bot: <Bot size={size} />,
    Workflow: <Workflow size={size} />,
    MessageCircle: <MessageCircle size={size} />,
    Layers: <Layers size={size} />,
    Globe: <Globe size={size} />,
    Zap: <Zap size={size} />,
  };
  return icons[iconName] || <Zap size={size} />;
};

const servicePath = (service) => `/services/${service.slug || service._id}`;
const getDescription = (service) => service.shortDescription || service.excerpt || service.overview;
const getPrice = (service) => service.pricingText || service.pricing || 'Custom quote';

const Section = ({ id, eyebrow, title, children }) => {
  if (!children || (Array.isArray(children) && children.length === 0)) return null;
  return (
    <section id={id} className="scroll-mt-28 rounded-[2rem] border border-border-subtle bg-bg-card/90 p-6 shadow-card md:p-8">
      {eyebrow && <p className="mb-3 text-xs font-mono uppercase tracking-[0.22em] text-accent-blue">{eyebrow}</p>}
      <h2 className="mb-5 font-display text-2xl font-bold text-text-primary">{title}</h2>
      {children}
    </section>
  );
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: service, loading, error } = useApi(`/api/services/${slug}`);

  const seoMeta = useMemo(() => {
    if (!service) return {};
    const path = servicePath(service);
    const canonical = service.canonical || `${seoConfig.site.baseUrl}${path}`;
    return {
      title: service.metaTitle || `${service.title} | Services by Ashish Kumar`,
      description: service.metaDescription || getDescription(service),
      keywords: [service.focusKeyword, service.category, ...(service.technologyStack || [])].filter(Boolean),
      canonical,
      ogImage: service.ogImage || service.coverImage,
      twitterImage: service.twitterImage || service.ogImage || service.coverImage,
      index: !service.noIndex,
      follow: true,
      path,
      type: 'service',
      breadcrumbItems: [
        { name: 'Home', url: '/' },
        { name: 'Services', url: '/services' },
        { name: service.title, url: path },
      ],
    };
  }, [service]);

  if (loading) {
    return <div className="container max-w-6xl py-24 space-y-6">{[1, 2, 3].map((item) => <div key={item} className="h-44 animate-pulse rounded-2xl bg-bg-card" />)}</div>;
  }

  if (error || !service) {
    return (
      <div className="container py-24 text-center">
        <h2 className="mb-4 text-2xl font-bold text-text-primary">Service not found</h2>
        <Link to="/services" className="text-accent-blue hover:underline">Back to Services</Link>
      </div>
    );
  }

  const shareUrl = seoMeta.canonical || `${seoConfig.site.baseUrl}${servicePath(service)}`;
  const encodedShareUrl = encodeURIComponent(shareUrl);
  const encodedShareTitle = encodeURIComponent(service.title);
  const generatedContentToc = (service.tableOfContents || []).map((item) => [item.anchor, item.title]);
  const tocItems = [
    service.overview && ['overview', 'Overview'],
    service.problem && ['problem', 'Problem'],
    service.solution && ['solution', 'Solution'],
    (service.workflow || service.workflowSteps?.length) && ['workflow', 'Workflow'],
    service.deliverables?.length && ['deliverables', 'Deliverables'],
    service.benefits?.length && ['benefits', 'Benefits'],
    service.features?.length && ['features', 'Features'],
    service.technologyStack?.length && ['technology', 'Tech Stack'],
    service.content && ['content', 'Implementation Notes'],
    ...generatedContentToc,
    service.gallery?.length && ['gallery', 'Gallery'],
    service.faq?.length && ['faq', 'FAQ'],
  ].filter(Boolean);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => toast.success('Link copied'))
      .catch(() => toast.error('Failed to copy link'));
  };

  return (
    <>
      <SEO page="services" meta={seoMeta} schemas={[serviceSchema({
        ...service,
        path: servicePath(service),
        description: seoMeta.description,
        offers: {
          '@type': 'Offer',
          priceCurrency: service.currency || 'INR',
          price: service.startingPrice || undefined,
          availability: 'https://schema.org/InStock',
        },
      }), faqSchema(service.faq)]} />
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }} className="relative overflow-hidden pb-28 pt-8">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-gradient-to-b from-accent-blue/8 via-accent-purple/5 to-transparent pointer-events-none" />
        <div className="container relative max-w-7xl">
          <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-sm font-medium text-text-muted transition-colors hover:text-text-primary">
            <ArrowLeft size={18} /> Back to Services
          </button>

          <section className="mb-10 grid gap-8 lg:grid-cols-[1fr_0.75fr]">
            <div className="rounded-[2.25rem] border border-border-subtle bg-bg-card/90 p-8 shadow-[0_30px_100px_rgba(79,142,255,0.12)] md:p-10">
              <div className="mb-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-accent-blue/25 bg-accent-blue/10 px-4 py-2 text-xs font-mono text-accent-blue">{service.category}</span>
                {service.featured && <span className="rounded-full border border-accent-purple/25 bg-accent-purple/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-accent-purple">Featured</span>}
                <span className="rounded-full border border-border-subtle bg-bg-primary/70 px-4 py-2 text-xs font-mono text-text-muted">{service.readingTime || 1} min read</span>
              </div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-blue/10 text-accent-blue">
                {renderIcon(service.icon, 28)}
              </div>
              <h1 className="mb-5 font-display text-4xl font-bold leading-tight text-text-primary md:text-6xl">{service.title}</h1>
              <p className="max-w-3xl text-lg leading-8 text-text-secondary">{getDescription(service)}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/hire" className="inline-flex items-center gap-2 rounded-2xl bg-accent-blue px-6 py-3 font-bold text-white shadow-glow-blue transition-all hover:-translate-y-1">
                  Start Project <ArrowRight size={16} />
                </Link>
                <button onClick={handleCopy} className="inline-flex items-center gap-2 rounded-2xl border border-border-subtle bg-bg-primary/70 px-6 py-3 font-bold text-text-secondary transition-all hover:border-accent-blue/35 hover:text-text-primary">
                  <Copy size={16} /> Copy Link
                </button>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-border-subtle bg-bg-primary/70 px-6 py-3 font-bold text-text-secondary transition-all hover:border-accent-blue/35 hover:text-text-primary">
                  LinkedIn
                </a>
                <a href={`https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodedShareTitle}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-border-subtle bg-bg-primary/70 px-6 py-3 font-bold text-text-secondary transition-all hover:border-accent-blue/35 hover:text-text-primary">
                  Twitter
                </a>
              </div>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-[2rem] border border-border-subtle bg-bg-card/90 p-6 shadow-card">
                <p className="text-xs font-mono uppercase tracking-widest text-text-muted">Engagement</p>
                <p className="mt-2 font-display text-2xl font-bold text-text-primary">{getPrice(service)}</p>
                <div className="mt-5 grid gap-3 text-sm text-text-secondary">
                  <span className="flex items-center gap-2"><Clock size={15} className="text-accent-blue" /> {service.estimatedDelivery || 'Timeline after discovery'}</span>
                  <span className="flex items-center gap-2"><Eye size={15} className="text-accent-blue" /> {service.views || 0} views</span>
                  <span className="flex items-center gap-2"><Share2 size={15} className="text-accent-blue" /> {service.pricingModel || 'Project based'}</span>
                </div>
                <Link to="/hire" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent-blue px-5 py-3 text-sm font-bold text-white shadow-glow-blue">
                  Request Proposal <ArrowRight size={15} />
                </Link>
              </div>
              {tocItems.length > 0 && (
                <nav className="rounded-[2rem] border border-border-subtle bg-bg-card/90 p-6 shadow-card">
                  <p className="mb-4 text-xs font-mono uppercase tracking-widest text-text-muted">On this page</p>
                  <div className="space-y-2">
                    {tocItems.map(([id, label]) => (
                      <a key={id} href={`#${id}`} className="block rounded-xl px-3 py-2 text-sm text-text-secondary transition-all hover:bg-bg-elevated hover:text-accent-blue">{label}</a>
                    ))}
                  </div>
                </nav>
              )}
            </aside>
          </section>

          {service.coverImage && (
            <div className="mb-10 overflow-hidden rounded-[2rem] border border-border-subtle bg-bg-card shadow-card">
              <img src={service.coverImage} alt={service.title} className="max-h-[34rem] w-full object-cover" />
            </div>
          )}

          <div className="grid gap-7 lg:grid-cols-[1fr_0.38fr]">
            <main className="space-y-7">
              <Section id="overview" eyebrow="Overview" title="What This Service Covers">
                <p className="text-lg leading-8 text-text-secondary">{service.overview || getDescription(service)}</p>
              </Section>

              {service.problem && (
                <Section id="problem" eyebrow="Context" title="Problem">
                  <div className="prose prose-invert max-w-none text-text-secondary" dangerouslySetInnerHTML={{ __html: service.problem }} />
                </Section>
              )}

              {service.solution && (
                <Section id="solution" eyebrow="Approach" title="Solution">
                  <div className="prose prose-invert max-w-none text-text-secondary" dangerouslySetInnerHTML={{ __html: service.solution }} />
                </Section>
              )}

              {(service.workflow || service.workflowSteps?.length > 0) && (
                <Section id="workflow" eyebrow="Execution" title="Workflow">
                  {service.workflow ? <div className="prose prose-invert max-w-none text-text-secondary" dangerouslySetInnerHTML={{ __html: service.workflow }} /> : null}
                  {service.workflowSteps?.length > 0 && (
                    <div className="mt-5 grid gap-4">
                      {service.workflowSteps.map((step, index) => (
                        <div key={`${step.title}-${index}`} className="rounded-2xl border border-border-subtle bg-bg-primary/55 p-5">
                          <p className="text-xs font-mono text-accent-blue">Step {step.step || index + 1}</p>
                          <h3 className="mt-1 font-display text-lg font-bold text-text-primary">{step.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-text-secondary">{step.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </Section>
              )}

              {service.deliverables?.length > 0 && (
                <Section id="deliverables" eyebrow="Output" title="Deliverables">
                  <div className="grid gap-3 md:grid-cols-2">
                    {(service.deliverables || []).map((item) => (
                      <div key={item} className="flex gap-3 rounded-2xl border border-border-subtle bg-bg-primary/55 p-4 text-sm text-text-secondary">
                        <CheckCircle size={17} className="mt-0.5 shrink-0 text-accent-green" /> {item}
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {service.benefits?.length > 0 && (
                <Section id="benefits" eyebrow="Impact" title="Benefits">
                  <div className="grid gap-3 md:grid-cols-2">
                    {(service.benefits || []).map((item) => (
                      <div key={item} className="rounded-2xl border border-border-subtle bg-bg-primary/55 p-4 text-sm leading-6 text-text-secondary">{item}</div>
                    ))}
                  </div>
                </Section>
              )}

              {service.features?.length > 0 && (
                <Section id="features" eyebrow="Capabilities" title="Features">
                  <div className="grid gap-4 md:grid-cols-2">
                    {(service.features || []).map((feature) => (
                      <div key={feature.title || feature.description} className="rounded-2xl border border-border-subtle bg-bg-primary/55 p-5">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue">{renderIcon(feature.icon, 18)}</div>
                        <h3 className="font-bold text-text-primary">{feature.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-text-secondary">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {[...(service.technologyStack || []), ...(service.integrations || []), ...(service.supportedPlatforms || [])].length > 0 && (
                <Section id="technology" eyebrow="Stack" title="Technology">
                  <div className="flex flex-wrap gap-2">
                    {[...(service.technologyStack || []), ...(service.integrations || []), ...(service.supportedPlatforms || [])].map((item) => (
                      <span key={item} className="rounded-full border border-border-subtle bg-bg-elevated/70 px-4 py-2 text-xs font-mono text-text-secondary">{item}</span>
                    ))}
                  </div>
                </Section>
              )}

              {service.content && (
                <Section id="content" eyebrow="Details" title="Implementation Notes">
                  <div className="prose prose-invert max-w-none text-text-secondary" dangerouslySetInnerHTML={{ __html: service.content }} />
                </Section>
              )}

              {service.gallery?.length > 0 && (
                <Section id="gallery" eyebrow="Preview" title="Gallery">
                  <div className="grid gap-5 md:grid-cols-2">
                    {(service.gallery || []).map((item) => (
                      <figure key={item.url} className="overflow-hidden rounded-2xl border border-border-subtle bg-bg-primary/55">
                        <img src={item.url} alt={item.alt || item.caption || service.title} className="h-72 w-full object-cover" />
                        {item.caption && <figcaption className="p-4 text-sm text-text-secondary">{item.caption}</figcaption>}
                      </figure>
                    ))}
                  </div>
                </Section>
              )}

              {service.faq?.length > 0 && (
                <Section id="faq" eyebrow="FAQ" title="Questions">
                  <div className="space-y-3">
                    {(service.faq || []).map((item) => (
                      <details key={item.question || item.q} className="rounded-2xl border border-border-subtle bg-bg-primary/55 p-5">
                        <summary className="cursor-pointer font-bold text-text-primary">{item.question || item.q}</summary>
                        <p className="mt-3 leading-7 text-text-secondary">{item.answer || item.a}</p>
                      </details>
                    ))}
                  </div>
                </Section>
              )}
            </main>

            <aside className="space-y-7">
              {(service.useCases?.length > 0 || service.whoItsFor?.length > 0 || service.whyChooseUs?.length > 0) && (
                <div className="rounded-[2rem] border border-border-subtle bg-bg-card/90 p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold text-text-primary">Fit & Use Cases</h2>
                  {[['Use Cases', service.useCases], ["Who It's For", service.whoItsFor], ['Why Choose Us', service.whyChooseUs]].map(([title, items]) => items?.length ? (
                    <div key={title} className="mt-5">
                      <p className="mb-2 text-xs font-mono uppercase tracking-widest text-text-muted">{title}</p>
                      <ul className="space-y-2 text-sm text-text-secondary">
                        {items.map((item) => <li key={item} className="flex gap-2"><CheckCircle size={14} className="mt-1 shrink-0 text-accent-blue" /> {item}</li>)}
                      </ul>
                    </div>
                  ) : null)}
                </div>
              )}

              {service.relatedCaseStudies?.length > 0 && (
                <div className="rounded-[2rem] border border-border-subtle bg-bg-card/90 p-6 shadow-card">
                  <h2 className="mb-4 font-display text-xl font-bold text-text-primary">Related Case Studies</h2>
                  <div className="space-y-3">
                    {service.relatedCaseStudies.map((item) => (
                      <Link key={item._id} to={`/case-studies/${item.slug || item._id}`} className="block rounded-2xl border border-border-subtle bg-bg-primary/55 p-4 transition-all hover:border-accent-blue/35">
                        <p className="font-bold text-text-primary">{item.title}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-text-muted">{item.excerpt || item.subtitle}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {service.relatedServices?.length > 0 && (
                <div className="rounded-[2rem] border border-border-subtle bg-bg-card/90 p-6 shadow-card">
                  <h2 className="mb-4 font-display text-xl font-bold text-text-primary">Related Services</h2>
                  <div className="space-y-3">
                    {service.relatedServices.map((item) => (
                      <Link key={item._id} to={`/services/${item.slug || item._id}`} className="block rounded-2xl border border-border-subtle bg-bg-primary/55 p-4 transition-all hover:border-accent-blue/35">
                        <p className="font-bold text-text-primary">{item.title}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-text-muted">{item.shortDescription || item.excerpt || item.overview}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ServiceDetail;
