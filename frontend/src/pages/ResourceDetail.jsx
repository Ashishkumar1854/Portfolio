import { useContext, useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle,
  Code2,
  Download,
  Eye,
  FileArchive,
  FileText,
  HelpCircle,
  Key,
  Layers,
  Lock,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Terminal,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import SEO from '../seo/components/SEO';
import seoConfig from '../seo/config/seoConfig';
import resourceSchema from '../seo/schemas/resourceSchema';
import faqSchema from '../seo/schemas/faqSchema';
import useModuleSettings from '../hooks/useModuleSettings';

const Section = ({ eyebrow, title, icon, children }) => {
  if (!children) return null;
  return (
    <section className="mb-12">
      <div className="mb-5 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.22em] text-accent-blue">
        {icon}
        <span>{eyebrow || title}</span>
      </div>
      {title && <h2 className="mb-5 font-display text-3xl font-bold text-text-primary">{title}</h2>}
      <div className="rounded-[2rem] border border-border-subtle bg-bg-card/90 p-7 shadow-[0_22px_70px_rgba(15,23,42,0.08)] md:p-9">
        {children}
      </div>
    </section>
  );
};

const textBlock = (value) => value ? <p className="whitespace-pre-line text-base leading-8 text-text-secondary">{value}</p> : null;
const formatDate = (value) => value ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value)) : 'Recently updated';
const getThumbnail = (resource) => resource?.thumbnail || resource?.ogImage || resource?.seo?.ogImage || '';
const getDescription = (resource) => resource?.excerpt || resource?.description || '';

