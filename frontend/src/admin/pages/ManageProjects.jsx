import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  Edit2,
  Eye,
  FileText,
  Globe,
  Image as ImageIcon,
  Link as LinkIcon,
  Plus,
  Search,
  Settings,
  Sparkles,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import useApi from '../../hooks/useApi';
import api from '../../services/api';

const CATEGORIES = ['Frontend', 'Backend', 'Full-Stack', 'AI/ML', 'Other'];
const STATUS_OPTIONS = ['Completed', 'Live', 'Maintenance', 'In Progress', 'Archived'];
const VISIBILITY_OPTIONS = ['Public', 'Private'];
const PROJECT_TYPES = [
  'Portfolio Showcase',
  'SaaS Platform',
  'AI Agent',
  'Automation',
  'Full Stack Application',
  'Mobile Application',
  'API',
  'CLI Tool',
  'Open Source',
  'Library',
  'Desktop Application',
];
const CLIENT_TYPES = ['Personal', 'Client', 'Company', 'Startup', 'Open Source', 'College', 'Hackathon', 'Research'];
const TECH_GROUPS = [
  ['frontend', 'Frontend'],
  ['backend', 'Backend'],
  ['database', 'Database'],
  ['infrastructure', 'Infrastructure'],
  ['ai', 'AI'],
  ['devops', 'DevOps'],
  ['tools', 'Tools'],
];

const slugify = (text = '') =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');

const splitList = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const normalizeProjectType = (value) => PROJECT_TYPES.includes(value)
  ? value
  : value === 'Software'
    ? 'Full Stack Application'
    : 'Full Stack Application';

const normalizeClientType = (value) => CLIENT_TYPES.includes(value)
  ? value
  : value === 'Business' || value === 'Internal'
    ? 'Company'
    : 'Personal';

const normalizeStatus = (value) => STATUS_OPTIONS.includes(value)
  ? value
  : value === 'Draft'
    ? 'In Progress'
    : value === 'Published'
      ? 'Completed'
      : 'Completed';

