import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Edit2, Eye, FileText, Globe, Image as ImageIcon, Plus, Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useApi from '../../hooks/useApi';
import api from '../../services/api';

const CATEGORIES = ['AI Automation', 'AI Agents', 'n8n', 'SaaS', 'Development', 'System Design', 'Startup Journey'];
const STATUSES = ['Draft', 'Published', 'Archived'];
const inputCls = 'w-full rounded-xl border border-border-subtle bg-bg-primary px-4 py-3 text-sm text-text-primary outline-none transition-all focus:border-accent-purple';
const labelCls = 'mb-2 block text-sm font-medium text-text-secondary';

const slugify = (value = '') => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
const fromLines = (value = '') => value.split('\n').map((item) => item.trim()).filter(Boolean);
const toLines = (value = []) => Array.isArray(value) ? value.join('\n') : '';
const stripHtml = (html = '') => html.replace(/<[^>]*>/g, ' ');
const readingTime = (html = '') => Math.max(1, Math.ceil(stripHtml(html).split(/\s+/).filter(Boolean).length / 200));
const slugifyAnchor = (value = '') => value.toLowerCase().replace(/<[^>]*>/g, '').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').replace(/(^-|-$)+/g, '');
const generateTocPreview = (html = '') => {
  const headings = [];
  html.replace(/<h([2-4])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, innerHtml) => {
    const title = stripHtml(innerHtml).replace(/\s+/g, ' ').trim();
    if (title) headings.push({ title, anchor: slugifyAnchor(title), level: Number(level) });
    return '';
  });
  return headings;
};
const toDateInput = (value) => value ? new Date(value).toISOString().slice(0, 10) : '';

