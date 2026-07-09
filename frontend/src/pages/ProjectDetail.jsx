import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle,
  ExternalLink,
  Layers,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import api from '../services/api';
import SEO from '../seo/components/SEO';
import seoConfig from '../seo/config/seoConfig';
import projectSchema from '../seo/schemas/projectSchema';

const Section = ({ title, icon, children, highlight = false }) => {
  if (!children) return null;

  return (
    <section className="mb-12 md:mb-14">
      <div className="flex items-center gap-2 text-xs font-mono text-accent-blue tracking-[0.22em] uppercase mb-5">
        {icon}
        <span>{title}</span>
      </div>
      <div className={`border rounded-[2rem] p-7 md:p-9 shadow-[0_22px_70px_rgba(15,23,42,0.08)] backdrop-blur transition-all duration-300 ease-out ${highlight ? 'bg-accent-blue/5 border-accent-blue/25 hover:border-accent-blue/45' : 'bg-bg-card/90 border-border-subtle hover:border-border-active'}`}>
        {children}
      </div>
    </section>
  );
};

const textBlock = (text, className = 'text-text-secondary') =>
  text ? <p className={`${className} text-[15px] md:text-base leading-8 whitespace-pre-wrap`}>{text}</p> : null;

const splitLines = (text = '') => text.split('\n').map((item) => item.trim()).filter(Boolean);
const pillClass = 'inline-flex items-center rounded-full border border-border-subtle bg-bg-elevated/80 px-4 py-2 text-xs font-mono text-text-muted shadow-sm';
const primaryButtonClass = 'inline-flex items-center justify-center gap-2 rounded-2xl bg-accent-blue px-6 py-3.5 text-white font-bold transition-all duration-300 ease-out shadow-glow-blue hover:-translate-y-1 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-accent-blue/40';
const secondaryButtonClass = 'inline-flex items-center justify-center gap-2 rounded-2xl border border-border-subtle bg-bg-card/80 px-6 py-3.5 text-text-secondary font-bold transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-bg-elevated hover:border-border-active hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30';

const TECH_GROUPS = [
  ['frontend', 'Frontend'],
  ['backend', 'Backend'],
  ['database', 'Database'],
  ['infrastructure', 'Infrastructure'],
  ['ai', 'AI'],
  ['devops', 'DevOps'],
  ['tools', 'Tools'],
];

const getProjectImage = (project) => project?.thumbnail || project?.imageUrl || project?.ogImage || '';
const getTechStack = (project) => project?.techStack?.length ? project.techStack : project?.tech || [];
const getTechGroups = (project) =>
  TECH_GROUPS.map(([key, label]) => ({
    key,
    label,
    items: project?.techStackGroups?.[key] || [],
  })).filter((group) => group.items.length > 0);