const ResourceDetail = () => {
  const { slug } = useParams();
  const { user } = useContext(AuthContext);
  const { settings, loading: settingsLoading } = useModuleSettings();
  const navigate = useNavigate();

  const [resource, setResource] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchResource = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/api/resources/slug/${slug}`);
        if (!active) return;
        setResource(data);

        const list = await api.get(`/api/resources?category=${encodeURIComponent(data.category)}&sort=popular`);
        if (active) setRelated(list.data.filter((item) => item._id !== data._id).slice(0, 3));

        if (user) {
          const status = await api.get(`/api/bookmarks/check?itemType=Resource&itemId=${data._id}`);
          if (active) setBookmarked(status.data.bookmarked);
        }
      } catch (error) {
        console.error('Error fetching resource details:', error);
        toast.error('Failed to load resource details');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchResource();
    return () => {
      active = false;
    };
  }, [slug, user]);

  const seoMeta = useMemo(() => {
    if (!resource) return {};
    const robots = resource.seo?.robots || 'index, follow';
    const description = resource.seo?.metaDescription || getDescription(resource) || seoConfig.defaults.description;
    const image = resource.seo?.ogImage || resource.ogImage || resource.thumbnail || seoConfig.branding.ogImage;

    return {
      title: resource.seo?.metaTitle || `${resource.title} | Developer Resource`,
      description,
      keywords: [resource.seo?.focusKeyword, resource.category, resource.resourceType, ...(resource.tags || [])].filter(Boolean),
      canonical: resource.seo?.canonical || `${seoConfig.site.baseUrl}/resources/${resource.slug}`,
      ogImage: image,
      index: !robots.includes('noindex'),
      follow: !robots.includes('nofollow'),
      path: `/resources/${resource.slug}`,
      breadcrumbItems: [
        { name: 'Home', url: '/' },
        { name: 'Resources', url: '/resources' },
        { name: resource.title, url: `/resources/${resource.slug}` },
      ],
    };
  }, [resource]);

  const handleDownload = async () => {
    if (!user) {
      toast.error('Please login to download this resource');
      navigate('/login', { state: { from: `/resources/${slug}` } });
      return;
    }

    try {
      const { data } = await api.post(`/api/resources/${resource._id}/download`);
      setResource((prev) => ({ ...prev, downloads: prev.downloads + 1 }));
      toast.success('Download starting...');
      setTimeout(() => window.open(data.downloadUrl, '_blank'), 500);
    } catch {
      toast.error('Failed to process download link');
    }
  };

  const handleBookmarkToggle = async () => {
    if (!user) {
      toast.error('Please log in to bookmark resources');
      navigate('/login');
      return;
    }

    setBookmarkLoading(true);
    try {
      const { data } = await api.post('/api/bookmarks/toggle', {
        itemType: 'Resource',
        itemId: resource._id,
      });
      setBookmarked(data.bookmarked);
      toast.success(data.message);
    } catch {
      toast.error('Failed to toggle bookmark');
    } finally {
      setBookmarkLoading(false);
    }
  };

  if (loading || settingsLoading) {
    return (
      <div className="container max-w-6xl py-24">
        <div className="h-[28rem] animate-pulse rounded-[2rem] bg-bg-card" />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="container py-24 text-center">
        <h2 className="mb-4 text-2xl font-bold text-text-primary">Resource Not Found</h2>
        <Link to="/resources" className="text-accent-blue hover:underline">Back to Resources</Link>
      </div>
    );
  }

  const resourceLocked = (settings.lockedResourceIds || []).map(String).includes(String(resource._id));

  if (resourceLocked) {
    return (
      <div className="container py-24 text-center">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-border-subtle bg-bg-card p-10 shadow-xl">
          <Lock size={42} className="mx-auto mb-4 text-accent-blue" />
          <h2 className="mb-3 font-display text-3xl font-bold text-text-primary">Resource is locked</h2>
          <p className="mb-6 text-text-secondary">This resource is currently disabled from the admin controller.</p>
          <Link to="/resources" className="inline-flex items-center gap-2 rounded-2xl bg-accent-blue px-6 py-3 font-bold text-white shadow-glow-blue">
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  const image = getThumbnail(resource);
  const isLocked = !user;
  const features = resource.features || [];
  const includedFiles = resource.includedFiles || [];
  const requirements = resource.requirements || [];

  return (
    <>
      <SEO page="resources" meta={seoMeta} schemas={[resourceSchema(resource), faqSchema(resource.faq)]} />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35 }}
        className="relative min-h-screen overflow-hidden pb-28 pt-10"
      >
        <div className="absolute inset-x-0 top-0 h-[32rem] bg-gradient-to-b from-accent-blue/5 via-accent-purple/5 to-transparent pointer-events-none" />
        <div className="container relative max-w-7xl">
          <Link to="/resources" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">
            <ArrowLeft size={16} /> Back to Resources
          </Link>

          <section className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.75fr]">
            <div className="rounded-[2.25rem] border border-border-subtle bg-bg-card/90 p-8 shadow-[0_30px_100px_rgba(79,142,255,0.12)] md:p-10">
              <div className="mb-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-accent-blue/25 bg-accent-blue/10 px-4 py-2 text-xs font-mono text-accent-blue">{resource.category}</span>
                <span className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest ${resource.isPremium ? 'border-accent-amber/25 bg-accent-amber/15 text-accent-amber' : 'border-accent-green/25 bg-accent-green/15 text-accent-green'}`}>
                  {resource.isPremium ? 'Premium' : 'Free'}
                </span>
                <span className="rounded-full border border-border-subtle bg-bg-primary/70 px-4 py-2 text-xs font-mono text-text-muted">{resource.difficulty || 'Beginner'}</span>
              </div>
              <h1 className="mb-5 font-display text-4xl font-bold leading-tight text-text-primary md:text-6xl">{resource.title}</h1>
              <p className="mb-8 max-w-3xl text-lg leading-8 text-text-secondary">{getDescription(resource)}</p>
              <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  [<Download size={17} />, `${resource.downloads || 0}`, 'Downloads'],
                  [<Eye size={17} />, `${resource.views || 0}`, 'Views'],
                  [<FileArchive size={17} />, `v${resource.version || '1.0.0'}`, 'Version'],
                  [<ShieldCheck size={17} />, formatDate(resource.updatedAtDisplay || resource.updatedAt), 'Updated'],
                ].map(([icon, value, label]) => (
                  <div key={label} className="rounded-2xl border border-border-subtle bg-bg-primary/60 p-4">
                    <div className="mb-2 text-accent-blue">{icon}</div>
                    <p className="font-semibold text-text-primary">{value}</p>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-[2.25rem] border border-border-subtle bg-bg-card/90 p-4 shadow-[0_30px_100px_rgba(15,23,42,0.10)] lg:sticky lg:top-28 lg:self-start">
              <div className="aspect-[2.14/1] overflow-hidden rounded-[1.75rem] border border-border-subtle bg-bg-primary">
                {image ? (
                  <img src={image} alt={resource.title} className="h-full w-full object-cover object-center scale-[0.985]" />
                ) : (
                  <div className="flex h-full items-center justify-center text-accent-blue">
                    <FileText size={54} />
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="mb-4 text-sm leading-6 text-text-secondary">
                  {isLocked ? 'Create a free account to unlock downloads, bookmarks, and premium resource access.' : 'You are signed in. Download and bookmark this resource for later use.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(resource.tags || []).slice(0, 8).map((tag) => (
                    <span key={tag} className="rounded-full border border-border-subtle bg-bg-elevated/70 px-3 py-1 text-[10px] font-mono text-text-muted">{tag}</span>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 border-y border-border-subtle py-4 text-xs text-text-muted">
                  <div>
                    <p className="font-semibold text-text-primary">v{resource.version || '1.0.0'}</p>
                    <p>Version</p>
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">{formatDate(resource.updatedAtDisplay || resource.updatedAt)}</p>
                    <p>Last Updated</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  <button onClick={handleDownload} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent-blue px-6 py-3.5 text-sm font-bold text-white shadow-glow-blue transition-all hover:-translate-y-0.5 hover:bg-blue-500">
                    {isLocked ? <Key size={16} /> : <Download size={16} />}
                    {isLocked ? 'Login to Download' : 'Download Resource'}
                  </button>
                  <button onClick={handleBookmarkToggle} disabled={bookmarkLoading} className={`flex w-full items-center justify-center gap-2 rounded-2xl border px-6 py-3.5 text-sm font-bold transition-all hover:-translate-y-0.5 ${bookmarked ? 'border-accent-blue bg-accent-blue/10 text-accent-blue' : 'border-border-subtle bg-bg-card/70 text-text-secondary hover:text-text-primary'}`}>
                    <Bookmark size={16} className={bookmarked ? 'fill-accent-blue' : ''} />
                    {bookmarked ? 'Saved' : 'Save Resource'}
                  </button>
                </div>
              </div>
            </aside>
          </section>

          <Section eyebrow="Overview" title="What this resource helps you do" icon={<Sparkles size={15} />}>
            {textBlock(resource.description)}
          </Section>

          {resource.excerpt && (
            <Section eyebrow="Preview" title="Resource Preview" icon={<PlayCircle size={15} />}>
              <div className="rounded-2xl border border-border-subtle bg-bg-primary/70 p-5 font-mono text-sm leading-7 text-text-secondary">
                {resource.excerpt}
              </div>
            </Section>
          )}

          {features.length > 0 && (
            <Section eyebrow="Features" title="Key Features" icon={<CheckCircle size={15} />}>
              <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {features.map((item) => (
                  <li key={item} className="flex gap-3 rounded-2xl border border-border-subtle bg-bg-primary/55 p-4 text-text-secondary">
                    <CheckCircle size={17} className="mt-1 flex-shrink-0 text-accent-blue" />
                    <span className="leading-7">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {includedFiles.length > 0 && (
              <Section eyebrow="Included Files" title="What is included" icon={<FileArchive size={15} />}>
                <ul className="space-y-3">
                  {includedFiles.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-text-secondary"><FileText size={16} className="text-accent-cyan" /> {item}</li>
                  ))}
                </ul>
              </Section>
            )}
            {requirements.length > 0 && (
              <Section eyebrow="Requirements" title="Before you start" icon={<ShieldCheck size={15} />}>
                <ul className="space-y-3">
                  {requirements.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-text-secondary"><CheckCircle size={16} className="text-accent-green" /> {item}</li>
                  ))}
                </ul>
              </Section>
            )}
          </div>

          {resource.installationGuide && (
            <Section eyebrow="Installation" title="Installation Guide" icon={<Terminal size={15} />}>
              {textBlock(resource.installationGuide)}
            </Section>
          )}

          {resource.usage && (
            <Section eyebrow="Usage" title="Usage Guide" icon={<Code2 size={15} />}>
              {textBlock(resource.usage)}
            </Section>
          )}

          {resource.screenshots?.length > 0 && (
            <section className="mb-12">
              <div className="mb-5 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.22em] text-accent-blue">
                <Layers size={15} /> Screenshots
              </div>
              <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
                {resource.screenshots.map((item, index) => (
                  <a key={item.image} href={item.image} target="_blank" rel="noreferrer" className={`${index === 0 ? 'lg:col-span-2' : ''} overflow-hidden rounded-[2rem] border border-border-subtle bg-bg-card/90 shadow-card transition-all hover:-translate-y-1 hover:border-accent-blue/35`}>
                    <div className="aspect-[2.14/1] overflow-hidden bg-bg-primary">
                      <img src={item.image} alt={item.alt || `${resource.title} screenshot ${index + 1}`} loading="lazy" className="h-full w-full object-cover object-center scale-[0.985]" />
                    </div>
                    {item.caption && <p className="border-t border-border-subtle px-6 py-5 text-text-secondary">{item.caption}</p>}
                  </a>
                ))}
              </div>
            </section>
          )}

          {resource.faq?.length > 0 && (
            <Section eyebrow="FAQ" title="Frequently Asked Questions" icon={<HelpCircle size={15} />}>
              <div className="space-y-4">
                {resource.faq.map((item) => (
                  <div key={item.question} className="rounded-2xl border border-border-subtle bg-bg-primary/55 p-5">
                    <h3 className="mb-2 font-semibold text-text-primary">{item.question}</h3>
                    <p className="leading-7 text-text-secondary">{item.answer}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {related.length > 0 && (
            <section className="mb-14">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-3xl font-bold text-text-primary">Related Resources</h2>
                <Link to="/resources" className="text-sm text-accent-blue hover:underline">View all</Link>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {related.map((item) => (
                  <Link key={item._id} to={`/resources/${item.slug}`} className="rounded-[2rem] border border-border-subtle bg-bg-card/90 p-5 shadow-card transition-all hover:-translate-y-1 hover:border-accent-blue/35">
                    <p className="mb-2 text-xs font-mono text-text-muted">{item.category}</p>
                    <h3 className="mb-2 font-display text-lg font-bold text-text-primary">{item.title}</h3>
                    <p className="line-clamp-2 text-sm leading-6 text-text-secondary">{item.excerpt || item.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="relative overflow-hidden rounded-[2.25rem] border border-border-subtle bg-bg-card/90 p-10 text-center shadow-[0_25px_80px_rgba(79,142,255,0.12)] md:p-16">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 via-transparent to-accent-purple/10" />
            <h2 className="relative mb-4 font-display text-3xl font-bold text-text-primary md:text-4xl">Need this customized for your business?</h2>
            <p className="relative mx-auto mb-8 max-w-2xl text-text-secondary">I can adapt this resource into a production workflow, AI agent, automation, or SaaS module for your exact use case.</p>
            <div className="relative flex flex-wrap justify-center gap-3">
              <Link to="/hire" className="inline-flex items-center gap-2 rounded-2xl bg-accent-blue px-8 py-4 font-bold text-white shadow-glow-blue transition-all hover:-translate-y-1 hover:bg-blue-500">
                Build a Custom Solution <ArrowRight size={17} />
              </Link>
              <Link to="/hire" className="inline-flex items-center gap-2 rounded-2xl border border-border-subtle bg-bg-primary/70 px-8 py-4 font-bold text-text-secondary transition-all hover:-translate-y-1 hover:border-accent-blue/35 hover:text-text-primary">
                Hire Me
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ResourceDetail;