const Section = ({ icon, title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="overflow-hidden rounded-2xl border border-border-subtle bg-bg-primary/30">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
        <span className="flex items-center gap-2">
          <span className="text-accent-purple">{icon}</span>
          <span className="font-display font-bold text-text-primary">{title}</span>
        </span>
        <ChevronDown size={18} className={`text-text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="space-y-5 px-5 pb-6">{children}</div>}
    </section>
  );
};

const ManageBlogs = () => {
  const { data: blogs, loading } = useApi('/api/blogs/admin/all');
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [query, setQuery] = useState('');

  const filteredBlogs = useMemo(() => {
    if (!query) return blogs || [];
    const q = query.toLowerCase();
    return (blogs || []).filter((blog) =>
      [blog.title, blog.slug, blog.category, blog.focusKeyword].filter(Boolean).some((value) => value.toLowerCase().includes(q))
    );
  }, [blogs, query]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await api.delete(`/api/blogs/${id}`);
      toast.success('Blog deleted');
      window.location.reload();
    } catch {
      toast.error('Failed to delete blog');
    }
  };

  if (isEditing) {
    return <BlogForm blog={currentBlog} allBlogs={blogs || []} onBack={() => setIsEditing(false)} />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary">Manage Blogs</h1>
          <p className="text-text-secondary">SEO articles, technical writing, hiring content, and trust-building posts.</p>
        </div>
        <button
          onClick={() => { setCurrentBlog(null); setIsEditing(true); }}
          className="flex items-center justify-center gap-2 rounded-xl bg-accent-purple px-4 py-3 font-medium text-white shadow-glow-purple transition-all hover:bg-purple-600"
        >
          <Plus size={18} /> New Post
        </button>
      </div>

      <div className="mb-5 rounded-2xl border border-border-subtle bg-bg-card p-4">
        <label className="relative block">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search blogs..." className={`${inputCls} pl-11`} />
        </label>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-bg-card shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-elevated text-sm text-text-secondary">
                <th className="p-4 font-medium">Post</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">SEO</th>
                <th className="p-4 font-medium">Stats</th>
                <th className="p-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-text-muted">Loading blogs...</td></tr>
              ) : filteredBlogs.length > 0 ? filteredBlogs.map((blog) => (
                <tr key={blog._id} className="border-b border-border-subtle transition-colors hover:bg-bg-elevated/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 overflow-hidden rounded-xl border border-border-subtle bg-bg-primary">
                        {blog.coverImage || blog.imageUrl ? <img src={blog.coverImage || blog.imageUrl} alt={blog.title} className="h-full w-full object-cover" /> : <FileText size={18} className="m-4 text-text-muted" />}
                      </div>
                      <div>
                        <div className="font-semibold text-text-primary">{blog.title}</div>
                        <div className="text-[10px] font-mono text-text-muted">/{blog.slug || blog._id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-text-secondary">{blog.category || 'Uncategorized'}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${blog.published && blog.status === 'Published' ? 'bg-accent-green/10 text-accent-green' : blog.status === 'Archived' ? 'bg-bg-primary text-text-muted' : 'bg-yellow-400/10 text-yellow-400'}`}>
                      {blog.published && blog.status === 'Published' ? 'Published' : blog.status || 'Draft'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${blog.seoTitle || blog.seoDescription ? 'border-accent-purple/20 bg-accent-purple/10 text-accent-purple' : 'border-border-subtle bg-bg-primary text-text-muted'}`}>
                      <Globe size={10} /> {blog.seoTitle || blog.seoDescription ? 'Custom' : 'Auto'}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-mono text-text-secondary">
                    {blog.readingTime || readingTime(blog.content)} min · {blog.views || 0} views
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <a href={`/blog/${blog.slug || blog._id}`} target="_blank" rel="noreferrer" className="text-text-muted transition-colors hover:text-accent-green" title="View"><Eye size={18} /></a>
                      <button onClick={() => { setCurrentBlog(blog); setIsEditing(true); }} className="text-text-muted transition-colors hover:text-accent-purple" title="Edit"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(blog._id)} className="text-text-muted transition-colors hover:text-red-500" title="Delete"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="p-8 text-center text-text-muted">No blogs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const BlogForm = ({ blog, allBlogs, onBack }) => {
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    excerpt: blog?.excerpt || blog?.subtitle || '',
    content: blog?.content || '',
    category: blog?.category || 'Development',
    tags: toLines(blog?.tags),
    status: blog?.status || (blog?.published === false ? 'Draft' : 'Published'),
    featured: blog?.featured || false,
    published: blog?.published ?? true,
    publishedAt: toDateInput(blog?.publishedAt),
    seoTitle: blog?.seoTitle || '',
    seoDescription: blog?.seoDescription || '',
    focusKeyword: blog?.focusKeyword || '',
    canonical: blog?.canonical || '',
    noIndex: blog?.noIndex || false,
  });
  const [coverImage, setCoverImage] = useState(null);
  const [ogImage, setOgImage] = useState(null);
  const [faq, setFaq] = useState(blog?.faq?.length ? blog.faq : [{ question: '', answer: '' }]);
  const [relatedBlogs, setRelatedBlogs] = useState((blog?.relatedBlogs || []).map((item) => item._id || item));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generatedSlug = formData.slug || slugify(formData.title);
  const generatedSeo = {
    title: formData.seoTitle || `${formData.title || 'Blog Post'} | Technical Blog`,
    description: formData.seoDescription || formData.excerpt,
    canonical: formData.canonical || `/blog/${generatedSlug}`,
    readingTime: readingTime(formData.content),
  };
  const tocPreview = generateTocPreview(formData.content);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'title' && !blog ? { slug: slugify(value) } : {}),
      ...(name === 'status' ? { published: value === 'Published' } : {}),
    }));
  };

  const updateList = (setter, index, value) => setter((items) => items.map((item, itemIndex) => itemIndex === index ? value : item));
  const addListItem = (setter, item) => setter((items) => [...items, item]);
  const removeListItem = (setter, index) => setter((items) => items.filter((_, itemIndex) => itemIndex !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.set('tags', JSON.stringify(fromLines(formData.tags)));
    data.set('faq', JSON.stringify(faq.filter((item) => item.question.trim() && item.answer.trim())));
    data.set('relatedBlogs', JSON.stringify(relatedBlogs.filter(Boolean)));
    if (coverImage) data.append('coverImage', coverImage);
    if (ogImage) data.append('ogImage', ogImage);

    try {
      if (blog) {
        await api.put(`/api/blogs/${blog._id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Blog updated');
      } else {
        await api.post('/api/blogs', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Blog created');
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

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-card p-5 md:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-text-primary">{blog ? 'Edit Blog' : 'Create Blog'}</h2>
          <p className="text-sm text-text-secondary">Production blog CMS with publishing, media, SEO, FAQ, and previews.</p>
        </div>
        <button onClick={onBack} className="text-text-secondary transition-colors hover:text-text-primary">Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Section icon={<FileText size={18} />} title="Basic Information">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Title" name="title" required />
            <Field label="Slug" name="slug" placeholder="auto-generated-slug" />
          </div>
          <Field label="Excerpt" name="excerpt" as="textarea" rows={3} required />
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelCls}>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className={inputCls}>
                {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
            <Field label="Tags (one per line)" name="tags" as="textarea" rows={4} />
          </div>
        </Section>

        <Section icon={<FileText size={18} />} title="Content Editor">
          <div>
            <label className={labelCls}>Content</label>
            <div className="overflow-hidden rounded-xl bg-white text-black">
              <ReactQuill theme="snow" value={formData.content} onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))} className="h-80 mb-12" />
            </div>
            <p className="mt-2 text-xs text-text-muted">Auto reading time: {generatedSeo.readingTime} min</p>
          </div>
        </Section>

        <Section icon={<ImageIcon size={18} />} title="Media">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelCls}>Cover Image</label>
              {(coverImage || blog?.coverImage || blog?.imageUrl) && (
                <img src={coverImage ? URL.createObjectURL(coverImage) : blog.coverImage || blog.imageUrl} alt="Cover preview" className="mb-3 h-32 w-full rounded-xl border border-border-subtle object-cover" />
              )}
              <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} className="w-full text-sm text-text-secondary file:mr-4 file:rounded-lg file:border-0 file:bg-accent-purple/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent-purple" />
            </div>
            <div>
              <label className={labelCls}>OG Image</label>
              {(ogImage || blog?.ogImage) && (
                <img src={ogImage ? URL.createObjectURL(ogImage) : blog.ogImage} alt="OG preview" className="mb-3 h-32 w-full rounded-xl border border-border-subtle object-cover" />
              )}
              <input type="file" accept="image/*" onChange={(e) => setOgImage(e.target.files[0])} className="w-full text-sm text-text-secondary file:mr-4 file:rounded-lg file:border-0 file:bg-accent-purple/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent-purple" />
            </div>
          </div>
        </Section>

        <Section icon={<Globe size={18} />} title="SEO">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="SEO Title" name="seoTitle" />
            <Field label="Focus Keyword" name="focusKeyword" />
          </div>
          <Field label="SEO Description" name="seoDescription" as="textarea" rows={3} />
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Canonical URL" name="canonical" />
            <label className="flex items-center gap-3 rounded-xl border border-border-subtle bg-bg-primary px-4 py-3 text-sm text-text-secondary">
              <input type="checkbox" name="noIndex" checked={formData.noIndex} onChange={handleChange} />
              Noindex this article
            </label>
          </div>
          <div className="rounded-xl border border-border-subtle bg-bg-primary p-4">
            <p className="text-xs font-mono uppercase tracking-widest text-accent-blue">SEO Preview</p>
            <h3 className="mt-2 text-lg font-bold text-text-primary">{generatedSeo.title}</h3>
            <p className="mt-1 text-sm text-text-secondary">{generatedSeo.description || 'Add an excerpt or SEO description.'}</p>
            <p className="mt-2 text-xs font-mono text-text-muted">{generatedSeo.canonical}</p>
          </div>
        </Section>

        <Section icon={<FileText size={18} />} title="FAQ & Auto Table of Contents" defaultOpen={false}>
          <div className="space-y-3">
            <div className="flex items-center justify-between"><label className={labelCls}>FAQ</label><button type="button" onClick={() => addListItem(setFaq, { question: '', answer: '' })} className="text-xs text-accent-purple">+ Add FAQ</button></div>
            {faq.map((item, index) => (
              <div key={index} className="grid gap-3 rounded-xl border border-border-subtle bg-bg-primary p-3 md:grid-cols-[1fr_1fr_auto]">
                <input value={item.question} onChange={(e) => updateList(setFaq, index, { ...item, question: e.target.value })} placeholder="Question" className={inputCls} />
                <input value={item.answer} onChange={(e) => updateList(setFaq, index, { ...item, answer: e.target.value })} placeholder="Answer" className={inputCls} />
                <button type="button" onClick={() => removeListItem(setFaq, index)} className="text-red-400"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-border-subtle bg-bg-primary p-4">
            <label className={labelCls}>Auto Table of Contents</label>
            {tocPreview.length > 0 ? (
              <div className="space-y-2">
                {tocPreview.map((item, index) => (
                  <div key={`${item.anchor}-${index}`} className="flex items-center justify-between gap-3 rounded-lg bg-bg-card px-3 py-2 text-sm">
                    <span className="text-text-secondary">{' '.repeat(Math.max(0, item.level - 2) * 2)}{item.title}</span>
                    <span className="font-mono text-xs text-text-muted">#{item.anchor}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted">Add H2/H3/H4 headings in content to generate TOC automatically.</p>
            )}
          </div>
        </Section>

        <Section icon={<FileText size={18} />} title="Publishing & Relations">
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className={labelCls}>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className={inputCls}>
                {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <Field label="Published Date" name="publishedAt" type="date" />
            <label className="flex items-center gap-3 rounded-xl border border-border-subtle bg-bg-primary px-4 py-3 text-sm text-text-secondary">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
              Featured article
            </label>
          </div>
          <div>
            <label className={labelCls}>Related Blogs</label>
            <select multiple value={relatedBlogs} onChange={(e) => setRelatedBlogs(Array.from(e.target.selectedOptions).map((option) => option.value))} className={`${inputCls} min-h-36`}>
              {allBlogs.filter((item) => item._id !== blog?._id).map((item) => <option key={item._id} value={item._id}>{item.title}</option>)}
            </select>
          </div>
        </Section>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onBack} className="rounded-xl border border-border-subtle px-5 py-3 text-text-secondary transition-colors hover:text-text-primary">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="rounded-xl bg-accent-purple px-6 py-3 font-bold text-white transition-all hover:bg-purple-600 disabled:opacity-50">
            {isSubmitting ? 'Saving...' : blog ? 'Update Blog' : 'Create Blog'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageBlogs;