const getGalleryImage = (item) => typeof item === 'string' ? item : item?.image;
const getGalleryAlt = (item, project, index) =>
  typeof item === 'string' ? `${project.title} screenshot ${index + 1}` : item?.alt || `${project.title} screenshot ${index + 1}`;

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const fetchProject = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/api/projects/slug/${slug}`);
        if (!active) return;
        setProject(data);
      } catch (err) {
        if (!active) return;
        setError(err.response?.data?.message || 'Project not found');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProject();
    return () => {
      active = false;
    };
  }, [slug]);

  const seoMeta = useMemo(() => {
    if (!project) return {};
    const useCustomSeo = project.seo?.enabled !== false && project.seo?.custom;
    const description = (useCustomSeo && project.seo?.description) || project.shortDescription || project.overview || project.problem || seoConfig.defaults.description;
    const image = (useCustomSeo && project.seo?.ogImage) || project.ogImage || getProjectImage(project) || seoConfig.branding.ogImage;

    return {
      title: (useCustomSeo && project.seo?.title) || `${project.title} | ${project.projectType || 'Software Project'} by ${seoConfig.author.name}`,
      description,
      keywords: useCustomSeo && project.seo?.keywords?.length
        ? project.seo.keywords
        : [project.title, project.category, ...getTechStack(project), ...(project.tags || [])].filter(Boolean),
      canonical: (useCustomSeo && project.seo?.canonical) || `${seoConfig.site.baseUrl}/projects/${project.slug}`,
      ogImage: image,
      index: project.seo?.enabled !== false && !project.seo?.noIndex,
      follow: true,
      path: `/projects/${project.slug}`,
      breadcrumbItems: [
        { name: 'Home', url: '/' },
        { name: 'Projects', url: '/projects' },
        { name: project.title, url: `/projects/${project.slug}` },
      ],
    };
  }, [project]);

  if (loading) {
    return (
      <div className="container max-w-5xl py-24 space-y-8">
        <div className="h-80 bg-bg-card animate-pulse rounded-3xl" />
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-40 bg-bg-card animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-2xl font-display font-bold text-text-primary mb-4">Project not found</h1>
        <p className="text-text-secondary mb-8">{error || 'This project is unavailable.'}</p>
        <Link to="/projects" className="text-accent-blue hover:underline">Back to Projects</Link>
      </div>
    );
  }

  const image = getProjectImage(project);
  const techStack = getTechStack(project);
  const techGroups = getTechGroups(project);
  const related = project.relatedProjects || [];
  const outcome = project.outcome || project.results;

  return (
    <>
      <SEO page="projects" meta={seoMeta} schemas={[projectSchema(project)]} />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35 }}
        className="relative pb-28 pt-8 overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-[28rem] bg-gradient-to-b from-accent-blue/5 via-accent-purple/5 to-transparent pointer-events-none" />
        <div className="container relative max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors mb-8 md:mb-10 group focus:outline-none focus:ring-2 focus:ring-accent-blue/30 rounded-lg"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm font-medium">Back to Projects</span>
          </button>

          <section className="mb-16 md:mb-20">
            {image && (
              <div className="relative mb-12 rounded-[2.25rem] border border-border-subtle bg-bg-card/90 p-3 shadow-[0_30px_100px_rgba(15,23,42,0.16)] overflow-hidden group">
                <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                <div className="absolute -inset-10 bg-gradient-to-br from-accent-blue/10 via-transparent to-accent-purple/10 opacity-70 blur-3xl" />
                <div className="relative aspect-[2.14/1] overflow-hidden rounded-[1.8rem] border border-border-subtle bg-gradient-to-br from-bg-primary via-bg-elevated/40 to-bg-primary">
                  <img
                    src={image}
                    alt={project.title}
                    className="h-full w-full object-cover object-center scale-[0.985] transition-transform duration-300 ease-out group-hover:scale-100"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={pillClass}>
                {project.category}
              </span>
              {project.featured && (
                <span className="inline-flex items-center rounded-full border border-accent-purple/30 bg-accent-purple/20 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-accent-purple shadow-lg shadow-accent-purple/10">
                  Featured
                </span>
              )}
              {project.projectType && (
                <span className={pillClass}>
                  {project.projectType}
                </span>
              )}
              {project.clientType && (
                <span className={pillClass}>
                  {project.clientType}
                </span>
              )}
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-text-primary mb-6 leading-[1.02] max-w-6xl">
              {project.title}
            </h1>
            {(project.shortDescription || project.problem) && (
              <p className="text-xl md:text-2xl text-text-secondary leading-9 max-w-5xl">
                {project.shortDescription || project.problem}
              </p>
            )}

            <div className="flex flex-wrap gap-3.5 mt-9">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className={primaryButtonClass}>
                  <ExternalLink size={16} /> Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className={secondaryButtonClass}>
                  <FaGithub size={16} /> GitHub
                </a>
              )}
              {project.demoVideo && (
                <a href={project.demoVideo} target="_blank" rel="noreferrer" className={secondaryButtonClass}>
                  <PlayCircle size={16} /> Demo Video
                </a>
              )}
            </div>
          </section>

          {(techGroups.length > 0 || techStack.length > 0) && (
            <section className="mb-12 md:mb-14">
              <div className="flex items-center gap-2 text-xs font-mono text-accent-blue tracking-[0.22em] uppercase mb-5">
                <Layers size={14} />
                <span>Tech Stack</span>
              </div>
              {techGroups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {techGroups.map((group) => (
                    <div key={group.key} className="bg-bg-card/90 border border-border-subtle rounded-[2rem] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] hover:border-accent-blue/35 hover:-translate-y-1 transition-all duration-300 ease-out">
                      <h3 className="text-base font-display font-bold text-text-primary mb-4">{group.label}</h3>
                      <div className="flex flex-wrap gap-2.5">
                        {group.items.map((tech) => (
                          <span key={tech} className="px-3.5 py-1.5 bg-bg-elevated/80 border border-border-subtle rounded-full text-[11px] font-mono text-text-secondary shadow-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2.5 rounded-[2rem] border border-border-subtle bg-bg-card/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                  {techStack.map((tech) => (
                    <span key={tech} className="px-4 py-2 bg-bg-elevated/80 border border-border-subtle rounded-full text-xs font-mono text-text-secondary shadow-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </section>
          )}

          <Section title="Quick Overview" icon={<Briefcase size={14} />}>
            {textBlock(project.overview || project.shortDescription)}
          </Section>

          {project.features?.length > 0 && (
            <Section title="Key Features" icon={<CheckCircle size={14} />}>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3.5 text-text-secondary bg-bg-primary/60 border border-border-subtle rounded-3xl px-5 py-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-blue/30 hover:bg-bg-elevated/50">
                    <CheckCircle size={18} className="mt-0.5 flex-shrink-0 text-accent-blue" />
                    <span className="leading-7">{feature}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {project.gallery?.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-2 text-xs font-mono text-accent-blue tracking-[0.22em] uppercase mb-5">
                <Layers size={14} />
                <span>Project Gallery</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
                {project.gallery.map((item, index) => {
                  const galleryImage = getGalleryImage(item);
                  if (!galleryImage) return null;
                  return (
                    <a key={galleryImage} href={galleryImage} target="_blank" rel="noreferrer" className={`${index === 0 ? 'lg:col-span-2' : ''} rounded-[2rem] overflow-hidden border border-border-subtle group bg-bg-card/90 shadow-[0_22px_70px_rgba(15,23,42,0.10)] hover:border-accent-blue/35 hover:-translate-y-1 transition-all duration-300 ease-out`}>
                      <div className="aspect-[2.14/1] bg-gradient-to-br from-bg-primary via-bg-elevated/45 to-bg-primary">
                        <img src={galleryImage} alt={getGalleryAlt(item, project, index)} loading="lazy" className="w-full h-full object-cover object-center scale-[0.985] group-hover:scale-100 transition-transform duration-300 ease-out" />
                      </div>
                      {typeof item !== 'string' && item.caption && (
                        <p className="text-base text-text-secondary px-6 py-5 border-t border-border-subtle leading-7">{item.caption}</p>
                      )}
                    </a>
                  );
                })}
              </div>
            </section>
          )}

          <Section title="Architecture" icon={<Layers size={14} />}>
            {splitLines(project.architecture).length > 1 ? (
              <div className="space-y-4">
                {splitLines(project.architecture).map((line) => (
                  <div key={line} className="flex gap-4 rounded-2xl border border-border-subtle bg-bg-primary/50 px-5 py-4 text-text-secondary leading-7">
                    <Layers size={17} className="mt-1 flex-shrink-0 text-accent-blue" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            ) : textBlock(project.architecture)}
          </Section>

          <Section title="Technical Challenges" icon={<Sparkles size={14} />}>
            {splitLines(project.technicalChallenges).length > 0 ? (
              <div className="space-y-3">
                {splitLines(project.technicalChallenges).map((line) => (
                  <div key={line} className="flex items-start gap-4 rounded-2xl border border-border-subtle bg-bg-primary/55 px-5 py-4 text-text-secondary shadow-sm">
                    <CheckCircle size={17} className="mt-1 flex-shrink-0 text-accent-purple" />
                    <span className="leading-7">{line}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </Section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Section title="My Role" icon={<Briefcase size={14} />}>
              {textBlock(project.myRole)}
            </Section>
            <Section title="Outcome" icon={<Sparkles size={14} />} highlight>
              {textBlock(outcome, 'text-text-primary font-medium')}
            </Section>
          </div>

          {related.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="font-display text-3xl font-bold text-text-primary">Related Projects</h2>
                <Link to="/projects" className="text-sm text-accent-blue hover:underline">View all</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {related.map((item) => (
                  <Link key={item._id} to={`/projects/${item.slug}`} className="bg-bg-card/90 border border-border-subtle hover:border-accent-blue/40 rounded-[2rem] overflow-hidden transition-all duration-300 ease-out group shadow-[0_18px_55px_rgba(15,23,42,0.08)] hover:-translate-y-1">
                    {(getProjectImage(item)) && (
                      <div className="aspect-[2.14/1] bg-bg-primary/70">
                        <img src={getProjectImage(item)} alt={item.title} loading="lazy" className="w-full h-full object-cover object-center scale-[0.985] group-hover:scale-100 transition-transform duration-300 ease-out" />
                      </div>
                    )}
                    <div className="p-6">
                      <p className="text-xs font-mono text-text-muted mb-2">{item.category}</p>
                      <h3 className="font-display text-lg font-bold text-text-primary mb-2">{item.title}</h3>
                      <p className="text-sm text-text-secondary leading-6 line-clamp-2">{item.shortDescription || item.problem}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="relative overflow-hidden bg-bg-card/90 border border-border-subtle rounded-[2.25rem] p-10 md:p-16 text-center shadow-[0_25px_80px_rgba(79,142,255,0.12)]">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 via-transparent to-accent-purple/10 pointer-events-none" />
            <h2 className="relative font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Want to build reliable software like this?
            </h2>
            <p className="relative text-text-secondary mb-8 leading-7">Share the product idea, workflow, or system you want to ship.</p>
            <Link to="/hire" className="relative inline-flex items-center gap-2 px-9 py-4 bg-accent-blue hover:bg-blue-500 text-white rounded-2xl font-bold transition-all duration-300 ease-out shadow-glow-blue hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-accent-blue/40">
              Start a Project <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProjectDetail;
