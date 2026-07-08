import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Image as ImageIcon, Plus, Trash2, X as XIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import useApi from '../../hooks/useApi';
import api from '../../services/api';

const CATEGORIES = ['SaaS', 'AI Automation', 'WhatsApp Automation', 'n8n', 'Full Stack', 'Other'];

const inputCls = 'w-full rounded-xl border border-border-subtle bg-bg-primary px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-accent-blue';
const labelCls = 'mb-2 block text-sm font-medium text-text-secondary';
const panelCls = 'rounded-2xl border border-border-subtle bg-bg-card p-6';

const stripHtml = (html = '') => html.replace(/<[^>]*>/g, ' ');
const readingTime = (value = '') => Math.max(1, Math.ceil(stripHtml(value).split(/\s+/).filter(Boolean).length / 200));
const slugify = (value = '') => value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+|-+$/g, '');
const toDateInput = (date) => (date ? new Date(date).toISOString().slice(0, 10) : '');

const toLines = (items = []) => (items || []).join('\n');
const fromLines = (value = '') => value.split('\n').map((item) => item.trim()).filter(Boolean);

const ManageCaseStudies = () => {
  const { data: caseStudies, loading } = useApi('/api/case-studies/admin/all');
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this case study?')) return;
    try {
      await api.delete(`/api/case-studies/${id}`);
      toast.success('Case study deleted');
      window.location.reload();
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (isEditing) {
    return <CaseStudyForm caseStudy={current} allCaseStudies={caseStudies || []} onBack={() => setIsEditing(false)} />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary">Manage Case Studies</h1>
          <p className="mt-2 text-sm text-text-secondary">Client stories, SEO metadata, publishing, and project proof.</p>
        </div>
        <button onClick={() => { setCurrent(null); setIsEditing(true); }} className="inline-flex items-center gap-2 rounded-xl bg-accent-cyan px-4 py-2 font-semibold text-bg-primary transition-all hover:bg-cyan-500">
          <Plus size={18} /> New Case Study
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-bg-card">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-elevated text-sm text-text-secondary">
                <th className="p-4 font-medium">Case Study</th>
                <th className="p-4 font-medium">Industry</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Featured</th>
                <th className="p-4 font-medium">SEO</th>
                <th className="p-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-text-muted">Loading...</td></tr>
              ) : caseStudies?.length ? (
                caseStudies.map((item) => (
                  <tr key={item._id} className="border-b border-border-subtle transition-colors hover:bg-bg-elevated/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {item.coverImage || item.imageUrl ? (
                          <img src={item.coverImage || item.imageUrl} alt={item.title} className="h-12 w-16 rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-bg-secondary text-text-muted"><ImageIcon size={18} /></div>
                        )}
                        <div>
                          <p className="font-medium text-text-primary">{item.title}</p>
                          <p className="text-xs font-mono text-text-muted">/{item.slug || item._id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-text-secondary">{item.industry || item.category || '-'}</td>
                    <td className="p-4"><span className="rounded bg-bg-elevated px-2 py-1 text-xs text-text-secondary">{item.status || 'Published'}</span></td>
                    <td className="p-4">{item.featured ? <span className="rounded bg-accent-cyan/10 px-2 py-1 text-xs text-accent-cyan">Yes</span> : <span className="text-xs text-text-muted">No</span>}</td>
                    <td className="p-4 text-xs text-text-muted">{item.noIndex ? 'NoIndex' : item.seoTitle ? 'Custom' : 'Auto'}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => { setCurrent(item); setIsEditing(true); }} className="text-text-muted transition-colors hover:text-accent-cyan"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(item._id)} className="text-text-muted transition-colors hover:text-red-500"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="p-8 text-center text-text-muted">No case studies yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const CaseStudyForm = ({ caseStudy, allCaseStudies, onBack }) => {
  const [formData, setFormData] = useState({
    title: caseStudy?.title || '',
    slug: caseStudy?.slug || '',
    excerpt: caseStudy?.excerpt || caseStudy?.subtitle || '',
    clientName: caseStudy?.clientName || '',
    industry: caseStudy?.industry || caseStudy?.category || '',
    projectDuration: caseStudy?.projectDuration || '',
    completionDate: toDateInput(caseStudy?.completionDate),
    category: caseStudy?.category || 'Other',
    content: caseStudy?.content || '',
    overview: caseStudy?.overview || '',
    challenge: caseStudy?.challenge || caseStudy?.problem || '',
    solution: caseStudy?.solution || caseStudy?.architecture || '',
    implementation: caseStudy?.implementation || '',
    results: caseStudy?.results || '',
    conclusion: caseStudy?.conclusion || caseStudy?.lessonsLearned || '',
    techStack: toLines(caseStudy?.techStack),
    status: caseStudy?.status || (caseStudy?.published === false ? 'Draft' : 'Published'),
    published: caseStudy?.published ?? true,
    featured: caseStudy?.featured || false,
    publishedAt: toDateInput(caseStudy?.publishedAt),
    seoTitle: caseStudy?.seoTitle || '',
    seoDescription: caseStudy?.seoDescription || '',
    focusKeyword: caseStudy?.focusKeyword || '',
    canonicalUrl: caseStudy?.canonicalUrl || '',
    noIndex: caseStudy?.noIndex || false,
  });
  const [metrics, setMetrics] = useState(caseStudy?.metrics?.length ? caseStudy.metrics : [{ label: '', value: '', description: '' }]);
  const [faq, setFaq] = useState(caseStudy?.faq?.length ? caseStudy.faq : [{ question: '', answer: '' }]);
  const [testimonial, setTestimonial] = useState(caseStudy?.testimonial || { clientName: '', designation: '', company: '', quote: '' });
  const [relatedCaseStudies, setRelatedCaseStudies] = useState((caseStudy?.relatedCaseStudies || []).map((item) => item._id || item));
  const [coverImage, setCoverImage] = useState(null);
  const [ogImage, setOgImage] = useState(null);
  const [clientImage, setClientImage] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [existingGallery, setExistingGallery] = useState(caseStudy?.gallery?.length ? caseStudy.gallery : (caseStudy?.screenshots || []).map((url) => ({ url, caption: '' })));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generatedSlug = formData.slug || slugify(formData.title);
  const generatedReadingTime = useMemo(() => readingTime([
    formData.content,
    formData.overview,
    formData.challenge,
    formData.solution,
    formData.implementation,
    formData.results,
    formData.conclusion,
  ].join(' ')), [formData]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'title' && !caseStudy ? { slug: slugify(value) } : {}),
      ...(name === 'status' ? { published: value === 'Published' } : {}),
    }));
  };

  const updateList = (setter, index, value) => setter((items) => items.map((item, itemIndex) => itemIndex === index ? value : item));
  const removeListItem = (setter, index) => setter((items) => items.filter((_, itemIndex) => itemIndex !== index));
  const addListItem = (setter, item) => setter((items) => [...items, item]);

  const handleRemoveExistingScreenshot = async (url) => {
    if (!caseStudy || !window.confirm('Remove this screenshot?')) return;
    try {
      await api.delete(`/api/case-studies/${caseStudy._id}/screenshot`, { data: { url } });
      setExistingGallery((items) => items.filter((item) => item.url !== url));
      toast.success('Screenshot removed');
    } catch {
      toast.error('Failed to remove screenshot');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.set('techStack', JSON.stringify(fromLines(formData.techStack)));
    data.set('metrics', JSON.stringify(metrics.filter((item) => item.label.trim() || item.value.trim())));
    data.set('faq', JSON.stringify(faq.filter((item) => item.question.trim() && item.answer.trim())));
    data.set('testimonial', JSON.stringify(testimonial));
    data.set('gallery', JSON.stringify(existingGallery.filter((item) => item.url)));
    data.set('relatedCaseStudies', JSON.stringify(relatedCaseStudies.filter(Boolean)));
    if (coverImage) data.append('coverImage', coverImage);
    if (ogImage) data.append('ogImage', ogImage);
    if (clientImage) data.append('clientImage', clientImage);
    galleryFiles.forEach((file) => data.append('screenshots', file));

    try {
      if (caseStudy) {
        await api.put(`/api/case-studies/${caseStudy._id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Case study updated');
      } else {
        await api.post('/api/case-studies', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Case study created');
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-text-primary">{caseStudy ? 'Edit Case Study' : 'Create Case Study'}</h2>
          <p className="mt-1 text-sm text-text-secondary">Auto slug: /case-studies/{generatedSlug || 'case-study'} · Reading time: {generatedReadingTime} min</p>
        </div>
        <button onClick={onBack} className="text-sm text-text-secondary hover:text-text-primary">Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className={panelCls}>
          <h3 className="mb-5 font-display text-xl font-bold text-text-primary">Basic Information</h3>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Title *" name="title" required />
            <Field label="Slug" name="slug" placeholder="auto-generated-if-empty" />
            <Field label="Client Name" name="clientName" />
            <Field label="Industry" name="industry" placeholder="SaaS, Healthcare, Education..." />
            <Field label="Project Duration" name="projectDuration" placeholder="8 weeks" />
            <Field label="Completion Date" name="completionDate" type="date" />
            <div>
              <label className={labelCls}>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className={inputCls}>
                {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className={inputCls}>
                {['Published', 'Draft', 'Archived'].map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-5">
            <Field label="Excerpt" name="excerpt" as="textarea" rows={2} />
          </div>
        </section>

        <section className={panelCls}>
          <h3 className="mb-5 font-display text-xl font-bold text-text-primary">Content Editor</h3>
          <div className="space-y-5">
            <Field label="Long-form Content (supports HTML headings for TOC)" name="content" as="textarea" rows={10} />
            <Field label="Overview" name="overview" as="textarea" rows={4} />
            <Field label="Challenge" name="challenge" as="textarea" rows={4} />
            <Field label="Solution" name="solution" as="textarea" rows={4} />
            <Field label="Implementation" name="implementation" as="textarea" rows={4} />
            <Field label="Results" name="results" as="textarea" rows={4} />
            <Field label="Conclusion" name="conclusion" as="textarea" rows={4} />
          </div>
        </section>

        <section className={panelCls}>
          <h3 className="mb-5 font-display text-xl font-bold text-text-primary">Media</h3>
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className={labelCls}>Cover Image</label>
              {(caseStudy?.coverImage || caseStudy?.imageUrl) && <img src={caseStudy.coverImage || caseStudy.imageUrl} alt="Current cover" className="mb-3 h-24 rounded-xl object-cover" />}
              <input type="file" accept="image/*" onChange={(event) => setCoverImage(event.target.files[0])} className="w-full text-sm text-text-secondary file:mr-4 file:rounded-lg file:border-0 file:bg-accent-cyan/10 file:px-4 file:py-2 file:font-semibold file:text-accent-cyan" />
            </div>
            <div>
              <label className={labelCls}>OG Image</label>
              {caseStudy?.ogImage && <img src={caseStudy.ogImage} alt="Current OG" className="mb-3 h-24 rounded-xl object-cover" />}
              <input type="file" accept="image/*" onChange={(event) => setOgImage(event.target.files[0])} className="w-full text-sm text-text-secondary file:mr-4 file:rounded-lg file:border-0 file:bg-accent-blue/10 file:px-4 file:py-2 file:font-semibold file:text-accent-blue" />
            </div>
            <div>
              <label className={labelCls}>Client Image</label>
              {caseStudy?.testimonial?.clientImage && <img src={caseStudy.testimonial.clientImage} alt="Client" className="mb-3 h-24 rounded-xl object-cover" />}
              <input type="file" accept="image/*" onChange={(event) => setClientImage(event.target.files[0])} className="w-full text-sm text-text-secondary file:mr-4 file:rounded-lg file:border-0 file:bg-accent-purple/10 file:px-4 file:py-2 file:font-semibold file:text-accent-purple" />
            </div>
          </div>
          <div className="mt-6">
            <label className={labelCls}>Gallery</label>
            {existingGallery.length > 0 && (
              <div className="mb-4 grid gap-3 md:grid-cols-3">
                {existingGallery.map((item, index) => (
                  <div key={item.url || index} className="relative rounded-xl border border-border-subtle bg-bg-primary p-2">
                    {item.url && <img src={item.url} alt={`Gallery ${index + 1}`} className="mb-2 h-24 w-full rounded-lg object-cover" />}
                    <input value={item.caption || ''} onChange={(event) => updateList(setExistingGallery, index, { ...item, caption: event.target.value })} className={inputCls} placeholder="Caption" />
                    {item.url && <button type="button" onClick={() => handleRemoveExistingScreenshot(item.url)} className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"><XIcon size={12} /></button>}
                  </div>
                ))}
              </div>
            )}
            <input type="file" multiple accept="image/*" onChange={(event) => setGalleryFiles(Array.from(event.target.files))} className="w-full text-sm text-text-secondary file:mr-4 file:rounded-lg file:border-0 file:bg-accent-blue/10 file:px-4 file:py-2 file:font-semibold file:text-accent-blue" />
          </div>
        </section>

        <section className={panelCls}>
          <h3 className="mb-5 font-display text-xl font-bold text-text-primary">Project Information</h3>
          <div>
            <label className={labelCls}>Technology Stack (one per line)</label>
            <textarea name="techStack" value={formData.techStack} onChange={handleChange} rows={5} className={`${inputCls} resize-y`} />
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <label className={labelCls}>Metrics</label>
              <button type="button" onClick={() => addListItem(setMetrics, { label: '', value: '', description: '' })} className="text-sm text-accent-cyan">+ Add Metric</button>
            </div>
            {metrics.map((metric, index) => (
              <div key={index} className="grid gap-3 rounded-xl border border-border-subtle bg-bg-primary p-4 md:grid-cols-[1fr_1fr_2fr_auto]">
                <input value={metric.label} onChange={(event) => updateList(setMetrics, index, { ...metric, label: event.target.value })} className={inputCls} placeholder="Increase Conversion" />
                <input value={metric.value} onChange={(event) => updateList(setMetrics, index, { ...metric, value: event.target.value })} className={inputCls} placeholder="+180%" />
                <input value={metric.description || ''} onChange={(event) => updateList(setMetrics, index, { ...metric, description: event.target.value })} className={inputCls} placeholder="Short context" />
                <button type="button" onClick={() => removeListItem(setMetrics, index)} className="text-text-muted hover:text-red-500"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        </section>

        <section className={panelCls}>
          <h3 className="mb-5 font-display text-xl font-bold text-text-primary">Testimonial</h3>
          <div className="grid gap-5 md:grid-cols-3">
            {['clientName', 'designation', 'company'].map((field) => (
              <input key={field} value={testimonial[field] || ''} onChange={(event) => setTestimonial((prev) => ({ ...prev, [field]: event.target.value }))} className={inputCls} placeholder={field.replace(/([A-Z])/g, ' $1')} />
            ))}
          </div>
          <textarea value={testimonial.quote || ''} onChange={(event) => setTestimonial((prev) => ({ ...prev, quote: event.target.value }))} rows={4} className={`${inputCls} mt-5 resize-y`} placeholder="Client quote" />
        </section>

        <section className={panelCls}>
          <h3 className="mb-5 font-display text-xl font-bold text-text-primary">SEO</h3>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Meta Title" name="seoTitle" />
            <Field label="Focus Keyword" name="focusKeyword" />
            <Field label="Canonical URL" name="canonicalUrl" />
            <label className="flex items-center gap-3 pt-8 text-sm text-text-secondary">
              <input type="checkbox" name="noIndex" checked={formData.noIndex} onChange={handleChange} /> NoIndex
            </label>
          </div>
          <div className="mt-5">
            <Field label="Meta Description" name="seoDescription" as="textarea" rows={3} />
          </div>
          <div className="mt-5 rounded-xl border border-border-subtle bg-bg-primary p-4">
            <p className="text-sm font-semibold text-text-primary">{formData.seoTitle || `${formData.title || 'Case Study'} | Case Study`}</p>
            <p className="mt-1 text-xs text-accent-blue">/case-studies/{generatedSlug}</p>
            <p className="mt-2 text-sm text-text-secondary">{formData.seoDescription || formData.excerpt || 'SEO description preview...'}</p>
          </div>
        </section>

        <section className={panelCls}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-text-primary">FAQ</h3>
            <button type="button" onClick={() => addListItem(setFaq, { question: '', answer: '' })} className="text-sm text-accent-cyan">+ Add FAQ</button>
          </div>
          <div className="space-y-3">
            {faq.map((item, index) => (
              <div key={index} className="rounded-xl border border-border-subtle bg-bg-primary p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-text-secondary">FAQ {index + 1}</span>
                  <button type="button" onClick={() => removeListItem(setFaq, index)} className="text-text-muted hover:text-red-500"><Trash2 size={16} /></button>
                </div>
                <input value={item.question} onChange={(event) => updateList(setFaq, index, { ...item, question: event.target.value })} className={inputCls} placeholder="Question" />
                <textarea value={item.answer} onChange={(event) => updateList(setFaq, index, { ...item, answer: event.target.value })} rows={3} className={`${inputCls} mt-3 resize-y`} placeholder="Answer" />
              </div>
            ))}
          </div>
        </section>

        <section className={panelCls}>
          <h3 className="mb-5 font-display text-xl font-bold text-text-primary">Publishing</h3>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Published Date" name="publishedAt" type="date" />
            <label className="flex items-center gap-3 pt-8 text-sm text-text-secondary">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} /> Featured Case Study
            </label>
          </div>
          <div className="mt-5">
            <label className={labelCls}>Related Case Studies (manual override)</label>
            <select multiple value={relatedCaseStudies} onChange={(event) => setRelatedCaseStudies(Array.from(event.target.selectedOptions).map((option) => option.value))} className={`${inputCls} min-h-32`}>
              {(allCaseStudies || []).filter((item) => item._id !== caseStudy?._id).map((item) => (
                <option key={item._id} value={item._id}>{item.title}</option>
              ))}
            </select>
            <p className="mt-2 text-xs text-text-muted">Leave empty to use automatic industry + technology related studies.</p>
          </div>
        </section>

        <button type="submit" disabled={isSubmitting} className="rounded-xl bg-accent-cyan px-8 py-3 font-bold text-bg-primary transition-all hover:bg-cyan-500 disabled:opacity-50">
          {isSubmitting ? 'Saving...' : caseStudy ? 'Update Case Study' : 'Create Case Study'}
        </button>
      </form>
    </div>
  );
};

export default ManageCaseStudies;
