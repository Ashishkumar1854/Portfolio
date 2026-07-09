import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Bot,
  Edit2,
  Eye,
  Globe,
  Image,
  Layers,
  ListPlus,
  MessageCircle,
  Plus,
  Save,
  Search,
  Trash2,
  Workflow,
  X,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import useApi from '../../hooks/useApi';

const STATUSES = ['Published', 'Draft', 'Archived'];
const CATEGORIES = ['Automation', 'SaaS', 'AI', 'Full Stack', 'WhatsApp Automation', 'n8n', 'Other'];
const ICONS = ['Bot', 'Workflow', 'MessageCircle', 'Layers', 'Globe', 'Zap'];
const CURRENCIES = ['INR', 'USD', 'EUR'];

const inputCls = 'w-full rounded-xl border border-border-subtle bg-bg-primary px-4 py-2.5 text-sm text-text-primary outline-none transition-all focus:border-accent-blue';
const textareaCls = `${inputCls} min-h-28 resize-y`;
const labelCls = 'mb-2 block text-xs font-mono uppercase tracking-widest text-text-muted';

const slugify = (value = '') =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const renderIcon = (name, size = 18) => {
  const icons = {
    Bot: <Bot size={size} />,
    Workflow: <Workflow size={size} />,
    MessageCircle: <MessageCircle size={size} />,
    Layers: <Layers size={size} />,
    Globe: <Globe size={size} />,
    Zap: <Zap size={size} />,
  };
  return icons[name] || <Zap size={size} />;
};

const formatDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : '');

const emptyForm = {
  title: '',
  slug: '',
  shortDescription: '',
  excerpt: '',
  overview: '',
  icon: 'Zap',
  color: 'text-accent-blue',
  bg: 'bg-accent-blue/10',
  category: 'Automation',
  status: 'Published',
  featured: false,
  displayOrder: 0,
  publishedDate: '',
  startingPrice: '',
  endingPrice: '',
  pricingText: '',
  currency: 'INR',
  pricingModel: 'Project based',
  content: '',
  problem: '',
  solution: '',
  workflow: '',
  implementation: '',
  estimatedDelivery: '',
  supportPeriod: '',
  revisionPolicy: '',
  metaTitle: '',
  metaDescription: '',
  focusKeyword: '',
  canonical: '',
  noIndex: false,
};

const toForm = (service = {}) => {
  const safeService = service || {};
  return {
    ...emptyForm,
    ...safeService,
    slug: safeService.slug || slugify(safeService.title || ''),
    publishedDate: formatDateInput(safeService.publishedDate || safeService.publishedAt),
    pricingText: safeService.pricingText || safeService.pricing || '',
  };
};

const Section = ({ icon, title, children }) => (
  <section className="rounded-[2rem] border border-border-subtle bg-bg-card/90 p-6 shadow-card">
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-blue/10 text-accent-blue">{icon}</span>
      <h3 className="font-display text-xl font-bold text-text-primary">{title}</h3>
    </div>
    {children}
  </section>
);

const ArrayEditor = ({ label, values, setValues, placeholder }) => {
  const [draft, setDraft] = useState('');
  const add = () => {
    if (!draft.trim()) return;
    setValues([...(values || []), draft.trim()]);
    setDraft('');
  };
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="mb-3 flex gap-2">
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={placeholder} className={inputCls} />
        <button type="button" onClick={add} className="rounded-xl bg-accent-blue px-4 text-sm font-bold text-white">Add</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(values || []).map((item, index) => (
          <span key={`${item}-${index}`} className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-elevated px-3 py-1 text-xs text-text-secondary">
            {item}
            <button type="button" onClick={() => setValues(values.filter((_, i) => i !== index))} className="text-text-muted hover:text-red-400"><X size={12} /></button>
          </span>
        ))}
      </div>
    </div>
  );
};

