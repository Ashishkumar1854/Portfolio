import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Edit2, Eye, FileText, Globe, Lock, Plus, Search, Trash2, Unlock } from 'lucide-react';
import toast from 'react-hot-toast';
import useApi from '../../hooks/useApi';
import api from '../../services/api';

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

const RESOURCE_TYPES = ['Template', 'Guide', 'Checklist', 'Workflow', 'Schema', 'Prompt Library', 'Blueprint', 'Tool'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const ROBOTS = ['index, follow', 'index, nofollow', 'noindex, follow', 'noindex, nofollow'];

const inputCls = 'w-full rounded-xl border border-border-subtle bg-bg-primary px-4 py-3 text-sm text-text-primary outline-none transition-all focus:border-accent-cyan';
const labelCls = 'mb-2 block text-sm font-medium text-text-secondary';

const slugify = (value = '') => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
const fromLines = (value) => value.split('\n').map((item) => item.trim()).filter(Boolean);
const toDateInput = (value) => value ? new Date(value).toISOString().slice(0, 10) : '';

const parseJsonList = (value, fallback = []) => {
  if (Array.isArray(value)) return value;
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const ManageResources = () => {
  const { data: resources, loading } = useApi('/api/resources?sort=updated');
  const [isEditing, setIsEditing] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);
  const [query, setQuery] = useState('');

  const filteredResources = useMemo(() => {
    if (!query) return resources || [];
    const q = query.toLowerCase();
    return (resources || []).filter((item) =>
      [item.title, item.slug, item.category, item.seo?.focusKeyword].filter(Boolean).some((value) => value.toLowerCase().includes(q))
    );
  }, [resources, query]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await api.delete(`/api/resources/${id}`);
        toast.success('Resource deleted successfully');
        window.location.reload();
      } catch {
        toast.error('Failed to delete resource');
      }
    }
  };

  if (isEditing) {
    return <ResourceForm resource={currentResource} onBack={() => setIsEditing(false)} />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary">Manage Resources</h1>
          <p className="text-text-secondary">Developer resources, SEO metadata, FAQs, changelog, and publishing details.</p>
        </div>
        <button
          onClick={() => { setCurrentResource(null); setIsEditing(true); }}
          className="flex items-center justify-center gap-2 rounded-xl bg-accent-cyan px-4 py-3 font-medium text-bg-primary shadow-glow-cyan transition-all hover:bg-cyan-600"
        >
          <Plus size={18} /> Add Resource
        </button>
      </div>

      <div className="mb-5 rounded-2xl border border-border-subtle bg-bg-card p-4">
        <label className="relative block">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search resources..." className={`${inputCls} pl-11`} />
        </label>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-bg-card shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-elevated text-sm text-text-secondary">
                <th className="p-4 font-medium">Resource</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Access</th>
                <th className="p-4 font-medium">SEO</th>
                <th className="p-4 font-medium">Stats</th>
                <th className="p-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-text-muted">Loading resources...</td></tr>
              ) : filteredResources.length > 0 ? filteredResources.map((res) => (
                <tr key={res._id} className="border-b border-border-subtle transition-colors hover:bg-bg-elevated/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 overflow-hidden rounded-xl border border-border-subtle bg-bg-primary">
                        {res.thumbnail ? <img src={res.thumbnail} alt={res.title} className="h-full w-full object-cover" /> : <FileText size={18} className="m-4 text-text-muted" />}
                      </div>
                      <div>
                        <div className="font-semibold text-text-primary">{res.title}</div>
                        <div className="text-[10px] font-mono text-text-muted">/{res.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-text-secondary">{res.category}</td>
                  <td className="p-4">
                    {res.isPremium ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-accent-amber/20 bg-accent-amber/10 px-2.5 py-1 text-[10px] font-bold text-accent-amber"><Lock size={10} /> Premium</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-accent-green/20 bg-accent-green/10 px-2.5 py-1 text-[10px] font-bold text-accent-green"><Unlock size={10} /> Free</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${res.seo?.metaTitle || res.seo?.metaDescription ? 'border-accent-blue/20 bg-accent-blue/10 text-accent-blue' : 'border-border-subtle bg-bg-primary text-text-muted'}`}>
                      <Globe size={10} /> {res.seo?.metaTitle || res.seo?.metaDescription ? 'Custom' : 'Auto'}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-mono text-text-secondary">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Download size={12} /> {res.downloads}</span>
                      <span className="flex items-center gap-1"><Eye size={12} /> {res.views}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => { setCurrentResource(res); setIsEditing(true); }} className="text-text-muted transition-colors hover:text-accent-cyan" title="Edit"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(res._id)} className="text-text-muted transition-colors hover:text-red-500" title="Delete"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="p-8 text-center text-text-muted">No resources found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const ResourceForm = ({ resource, onBack }) => {
  const [formData, setFormData] = useState({
    title: resource?.title || '',
    slug: resource?.slug || '',
    description: resource?.description || '',
    excerpt: resource?.excerpt || '',
    category: resource?.category || 'AI Agent Templates',
    thumbnail: resource?.thumbnail || '',
    ogImage: resource?.ogImage || '',
    downloadUrl: resource?.downloadUrl || '',
    resourceType: resource?.resourceType || 'Template',
    difficulty: resource?.difficulty || 'Beginner',
    isPremium: resource?.isPremium || false,
    featured: resource?.featured || false,
    version: resource?.version || '1.0.0',
    author: resource?.author || 'Ashish Kumar',
    tags: Array.isArray(resource?.tags) ? resource.tags.join('\n') : '',
    installationGuide: resource?.installationGuide || '',
    usage: resource?.usage || '',
    changelog: JSON.stringify(resource?.changelog || [], null, 2),
    publishedAt: toDateInput(resource?.publishedAt),
    updatedAtDisplay: toDateInput(resource?.updatedAtDisplay),
    metaTitle: resource?.seo?.metaTitle || '',
    metaDescription: resource?.seo?.metaDescription || '',
    focusKeyword: resource?.seo?.focusKeyword || '',
    canonical: resource?.seo?.canonical || '',
    seoOgImage: resource?.seo?.ogImage || '',
    robots: resource?.seo?.robots || 'index, follow',
  });
  const [features, setFeatures] = useState(resource?.features?.length ? resource.features : ['']);
  const [includedFiles, setIncludedFiles] = useState(resource?.includedFiles?.length ? resource.includedFiles : ['']);
  const [requirements, setRequirements] = useState(resource?.requirements?.length ? resource.requirements : ['']);
  const [screenshots, setScreenshots] = useState(resource?.screenshots?.length ? resource.screenshots : [{ image: '', alt: '', caption: '' }]);
  const [faq, setFaq] = useState(resource?.faq?.length ? resource.faq : [{ question: '', answer: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generatedSeo = {
    title: formData.metaTitle || `${formData.title || 'Resource'} | Developer Resource`,
    description: formData.metaDescription || formData.excerpt || formData.description,
    canonical: formData.canonical || `/resources/${formData.slug || slugify(formData.title)}`,
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'title' && !resource ? { slug: slugify(value) } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        tags: fromLines(formData.tags),
        features: features.map((item) => item.trim()).filter(Boolean),
        includedFiles: includedFiles.map((item) => item.trim()).filter(Boolean),
        requirements: requirements.map((item) => item.trim()).filter(Boolean),
        screenshots: JSON.stringify(screenshots.filter((item) => item.image?.trim()).map((item) => ({
          image: item.image.trim(),
          alt: item.alt?.trim() || '',
          caption: item.caption?.trim() || '',
        }))),
        faq: JSON.stringify(faq.filter((item) => item.question?.trim() && item.answer?.trim()).map((item) => ({
          question: item.question.trim(),
          answer: item.answer.trim(),
        }))),
        changelog: JSON.stringify(parseJsonList(formData.changelog)),
      };

      if (resource) {
        await api.put(`/api/resources/${resource._id}`, payload);
        toast.success('Resource updated successfully');
      } else {
        await api.post('/api/resources', payload);
        toast.success('Resource created successfully');
      }
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const Field = ({ label, name, as = 'input', rows = 3, ...props }) => (
    <div>
      <label className={labelCls}>{label}</label>
      {as === 'textarea' ? (
        <textarea name={name} rows={rows} value={formData[name]} onChange={handleChange} className={`${inputCls} resize-y`} {...props} />
      ) : (
        <input name={name} value={formData[name]} onChange={handleChange} className={inputCls} {...props} />
      )}
    </div>
  );

  const updateListItem = (setter, index, value) => {
    setter((items) => items.map((item, itemIndex) => itemIndex === index ? value : item));
  };

  const removeListItem = (setter, index, fallback) => {
    setter((items) => {
      const next = items.filter((_, itemIndex) => itemIndex !== index);
      return next.length ? next : [fallback];
    });
  };

  const RepeatableTextList = ({ title, items, setItems, placeholder }) => (
    <div className="rounded-2xl border border-border-subtle bg-bg-primary/40 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-text-primary">{title}</h3>
        <button type="button" onClick={() => setItems((current) => [...current, ''])} className="rounded-lg border border-border-subtle px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors hover:text-text-primary">
          + Add
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${title}-${index}`} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => updateListItem(setItems, index, e.target.value)}
              placeholder={placeholder}
              className={inputCls}
            />
            <button type="button" onClick={() => removeListItem(setItems, index, '')} className="rounded-xl border border-border-subtle px-3 text-text-muted transition-colors hover:text-red-500">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const updateObjectListItem = (setter, index, key, value) => {
    setter((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  };

  return (
    <div className="mx-auto max-w-6xl rounded-[2rem] border border-border-subtle bg-bg-card p-6 shadow-xl md:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-text-primary">{resource ? 'Edit Resource' : 'Add New Resource'}</h2>
          <p className="text-sm text-text-secondary">Manage content, library metadata, SEO, FAQ schema, and publishing details.</p>
        </div>
        <button onClick={onBack} className="text-text-secondary transition-colors hover:text-text-primary">Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Resource Title" name="title" required />
          <Field label="Slug" name="slug" required onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })} />
          <div>
            <label className={labelCls}>Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className={inputCls}>{CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          </div>
          <div>
            <label className={labelCls}>Resource Type</label>
            <select name="resourceType" value={formData.resourceType} onChange={handleChange} className={inputCls}>{RESOURCE_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          </div>
          <div>
            <label className={labelCls}>Difficulty</label>
            <select name="difficulty" value={formData.difficulty} onChange={handleChange} className={inputCls}>{DIFFICULTIES.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          </div>
          <Field label="Version" name="version" />
          <Field label="Author" name="author" />
          <Field label="Download URL" name="downloadUrl" required />
        </section>

        <section className="space-y-5">
          <Field label="Short Excerpt" name="excerpt" as="textarea" rows={2} />
          <Field label="Long Description / Overview" name="description" as="textarea" rows={5} required />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Thumbnail URL" name="thumbnail" />
            <Field label="Open Graph / Preview Image URL" name="ogImage" />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field label="Tags (one per line)" name="tags" as="textarea" rows={5} />
          <RepeatableTextList title="Features" items={features} setItems={setFeatures} placeholder="Production-ready setup" />
          <RepeatableTextList title="Included Files" items={includedFiles} setItems={setIncludedFiles} placeholder="README setup guide" />
          <RepeatableTextList title="Requirements" items={requirements} setItems={setRequirements} placeholder="Node.js 20+" />
          <Field label="Installation Guide" name="installationGuide" as="textarea" rows={6} />
          <Field label="Usage" name="usage" as="textarea" rows={6} />
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Field label="Published Date" name="publishedAt" type="date" />
          <Field label="Updated Date" name="updatedAtDisplay" type="date" />
          <div className="space-y-3 pt-8">
            <label className="flex items-center gap-3 text-sm text-text-secondary"><input type="checkbox" name="isPremium" checked={formData.isPremium} onChange={handleChange} /> Premium Resource</label>
            <label className="flex items-center gap-3 text-sm text-text-secondary"><input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} /> Featured Resource</label>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-border-subtle bg-bg-primary/40 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-text-primary">Screenshots</h3>
              <button type="button" onClick={() => setScreenshots((items) => [...items, { image: '', alt: '', caption: '' }])} className="rounded-lg border border-border-subtle px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors hover:text-text-primary">
                + Add Screenshot
              </button>
            </div>
            <div className="space-y-4">
              {screenshots.map((item, index) => (
                <div key={`screenshot-${index}`} className="rounded-xl border border-border-subtle bg-bg-card p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-mono text-text-muted">Screenshot {index + 1}</p>
                    <button type="button" onClick={() => removeListItem(setScreenshots, index, { image: '', alt: '', caption: '' })} className="text-text-muted transition-colors hover:text-red-500">
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input value={item.image || ''} onChange={(e) => updateObjectListItem(setScreenshots, index, 'image', e.target.value)} placeholder="Image URL" className={inputCls} />
                    <input value={item.alt || ''} onChange={(e) => updateObjectListItem(setScreenshots, index, 'alt', e.target.value)} placeholder="Alt text" className={inputCls} />
                    <input value={item.caption || ''} onChange={(e) => updateObjectListItem(setScreenshots, index, 'caption', e.target.value)} placeholder="Caption" className={inputCls} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-bg-primary/40 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-text-primary">FAQ</h3>
              <button type="button" onClick={() => setFaq((items) => [...items, { question: '', answer: '' }])} className="rounded-lg border border-border-subtle px-3 py-1.5 text-xs font-semibold text-text-secondary transition-colors hover:text-text-primary">
                + Add FAQ
              </button>
            </div>
            <div className="space-y-4">
              {faq.map((item, index) => (
                <div key={`faq-${index}`} className="rounded-xl border border-border-subtle bg-bg-card p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-mono text-text-muted">FAQ {index + 1}</p>
                    <button type="button" onClick={() => removeListItem(setFaq, index, { question: '', answer: '' })} className="text-text-muted transition-colors hover:text-red-500">
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input value={item.question || ''} onChange={(e) => updateObjectListItem(setFaq, index, 'question', e.target.value)} placeholder="Question" className={inputCls} />
                    <textarea value={item.answer || ''} onChange={(e) => updateObjectListItem(setFaq, index, 'answer', e.target.value)} placeholder="Answer" rows={3} className={`${inputCls} resize-y`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <Field label="Changelog JSON" name="changelog" as="textarea" rows={6} placeholder='[{"version":"1.0.1","date":"2026-07-08","notes":"..."}]' />
          </div>
        </section>

        <section className="rounded-2xl border border-border-subtle bg-bg-primary/40 p-5">
          <div className="mb-5 flex items-center gap-2 text-sm font-bold text-text-primary"><Globe size={16} className="text-accent-cyan" /> SEO Management</div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Meta Title" name="metaTitle" />
            <Field label="Focus Keyword" name="focusKeyword" />
            <Field label="Meta Description" name="metaDescription" as="textarea" rows={3} />
            <Field label="Canonical URL" name="canonical" />
            <Field label="SEO OG Image" name="seoOgImage" />
            <div>
              <label className={labelCls}>Robots</label>
              <select name="robots" value={formData.robots} onChange={handleChange} className={inputCls}>{ROBOTS.map((item) => <option key={item} value={item}>{item}</option>)}</select>
            </div>
          </div>
          <div className="mt-5 rounded-xl border border-border-subtle bg-bg-card p-4 text-sm">
            <p className="text-xs font-mono uppercase tracking-widest text-text-muted">SERP Preview</p>
            <h3 className="mt-2 font-semibold text-accent-blue">{generatedSeo.title}</h3>
            <p className="mt-1 text-text-secondary">{generatedSeo.description}</p>
            <p className="mt-2 text-xs text-text-muted">{generatedSeo.canonical}</p>
          </div>
        </section>

        <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-accent-cyan px-6 py-4 font-bold text-bg-primary shadow-glow-cyan transition-all hover:bg-cyan-600 disabled:opacity-50">
          {isSubmitting ? 'Saving...' : 'Save Resource'}
        </button>
      </form>
    </div>
  );
};

export default ManageResources;