const Section = ({ icon, title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="border border-border-subtle rounded-2xl bg-bg-primary/30 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-4 text-left"
      >
        <span className="flex items-center gap-2">
          <span className="text-accent-blue">{icon}</span>
          <span className="font-display font-bold text-text-primary">{title}</span>
        </span>
        <ChevronDown size={18} className={`text-text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="space-y-5 px-5 md:px-6 pb-6">{children}</div>}
  </section>
  );
};

const Counter = ({ value, max }) => {
  const count = value?.length || 0;
  const tone = count > max ? 'text-red-400' : count > max * 0.85 ? 'text-yellow-400' : 'text-text-muted';
  return <span className={`text-[11px] font-mono ${tone}`}>{count}/{max}</span>;
};

const ManageProjects = () => {
  const { data: projects, loading } = useApi('/api/projects/admin/all');
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/api/projects/${id}`);
      toast.success('Project deleted');
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    }
  };

  const handleEdit = (project) => {
    setCurrentProject(project);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentProject(null);
    setIsEditing(true);
  };

  if (isEditing) {
    return <ProjectForm project={currentProject} allProjects={projects || []} onBack={() => setIsEditing(false)} />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Manage Projects</h1>
          <p className="text-sm text-text-secondary mt-1">Software portfolio projects, SEO metadata, publishing, and media.</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-accent-blue hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-all shadow-glow-blue"
        >
          <Plus size={18} /> Add Project
        </button>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-elevated border-b border-border-subtle text-text-secondary text-sm">
                <th className="p-4 font-medium">Project</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Featured</th>
                <th className="p-4 font-medium">SEO</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-text-muted">Loading projects...</td>
                </tr>
              ) : projects?.length > 0 ? (
                projects.map((project) => {
                  const image = project.thumbnail || project.imageUrl;
                  return (
                    <tr key={project._id} className="border-b border-border-subtle hover:bg-bg-elevated/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {image ? (
                            <img src={image} alt={project.title} className="w-16 h-12 object-cover rounded bg-bg-secondary" />
                          ) : (
                            <div className="w-16 h-12 bg-bg-secondary rounded flex items-center justify-center text-text-muted">
                              <ImageIcon size={18} />
                            </div>
                          )}
                          <div>
                            <p className="text-text-primary font-medium">{project.title}</p>
                            <p className="text-xs text-text-muted font-mono">/{project.slug || 'missing-slug'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-text-secondary">{project.category}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          project.published && project.status !== 'Archived'
                            ? 'text-accent-green bg-accent-green/10'
                            : !project.published
                              ? 'text-yellow-400 bg-yellow-400/10'
                              : 'text-text-muted bg-bg-elevated'
                        }`}>
                          {project.published === false ? 'Draft' : project.status || 'Completed'}
                        </span>
                      </td>
                      <td className="p-4 text-text-secondary">
                        {project.featured ? <span className="text-accent-purple bg-accent-purple/10 px-2 py-1 rounded text-xs">Yes</span> : 'No'}
                      </td>
                      <td className="p-4 text-text-secondary">
                        {project.seo?.title || project.seo?.description ? (
                          <span className="text-accent-blue bg-accent-blue/10 px-2 py-1 rounded text-xs">Override</span>
                        ) : (
                          <span className="text-text-muted text-xs">Auto</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {project.slug && (
                            <a href={`/projects/${project.slug}`} target="_blank" rel="noreferrer" className="text-text-muted hover:text-accent-green transition-colors">
                              <Eye size={18} />
                            </a>
                          )}
                          <button onClick={() => handleEdit(project)} className="text-text-muted hover:text-accent-blue transition-colors">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDelete(project._id)} className="text-text-muted hover:text-red-500 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-text-muted">No projects found. Create one!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectForm = ({ project, allProjects, onBack }) => {
  const initialTechGroups = TECH_GROUPS.reduce((groups, [key]) => {
    groups[key] = project?.techStackGroups?.[key]?.join(', ') || '';
    return groups;
  }, {});
  const [formData, setFormData] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    category: project?.category || 'Full-Stack',
    featured: project?.featured || false,
    featuredOrder: project?.featuredOrder || 0,
    order: project?.order || 0,
    projectType: normalizeProjectType(project?.projectType),
    clientType: normalizeClientType(project?.clientType),
    status: normalizeStatus(project?.status),
    published: project?.published ?? true,
    visibility: project?.visibility || 'Public',
    shortDescription: project?.shortDescription || project?.problem || '',
    overview: project?.overview || '',
    problem: project?.problem || '',
    solution: project?.solution || '',
    architecture: project?.architecture || '',
    features: project?.features?.join(', ') || '',
    technicalChallenges: project?.technicalChallenges || '',
    outcome: project?.outcome || project?.results || '',
    myRole: project?.myRole || '',
    techStack: (project?.techStack?.length ? project.techStack : project?.tech || []).join(', '),
    ...Object.fromEntries(TECH_GROUPS.map(([key]) => [`tech_${key}`, initialTechGroups[key]])),
    tags: project?.tags?.join(', ') || '',
    githubUrl: project?.githubUrl || '',
    liveUrl: project?.liveUrl || '',
    demoVideo: project?.demoVideo || '',
    seoTitle: project?.seo?.title || '',
    seoDescription: project?.seo?.description || '',
    seoKeywords: project?.seo?.keywords?.join(', ') || '',
    canonical: project?.seo?.canonical || '',
    seoEnabled: project?.seo?.enabled ?? true,
    seoCustom: project?.seo?.custom || false,
    noIndex: project?.seo?.noIndex || false,
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [galleryMeta, setGalleryMeta] = useState([]);
  const [ogImage, setOgImage] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState((project?.relatedProjects || []).map((item) => item._id || item));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputCls = 'w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-blue transition-colors text-sm';
  const labelCls = 'flex items-center justify-between text-sm text-text-secondary mb-2';

  const generatedSeo = useMemo(() => ({
    title: formData.seoTitle || `${formData.title || 'Project'} | Project by Ashish Kumar`,
    description: formData.seoDescription || formData.shortDescription || formData.problem || formData.overview,
    keywords: formData.seoKeywords || [formData.title, formData.category, formData.techStack, formData.tags].filter(Boolean).join(', '),
  }), [formData]);

  const previewSlug = formData.slug || slugify(formData.title);
  const currentImage = project?.thumbnail || project?.imageUrl;
  const thumbnailPreview = thumbnail ? URL.createObjectURL(thumbnail) : currentImage;
  const ogPreview = ogImage ? URL.createObjectURL(ogImage) : project?.seo?.ogImage || project?.ogImage || thumbnailPreview;
  const existingGallery = (project?.gallery || []).map((item, index) => (
    typeof item === 'string'
      ? { image: item, alt: `${project.title} screenshot ${index + 1}`, caption: '' }
      : item
  ));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'title' && !project && !prev.slug) next.slug = slugify(value);
      return next;
    });
  };

  const handleGalleryFiles = (files) => {
    const selected = Array.from(files);
    setGallery(selected);
    setGalleryMeta(selected.map((file, index) => ({
      alt: galleryMeta[index]?.alt || `${formData.title || 'Project'} screenshot ${index + 1}`,
      caption: galleryMeta[index]?.caption || '',
      preview: URL.createObjectURL(file),
    })));
  };

  const handleGalleryMetaChange = (index, field, value) => {
    setGalleryMeta((prev) => prev.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [field]: value } : item
    )));
  };

  const toggleRelatedProject = (id) => {
    setRelatedProjects((prev) => (
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (['techStack', 'tags', 'features', 'seoKeywords'].includes(key)) {
        data.append(key, JSON.stringify(splitList(value)));
      } else {
        data.append(key, value);
      }
    });
    data.append('published', formData.published);
    data.append('galleryMeta', JSON.stringify(galleryMeta.map(({ alt, caption }) => ({ alt, caption }))));
    data.append('relatedProjects', JSON.stringify(relatedProjects));
    if (thumbnail) data.append('thumbnail', thumbnail);
    if (ogImage) data.append('ogImage', ogImage);
    gallery.forEach((file) => data.append('gallery', file));

    try {
      if (project) {
        await api.put(`/api/projects/${project._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Project updated');
      } else {
        await api.post('/api/projects', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Project created');
      }
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 md:p-8">
      <div className="flex justify-between items-start gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-text-primary">{project ? 'Edit Project' : 'Create Project'}</h2>
          <p className="text-sm text-text-secondary mt-1">Build a premium portfolio project page from Admin.</p>
        </div>
        <button onClick={onBack} className="text-text-secondary hover:text-text-primary text-sm">Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Section icon={<FileText size={18} />} title="Basic Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Slug</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} className={inputCls} placeholder={slugify(formData.title)} />
              <p className="text-xs text-text-muted mt-1 font-mono">/projects/{previewSlug || 'project-slug'}</p>
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className={inputCls}>
                {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Project Type</label>
              <select name="projectType" value={formData.projectType} onChange={handleChange} className={inputCls}>
                {PROJECT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Client Type</label>
              <select name="clientType" value={formData.clientType} onChange={handleChange} className={inputCls}>
                {CLIENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>My Role</label>
              <input type="text" name="myRole" value={formData.myRole} onChange={handleChange} className={inputCls} placeholder="Full-stack developer, architect, automation engineer..." />
            </div>
          </div>
          <div>
            <label className={labelCls}>
              <span>Short Description *</span>
              <Counter value={formData.shortDescription} max={160} />
            </label>
            <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows={3} className={`${inputCls} resize-y`} required />
          </div>
        </Section>

        <Section icon={<Sparkles size={18} />} title="Portfolio Story">
          {[
            ['overview', 'Overview'],
            ['architecture', 'Architecture'],
            ['technicalChallenges', 'Technical Challenges'],
            ['outcome', 'Outcome'],
          ].map(([name, label]) => (
            <div key={name}>
              <label className={labelCls}>{label}</label>
              <textarea name={name} value={formData[name]} onChange={handleChange} rows={4} className={`${inputCls} resize-y`} />
            </div>
          ))}
          <div>
            <label className={labelCls}>Features (comma separated)</label>
            <input type="text" name="features" value={formData.features} onChange={handleChange} className={inputCls} placeholder="Auth, dashboard, AI workflow, reporting" />
          </div>
        </Section>

        <Section icon={<Settings size={18} />} title="Technologies">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TECH_GROUPS.map(([key, label]) => (
              <div key={key}>
                <label className={labelCls}>{label}</label>
                <input
                  type="text"
                  name={`tech_${key}`}
                  value={formData[`tech_${key}`]}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder={label === 'Frontend' ? 'React, Tailwind CSS' : label === 'Backend' ? 'Node.js, Express' : ''}
                />
              </div>
            ))}
          </div>
          <div>
            <label className={labelCls}>Legacy / Ungrouped Tech Stack</label>
            <input type="text" name="techStack" value={formData.techStack} onChange={handleChange} className={inputCls} placeholder="Used only when grouped fields are empty" />
          </div>
          <div>
            <label className={labelCls}>Tags (comma separated)</label>
            <input type="text" name="tags" value={formData.tags} onChange={handleChange} className={inputCls} placeholder="AI Automation, SaaS, Dashboard" />
          </div>
        </Section>

        <Section icon={<ImageIcon size={18} />} title="Media">
          {thumbnailPreview && (
            <div>
              <p className="text-sm text-text-secondary mb-2">Thumbnail Preview</p>
              <img src={thumbnailPreview} alt="Thumbnail preview" className="h-32 rounded-xl border border-border-subtle object-cover" />
            </div>
          )}
          <div>
            <label className={labelCls}>Thumbnail {project && '(leave empty to keep current)'}</label>
            <input type="file" onChange={(e) => setThumbnail(e.target.files[0])} accept="image/*" className="w-full text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent-blue/10 file:text-accent-blue hover:file:bg-accent-blue/20" />
          </div>
          {existingGallery.length > 0 && (
            <div>
              <p className="text-sm text-text-secondary mb-2">Existing Gallery</p>
              <div className="flex flex-wrap gap-3">
                {existingGallery.map((item) => (
                  <div key={item.image} className="w-40">
                    <img src={item.image} alt={item.alt || 'Project gallery'} className="w-40 h-24 rounded-lg object-cover border border-border-subtle" />
                    {item.caption && <p className="text-xs text-text-muted mt-1 line-clamp-2">{item.caption}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className={labelCls}>Gallery Images</label>
            <input type="file" multiple onChange={(e) => handleGalleryFiles(e.target.files)} accept="image/*" className="w-full text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent-purple/10 file:text-accent-purple hover:file:bg-accent-purple/20" />
            {gallery.length > 0 && <p className="text-xs text-text-muted mt-1">{gallery.length} image(s) selected</p>}
          </div>
          {galleryMeta.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {galleryMeta.map((item, index) => (
                <div key={item.preview} className="border border-border-subtle rounded-xl p-3 bg-bg-primary/50">
                  <img src={item.preview} alt={item.alt} className="w-full h-32 rounded-lg object-cover mb-3" />
                  <label className={labelCls}>Alt Text</label>
                  <input type="text" value={item.alt} onChange={(e) => handleGalleryMetaChange(index, 'alt', e.target.value)} className={inputCls} />
                  <label className={`${labelCls} mt-3`}>Caption</label>
                  <input type="text" value={item.caption} onChange={(e) => handleGalleryMetaChange(index, 'caption', e.target.value)} className={inputCls} />
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section icon={<LinkIcon size={18} />} title="External Links">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelCls}>GitHub URL</label>
              <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Live URL</label>
              <input type="url" name="liveUrl" value={formData.liveUrl} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Demo Video</label>
              <input type="url" name="demoVideo" value={formData.demoVideo} onChange={handleChange} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Related Projects</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-56 overflow-auto border border-border-subtle rounded-xl p-3 bg-bg-primary/40">
              {allProjects.filter((item) => item._id !== project?._id).map((item) => (
                <label key={item._id} className="flex items-center gap-3 text-sm text-text-secondary bg-bg-card/60 border border-border-subtle rounded-lg px-3 py-2">
                  <input
                    type="checkbox"
                    checked={relatedProjects.includes(item._id)}
                    onChange={() => toggleRelatedProject(item._id)}
                  />
                  <span className="min-w-0">
                    <span className="block text-text-primary truncate">{item.title}</span>
                    <span className="block text-xs text-text-muted font-mono truncate">/{item.slug || 'missing-slug'}</span>
                  </span>
                </label>
              ))}
              {allProjects.filter((item) => item._id !== project?._id).length === 0 && (
                <p className="text-sm text-text-muted">Create more projects to select related links.</p>
              )}
            </div>
          </div>
        </Section>

        <Section icon={<Search size={18} />} title="SEO">
          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-3 text-sm text-text-secondary">
              <input type="checkbox" name="seoEnabled" checked={formData.seoEnabled} onChange={handleChange} />
              Enable SEO for this project
            </label>
            <label className="flex items-center gap-3 text-sm text-text-secondary">
              <input type="checkbox" name="seoCustom" checked={formData.seoCustom} onChange={handleChange} />
              Use custom SEO overrides
            </label>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`space-y-5 ${formData.seoCustom ? '' : 'opacity-60'}`}>
              <div>
                <label className={labelCls}>
                  <span>SEO Title Override</span>
                  <Counter value={formData.seoTitle} max={60} />
                </label>
                <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} className={inputCls} placeholder={generatedSeo.title} disabled={!formData.seoCustom} />
              </div>
              <div>
                <label className={labelCls}>
                  <span>SEO Description Override</span>
                  <Counter value={formData.seoDescription} max={160} />
                </label>
                <textarea name="seoDescription" value={formData.seoDescription} onChange={handleChange} rows={3} className={`${inputCls} resize-y`} placeholder={generatedSeo.description} disabled={!formData.seoCustom} />
              </div>
              <div>
                <label className={labelCls}>SEO Keywords Override</label>
                <input type="text" name="seoKeywords" value={formData.seoKeywords} onChange={handleChange} className={inputCls} placeholder={generatedSeo.keywords} disabled={!formData.seoCustom} />
              </div>
              <div>
                <label className={labelCls}>Canonical Override</label>
                <input type="url" name="canonical" value={formData.canonical} onChange={handleChange} className={inputCls} placeholder={`/projects/${previewSlug}`} disabled={!formData.seoCustom} />
              </div>
              <div>
                <label className={labelCls}>Open Graph Image Override</label>
                <input type="file" onChange={(e) => setOgImage(e.target.files[0])} accept="image/*" disabled={!formData.seoCustom} className="w-full text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent-cyan/10 file:text-accent-cyan hover:file:bg-accent-cyan/20" />
              </div>
              <label className="flex items-center gap-3 text-sm text-text-secondary">
                <input type="checkbox" name="noIndex" checked={formData.noIndex} onChange={handleChange} />
                noIndex this project
              </label>
            </div>
            <div className="space-y-5">
              <div className="border border-border-subtle rounded-2xl overflow-hidden bg-bg-card">
                {ogPreview && <img src={ogPreview} alt="Open Graph preview" className="w-full h-40 object-cover" />}
                <div className="p-4">
                  <p className="text-xs text-text-muted mb-1">Open Graph Preview</p>
                  <h4 className="font-display font-bold text-text-primary line-clamp-2">{generatedSeo.title}</h4>
                  <p className="text-sm text-text-secondary mt-2 line-clamp-3">{generatedSeo.description}</p>
                  <p className="text-xs text-text-muted font-mono mt-3">ashishportfolio.aigateway.in/projects/{previewSlug}</p>
                </div>
              </div>
              <div className="border border-border-subtle rounded-2xl p-4 bg-bg-primary/50">
                <p className="text-xs text-text-muted mb-2">SEO mode</p>
                <p className="text-sm text-text-secondary">
                  Automatic metadata uses the project title, type, overview, tech stack, thumbnail, and slug. Custom fields apply only when custom SEO is enabled.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section icon={<Globe size={18} />} title="Publishing">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className={inputCls}>
                {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Visibility</label>
              <select name="visibility" value={formData.visibility} onChange={handleChange} className={inputCls}>
                {VISIBILITY_OPTIONS.map((visibility) => <option key={visibility} value={visibility}>{visibility}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Display Order</label>
              <input type="number" name="order" value={formData.order} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Featured Order</label>
              <input type="number" name="featuredOrder" value={formData.featuredOrder} onChange={handleChange} className={inputCls} />
            </div>
          </div>
          <label className="flex items-center gap-3 text-sm text-text-secondary">
            <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} />
            Published on public portfolio
          </label>
          <label className="flex items-center gap-3 text-sm text-text-secondary">
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
            Featured Project
          </label>
        </Section>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <button type="button" onClick={onBack} className="px-6 py-3 border border-border-subtle hover:border-border-active text-text-secondary hover:text-text-primary rounded-xl transition-all">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="bg-accent-blue hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageProjects;