const ObjectEditor = ({ label, values, setValues, fields, emptyItem }) => (
  <div>
    <div className="mb-3 flex items-center justify-between">
      <label className={labelCls}>{label}</label>
      <button type="button" onClick={() => setValues([...(values || []), emptyItem])} className="inline-flex items-center gap-1 rounded-lg border border-border-subtle px-3 py-1.5 text-xs font-bold text-text-secondary hover:text-text-primary">
        <Plus size={13} /> Add
      </button>
    </div>
    <div className="space-y-3">
      {(values || []).map((item, index) => (
        <div key={index} className="rounded-2xl border border-border-subtle bg-bg-primary/55 p-4">
          <div className="mb-3 flex justify-end">
            <button type="button" onClick={() => setValues(values.filter((_, i) => i !== index))} className="text-text-muted hover:text-red-400"><Trash2 size={14} /></button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {fields.map((field) => (
              <label key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <span className={labelCls}>{field.label}</span>
                {field.type === 'textarea' ? (
                  <textarea value={item[field.name] || ''} onChange={(e) => setValues(values.map((entry, i) => i === index ? { ...entry, [field.name]: e.target.value } : entry))} className={textareaCls} />
                ) : (
                  <input type={field.inputType || 'text'} value={item[field.name] || ''} onChange={(e) => setValues(values.map((entry, i) => i === index ? { ...entry, [field.name]: e.target.value } : entry))} className={inputCls} />
                )}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ServiceForm = ({ service, allServices, caseStudies, onBack }) => {
  const [form, setForm] = useState(toForm(service));
  const [benefits, setBenefits] = useState(service?.benefits || []);
  const [useCases, setUseCases] = useState(service?.useCases || []);
  const [whoItsFor, setWhoItsFor] = useState(service?.whoItsFor || []);
  const [whyChooseUs, setWhyChooseUs] = useState(service?.whyChooseUs || []);
  const [technologyStack, setTechnologyStack] = useState(service?.technologyStack || []);
  const [integrations, setIntegrations] = useState(service?.integrations || []);
  const [supportedPlatforms, setSupportedPlatforms] = useState(service?.supportedPlatforms || []);
  const [deliverables, setDeliverables] = useState(service?.deliverables || []);
  const [process, setProcess] = useState(service?.process || []);
  const [features, setFeatures] = useState(service?.features || []);
  const [workflowSteps, setWorkflowSteps] = useState(service?.workflowSteps || []);
  const [faq, setFaq] = useState(service?.faq || []);
  const [gallery, setGallery] = useState(service?.gallery || []);
  const [relatedServices, setRelatedServices] = useState((service?.relatedServices || []).map((item) => item._id || item));
  const [relatedCaseStudies, setRelatedCaseStudies] = useState((service?.relatedCaseStudies || []).map((item) => item._id || item));
  const [coverImage, setCoverImage] = useState(null);
  const [ogImage, setOgImage] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  const generatedSlug = form.slug || slugify(form.title);
  const seoTitle = form.metaTitle || `${form.title || 'Service'} | Ashish Kumar`;
  const seoDescription = form.metaDescription || form.shortDescription || form.excerpt || form.overview;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'title' && !prev.slug ? { slug: slugify(value) } : {}),
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = new FormData();
    Object.entries({ ...form, slug: generatedSlug, published: form.status === 'Published' }).forEach(([key, value]) => payload.append(key, value ?? ''));
    [
      ['benefits', benefits],
      ['useCases', useCases],
      ['whoItsFor', whoItsFor],
      ['whyChooseUs', whyChooseUs],
      ['technologyStack', technologyStack],
      ['integrations', integrations],
      ['supportedPlatforms', supportedPlatforms],
      ['deliverables', deliverables],
      ['process', process],
      ['features', features],
      ['workflowSteps', workflowSteps],
      ['faq', faq],
      ['gallery', gallery],
      ['relatedServices', relatedServices],
      ['relatedCaseStudies', relatedCaseStudies],
    ].forEach(([key, value]) => payload.append(key, JSON.stringify(value)));
    if (coverImage) payload.append('coverImage', coverImage);
    if (ogImage) payload.append('ogImage', ogImage);
    galleryFiles.forEach((file) => payload.append('gallery', file));

    try {
      if (service?._id) {
        await api.put(`/api/services/${service._id}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Service updated');
      } else {
        await api.post('/api/services', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Service created');
      }
      onBack();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary">
          <ArrowLeft size={16} /> Back to Services
        </button>
        <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-accent-blue px-5 py-3 text-sm font-bold text-white shadow-glow-blue disabled:opacity-60">
          <Save size={16} /> {saving ? 'Saving...' : 'Save Service'}
        </button>
      </div>

      <Section icon={<ListPlus size={18} />} title="Basic Information">
        <div className="grid gap-5 md:grid-cols-2">
          <label><span className={labelCls}>Title</span><input name="title" value={form.title} onChange={handleChange} className={inputCls} required /></label>
          <label><span className={labelCls}>Slug</span><input name="slug" value={generatedSlug} onChange={handleChange} className={inputCls} /></label>
          <label><span className={labelCls}>Category</span><select name="category" value={form.category} onChange={handleChange} className={inputCls}>{CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span className={labelCls}>Status</span><select name="status" value={form.status} onChange={handleChange} className={inputCls}>{STATUSES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span className={labelCls}>Icon</span><select name="icon" value={form.icon} onChange={handleChange} className={inputCls}>{ICONS.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span className={labelCls}>Display Order</span><input name="displayOrder" type="number" value={form.displayOrder} onChange={handleChange} className={inputCls} /></label>
          <label className="md:col-span-2"><span className={labelCls}>Short Description</span><textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} className={textareaCls} /></label>
          <label className="md:col-span-2"><span className={labelCls}>Excerpt</span><textarea name="excerpt" value={form.excerpt} onChange={handleChange} className={textareaCls} /></label>
          <label className="md:col-span-2"><span className={labelCls}>Overview</span><textarea name="overview" value={form.overview} onChange={handleChange} className={textareaCls} required /></label>
          <label className="flex items-center gap-3"><input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} /> <span className="text-sm text-text-secondary">Featured service</span></label>
          <label><span className={labelCls}>Published Date</span><input name="publishedDate" type="date" value={form.publishedDate} onChange={handleChange} className={inputCls} /></label>
        </div>
      </Section>

      <Section icon={<Edit2 size={18} />} title="Content Editor">
        <div className="grid gap-5 md:grid-cols-2">
          {['problem', 'solution', 'workflow', 'implementation'].map((field) => (
            <label key={field} className="md:col-span-2">
              <span className={labelCls}>{field}</span>
              <textarea name={field} value={form[field]} onChange={handleChange} className={textareaCls} />
            </label>
          ))}
          <label className="md:col-span-2"><span className={labelCls}>Rich HTML Content</span><textarea name="content" value={form.content} onChange={handleChange} className={`${textareaCls} min-h-52`} /></label>
          <ArrayEditor label="Benefits" values={benefits} setValues={setBenefits} placeholder="Add benefit..." />
          <ArrayEditor label="Use Cases" values={useCases} setValues={setUseCases} placeholder="Add use case..." />
          <ArrayEditor label="Who It's For" values={whoItsFor} setValues={setWhoItsFor} placeholder="Add audience..." />
          <ArrayEditor label="Why Choose Us" values={whyChooseUs} setValues={setWhyChooseUs} placeholder="Add reason..." />
        </div>
      </Section>

      <Section icon={<Image size={18} />} title="Media">
        <div className="grid gap-5 md:grid-cols-3">
          <label><span className={labelCls}>Cover Image</span><input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files?.[0])} className={inputCls} /></label>
          <label><span className={labelCls}>OG Image</span><input type="file" accept="image/*" onChange={(e) => setOgImage(e.target.files?.[0])} className={inputCls} /></label>
          <label><span className={labelCls}>Gallery Upload</span><input type="file" accept="image/*" multiple onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))} className={inputCls} /></label>
        </div>
        <div className="mt-5">
          <ObjectEditor label="Gallery URLs" values={gallery} setValues={setGallery} emptyItem={{ url: '', caption: '', alt: '' }} fields={[{ name: 'url', label: 'Image URL' }, { name: 'caption', label: 'Caption' }, { name: 'alt', label: 'Alt Text' }]} />
        </div>
      </Section>

      <Section icon={<Zap size={18} />} title="Pricing & Timeline">
        <div className="grid gap-5 md:grid-cols-3">
          <label><span className={labelCls}>Starting Price</span><input name="startingPrice" type="number" value={form.startingPrice} onChange={handleChange} className={inputCls} /></label>
          <label><span className={labelCls}>Ending Price</span><input name="endingPrice" type="number" value={form.endingPrice} onChange={handleChange} className={inputCls} /></label>
          <label><span className={labelCls}>Currency</span><select name="currency" value={form.currency} onChange={handleChange} className={inputCls}>{CURRENCIES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span className={labelCls}>Pricing Text</span><input name="pricingText" value={form.pricingText} onChange={handleChange} className={inputCls} /></label>
          <label><span className={labelCls}>Pricing Model</span><input name="pricingModel" value={form.pricingModel} onChange={handleChange} className={inputCls} /></label>
          <label><span className={labelCls}>Estimated Delivery</span><input name="estimatedDelivery" value={form.estimatedDelivery} onChange={handleChange} className={inputCls} /></label>
          <label><span className={labelCls}>Support Period</span><input name="supportPeriod" value={form.supportPeriod} onChange={handleChange} className={inputCls} /></label>
          <label className="md:col-span-2"><span className={labelCls}>Revision Policy</span><input name="revisionPolicy" value={form.revisionPolicy} onChange={handleChange} className={inputCls} /></label>
        </div>
      </Section>

      <Section icon={<Workflow size={18} />} title="Technologies, Features & FAQ">
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-3">
            <ArrayEditor label="Technology Stack" values={technologyStack} setValues={setTechnologyStack} placeholder="React, Node.js..." />
            <ArrayEditor label="Supported Platforms" values={supportedPlatforms} setValues={setSupportedPlatforms} placeholder="Web, WhatsApp..." />
            <ArrayEditor label="Integrations" values={integrations} setValues={setIntegrations} placeholder="Stripe, OpenAI..." />
          </div>
          <ArrayEditor label="Deliverables" values={deliverables} setValues={setDeliverables} placeholder="Add deliverable..." />
          <ArrayEditor label="Legacy Process Steps" values={process} setValues={setProcess} placeholder="Add process step..." />
          <ObjectEditor label="Features" values={features} setValues={setFeatures} emptyItem={{ title: '', description: '', icon: 'Zap' }} fields={[{ name: 'title', label: 'Title' }, { name: 'icon', label: 'Icon' }, { name: 'description', label: 'Description', type: 'textarea' }]} />
          <ObjectEditor label="Workflow Steps" values={workflowSteps} setValues={setWorkflowSteps} emptyItem={{ step: workflowSteps.length + 1, title: '', description: '' }} fields={[{ name: 'step', label: 'Step Number', inputType: 'number' }, { name: 'title', label: 'Title' }, { name: 'description', label: 'Description', type: 'textarea' }]} />
          <ObjectEditor label="FAQ" values={faq} setValues={setFaq} emptyItem={{ question: '', answer: '' }} fields={[{ name: 'question', label: 'Question' }, { name: 'answer', label: 'Answer', type: 'textarea' }]} />
        </div>
      </Section>

      <Section icon={<Globe size={18} />} title="SEO & Related Content">
        <div className="grid gap-5 md:grid-cols-2">
          <label><span className={labelCls}>Meta Title</span><input name="metaTitle" value={form.metaTitle} onChange={handleChange} className={inputCls} /></label>
          <label><span className={labelCls}>Focus Keyword</span><input name="focusKeyword" value={form.focusKeyword} onChange={handleChange} className={inputCls} /></label>
          <label className="md:col-span-2"><span className={labelCls}>Meta Description</span><textarea name="metaDescription" value={form.metaDescription} onChange={handleChange} className={textareaCls} /></label>
          <label><span className={labelCls}>Canonical</span><input name="canonical" value={form.canonical} onChange={handleChange} className={inputCls} /></label>
          <label className="flex items-center gap-3 pt-8"><input type="checkbox" name="noIndex" checked={form.noIndex} onChange={handleChange} /> <span className="text-sm text-text-secondary">NoIndex</span></label>
          <label><span className={labelCls}>Related Services</span><select multiple value={relatedServices} onChange={(e) => setRelatedServices(Array.from(e.target.selectedOptions).map((option) => option.value))} className={`${inputCls} min-h-36`}>{allServices.filter((item) => item._id !== service?._id).map((item) => <option key={item._id} value={item._id}>{item.title}</option>)}</select></label>
          <label><span className={labelCls}>Related Case Studies</span><select multiple value={relatedCaseStudies} onChange={(e) => setRelatedCaseStudies(Array.from(e.target.selectedOptions).map((option) => option.value))} className={`${inputCls} min-h-36`}>{caseStudies.map((item) => <option key={item._id} value={item._id}>{item.title}</option>)}</select></label>
          <div className="md:col-span-2 rounded-2xl border border-border-subtle bg-bg-primary/60 p-5">
            <p className="text-xs font-mono uppercase tracking-widest text-text-muted">SEO Preview</p>
            <p className="mt-3 text-lg font-bold text-accent-blue">{seoTitle}</p>
            <p className="text-sm text-accent-green">/services/{generatedSlug}</p>
            <p className="mt-2 text-sm text-text-secondary">{seoDescription}</p>
          </div>
        </div>
      </Section>
    </form>
  );
};

const ManageServices = () => {
  const [reloadKey, setReloadKey] = useState(0);
  const { data: services = [], loading } = useApi(`/api/services/admin/all?reload=${reloadKey}`);
  const { data: caseStudies = [] } = useApi('/api/case-studies/admin/all');
  const [query, setQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState(null);

  const filteredServices = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services || [];
    return (services || []).filter((item) => [item.title, item.category, item.status].join(' ').toLowerCase().includes(q));
  }, [services, query]);

  const openForm = (service = null) => {
    setCurrentService(service);
    setIsEditing(true);
  };

  const closeForm = () => {
    setIsEditing(false);
    setCurrentService(null);
    setReloadKey((key) => key + 1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await api.delete(`/api/services/${id}`);
      toast.success('Service deleted');
      setReloadKey((key) => key + 1);
    } catch {
      toast.error('Failed to delete service');
    }
  };

  if (isEditing) {
    return <ServiceForm service={currentService} allServices={services || []} caseStudies={caseStudies || []} onBack={closeForm} />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary">Manage Services</h1>
          <p className="mt-1 text-text-secondary">Production CMS for service pages, SEO, pricing, workflow, media, and related content.</p>
        </div>
        <button onClick={() => openForm()} className="inline-flex items-center gap-2 rounded-xl bg-accent-blue px-4 py-2.5 text-sm font-bold text-white shadow-glow-blue">
          <Plus size={18} /> Add Service
        </button>
      </div>

      <label className="relative block max-w-md">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search services..." className={`${inputCls} pl-11`} />
      </label>

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-border-subtle bg-bg-elevated text-sm text-text-secondary">
              <tr>
                <th className="p-4 font-medium">Service</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Pricing</th>
                <th className="p-4 font-medium">SEO</th>
                <th className="p-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-text-muted">Loading services...</td></tr>
              ) : filteredServices.length ? filteredServices.map((service) => (
                <tr key={service._id} className="border-b border-border-subtle transition-colors hover:bg-bg-elevated/35">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${service.bg || 'bg-accent-blue/10'} ${service.color || 'text-accent-blue'}`}>{renderIcon(service.icon)}</div>
                      <div>
                        <p className="font-bold text-text-primary">{service.title}</p>
                        <p className="text-xs font-mono text-text-muted">/services/{service.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4"><span className="rounded-full border border-border-subtle bg-bg-elevated px-2.5 py-1 text-xs text-text-secondary">{service.category}</span></td>
                  <td className="p-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${service.status === 'Published' ? 'bg-accent-green/10 text-accent-green' : service.status === 'Archived' ? 'bg-bg-primary text-text-muted' : 'bg-yellow-400/10 text-yellow-400'}`}>{service.status}</span></td>
                  <td className="p-4 text-sm text-text-secondary">{service.pricingText || service.pricing || 'Custom'}</td>
                  <td className="p-4">{service.noIndex ? <span className="text-xs text-red-400">NoIndex</span> : <span className="text-xs text-accent-green">Index</span>}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <a href={`/services/${service.slug || service._id}`} target="_blank" rel="noreferrer" className="rounded-lg border border-border-subtle bg-bg-primary p-2 text-text-muted hover:text-accent-green"><Eye size={14} /></a>
                      <button onClick={() => openForm(service)} className="rounded-lg border border-border-subtle bg-bg-primary p-2 text-text-muted hover:text-accent-blue"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(service._id)} className="rounded-lg border border-border-subtle bg-bg-primary p-2 text-text-muted hover:text-red-400"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="p-8 text-center text-text-muted">No services found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageServices;
