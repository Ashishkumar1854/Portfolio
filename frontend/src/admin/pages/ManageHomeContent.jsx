import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Edit2, Trash2, Sliders, Award, Workflow } from 'lucide-react';
import toast from 'react-hot-toast';
import useApi from '../../hooks/useApi';
import api from '../../services/api';

const ManageHomeContent = () => {
  const [activeTab, setActiveTab] = useState('hero');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Manage Home Content</h1>
          <p className="text-text-secondary text-sm">Dynamic settings and content sections for your landing page.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-bg-card border border-border-subtle p-1 rounded-2xl">
          {[
            { id: 'hero', label: 'Hero & CTA Config', icon: <Sliders size={16} /> },
            { id: 'trust', label: 'Trust Badges', icon: <Award size={16} /> },
            { id: 'process', label: 'Process Steps', icon: <Workflow size={16} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-accent-blue text-white shadow-glow-blue'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-bg-card/50 border border-border-subtle rounded-3xl p-6 md:p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'hero' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <HeroCtaForm />
            </motion.div>
          )}

          {activeTab === 'trust' && (
            <motion.div
              key="trust"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TrustBadgesCrud />
            </motion.div>
          )}

          {activeTab === 'process' && (
            <motion.div
              key="process"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ProcessStepsCrud />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ── TAB 1: HERO & CTA SINGLETON CONFIG FORM ── */
const HeroCtaForm = () => {
  const { data: config, loading } = useApi('/api/home-config');
  const [formData, setFormData] = useState({
    heroBadge: '',
    heroTitle: '',
    heroSubtitle: '',
    heroCtaText: '',
    heroCtaLink: '',
    heroSecondaryText: '',
    heroSecondaryLink: '',
    heroTechBadges: '',
    ctaTitle: '',
    ctaSubtitle: '',
    ctaBtnText: '',
    ctaBtnLink: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (config) {
      setFormData({
        heroBadge: config.heroBadge || '',
        heroTitle: config.heroTitle || '',
        heroSubtitle: config.heroSubtitle || '',
        heroCtaText: config.heroCtaText || '',
        heroCtaLink: config.heroCtaLink || '',
        heroSecondaryText: config.heroSecondaryText || '',
        heroSecondaryLink: config.heroSecondaryLink || '',
        heroTechBadges: config.heroTechBadges?.join(', ') || '',
        ctaTitle: config.ctaTitle || '',
        ctaSubtitle: config.ctaSubtitle || '',
        ctaBtnText: config.ctaBtnText || '',
        ctaBtnLink: config.ctaBtnLink || '',
      });
    }
  }, [config]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        heroTechBadges: formData.heroTechBadges
          .split(',')
          .map(t => t.trim())
          .filter(t => t.length > 0),
      };
      await api.put('/api/home-config', payload);
      toast.success('Homepage configuration saved!');
    } catch {
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center text-text-muted py-8">Loading configuration...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Hero Section settings */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-accent-blue border-b border-border-subtle pb-2">Hero Section Content</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Greeting Badge (e.g. Hello World 👋)</label>
            <input
              type="text"
              value={formData.heroBadge}
              onChange={e => setFormData({ ...formData, heroBadge: e.target.value })}
              className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Technology List Badges (Comma-separated)</label>
            <input
              type="text"
              value={formData.heroTechBadges}
              onChange={e => setFormData({ ...formData, heroTechBadges: e.target.value })}
              className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 font-mono text-xs"
              placeholder="n8n, React, Node.js"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-text-secondary mb-2">Hero Headline</label>
            <input
              type="text"
              value={formData.heroTitle}
              onChange={e => setFormData({ ...formData, heroTitle: e.target.value })}
              className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 text-lg font-bold"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-text-secondary mb-2">Hero Paragraph Description</label>
            <textarea
              rows={3}
              value={formData.heroSubtitle}
              onChange={e => setFormData({ ...formData, heroSubtitle: e.target.value })}
              className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 leading-relaxed"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Primary CTA Button Text</label>
            <input
              type="text"
              value={formData.heroCtaText}
              onChange={e => setFormData({ ...formData, heroCtaText: e.target.value })}
              className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Primary CTA Button URL/Link</label>
            <input
              type="text"
              value={formData.heroCtaLink}
              onChange={e => setFormData({ ...formData, heroCtaLink: e.target.value })}
              className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Secondary CTA Button Text</label>
            <input
              type="text"
              value={formData.heroSecondaryText}
              onChange={e => setFormData({ ...formData, heroSecondaryText: e.target.value })}
              className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Secondary CTA Button URL/Link</label>
            <input
              type="text"
              value={formData.heroSecondaryLink}
              onChange={e => setFormData({ ...formData, heroSecondaryLink: e.target.value })}
              className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2"
              required
            />
          </div>
        </div>
      </div>

      {/* Final CTA Settings */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-accent-purple border-b border-border-subtle pb-2">Final CTA Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm text-text-secondary mb-2">CTA Headline</label>
            <input
              type="text"
              value={formData.ctaTitle}
              onChange={e => setFormData({ ...formData, ctaTitle: e.target.value })}
              className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 font-bold"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-text-secondary mb-2">CTA Description Subtext</label>
            <textarea
              rows={2}
              value={formData.ctaSubtitle}
              onChange={e => setFormData({ ...formData, ctaSubtitle: e.target.value })}
              className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">CTA Button Text</label>
            <input
              type="text"
              value={formData.ctaBtnText}
              onChange={e => setFormData({ ...formData, ctaBtnText: e.target.value })}
              className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">CTA Button URL/Link</label>
            <input
              type="text"
              value={formData.ctaBtnLink}
              onChange={e => setFormData({ ...formData, ctaBtnLink: e.target.value })}
              className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-accent-blue hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-glow-blue disabled:opacity-50"
      >
        <Save size={18} />
        {saving ? 'Saving changes...' : 'Save Configuration'}
      </button>
    </form>
  );
};

/* ── TAB 2: TRUST STRIP BADGES CRUD ── */
const TrustBadgesCrud = () => {
  const { data: badges, loading } = useApi('/api/trust-badges');
  const [editing, setEditing] = useState(false);
  const [currentBadge, setCurrentBadge] = useState(null);

  const [form, setForm] = useState({ icon: '🏆', text: '', order: 0 });
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = () => {
    setCurrentBadge(null);
    setForm({ icon: '🏆', text: '', order: badges ? badges.length : 0 });
    setEditing(true);
  };

  const handleEdit = (badge) => {
    setCurrentBadge(badge);
    setForm({ icon: badge.icon, text: badge.text, order: badge.order });
    setEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this highlight?')) {
      try {
        await api.delete(`/api/trust-badges/${id}`);
        toast.success('Highlight removed');
        window.location.reload();
      } catch {
        toast.error('Failed to delete');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (currentBadge) {
        await api.put(`/api/trust-badges/${currentBadge._id}`, form);
        toast.success('Highlight updated');
      } else {
        await api.post('/api/trust-badges', form);
        toast.success('Highlight created');
      }
      window.location.reload();
    } catch {
      toast.error('Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {editing ? (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-bold">{currentBadge ? 'Edit Trust Badge' : 'Add Trust Badge'}</h4>
            <button onClick={() => setEditing(false)} className="text-text-secondary hover:text-text-primary">Cancel</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Emoji Icon (e.g. 🏆, 🚀, 🎓)</label>
              <input
                type="text"
                value={form.icon}
                onChange={e => setForm({ ...form, icon: e.target.value })}
                className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 text-2xl text-center w-20"
                maxLength={2}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Badge Highlight Text</label>
              <input
                type="text"
                value={form.text}
                onChange={e => setForm({ ...form, text: e.target.value })}
                className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2"
                placeholder="e.g. Founder of Phoneo"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Display Order</label>
              <input
                type="number"
                value={form.order}
                onChange={e => setForm({ ...form, order: Number(e.target.value) })}
                className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-accent-blue hover:bg-blue-500 text-white font-bold py-2 rounded-xl"
            >
              {submitting ? 'Saving...' : 'Save Badge'}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-bold">Trust strip badges list</h4>
            <button
              onClick={handleCreate}
              className="flex items-center gap-1 bg-accent-blue text-white font-medium text-xs px-3 py-1.5 rounded-lg"
            >
              <Plus size={14} /> Add Badge
            </button>
          </div>

          <div className="bg-bg-primary/50 rounded-2xl overflow-hidden border border-border-subtle">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-bg-elevated border-b border-border-subtle text-text-secondary text-xs">
                  <th className="p-3 w-16">Order</th>
                  <th className="p-3 w-16 text-center">Icon</th>
                  <th className="p-3">Badge Label</th>
                  <th className="p-3 text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-text-muted">Loading highlights...</td>
                  </tr>
                ) : badges?.length > 0 ? (
                  badges.map((b) => (
                    <tr key={b._id} className="border-b border-border-subtle hover:bg-bg-elevated/40 text-sm">
                      <td className="p-3 text-text-secondary font-mono">{b.order}</td>
                      <td className="p-3 text-2xl text-center">{b.icon}</td>
                      <td className="p-3 text-text-primary font-medium">{b.text}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => handleEdit(b)} className="text-text-muted hover:text-accent-blue">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(b._id)} className="text-text-muted hover:text-red-500">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-text-muted">No badges added yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── TAB 3: MY PROCESS TIMELINE STEPS CRUD ── */
const ProcessStepsCrud = () => {
  const { data: steps, loading } = useApi('/api/process-steps');
  const [editing, setEditing] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);

  const [form, setForm] = useState({ title: '', desc: '', order: 0 });
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = () => {
    setCurrentStep(null);
    setForm({ title: '', desc: '', order: steps ? steps.length : 0 });
    setEditing(true);
  };

  const handleEdit = (step) => {
    setCurrentStep(step);
    setForm({ title: step.title, desc: step.desc, order: step.order });
    setEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this workflow process phase?')) {
      try {
        await api.delete(`/api/process-steps/${id}`);
        toast.success('Step deleted');
        window.location.reload();
      } catch {
        toast.error('Failed to delete step');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (currentStep) {
        await api.put(`/api/process-steps/${currentStep._id}`, form);
        toast.success('Step updated');
      } else {
        await api.post('/api/process-steps', form);
        toast.success('Step created');
      }
      window.location.reload();
    } catch {
      toast.error('Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {editing ? (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-bold">{currentStep ? 'Edit Process Step' : 'Add Process Step'}</h4>
            <button onClick={() => setEditing(false)} className="text-text-secondary hover:text-text-primary">Cancel</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Step Title</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2"
                placeholder="e.g. Architecture / Development"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Step Description</label>
              <textarea
                rows={3}
                value={form.desc}
                onChange={e => setForm({ ...form, desc: e.target.value })}
                className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2"
                placeholder="Provide details about this milestone phase..."
                required
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Display Order</label>
              <input
                type="number"
                value={form.order}
                onChange={e => setForm({ ...form, order: Number(e.target.value) })}
                className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-accent-blue hover:bg-blue-500 text-white font-bold py-2 rounded-xl"
            >
              {submitting ? 'Saving...' : 'Save Step'}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-bold">My workflow timeline steps list</h4>
            <button
              onClick={handleCreate}
              className="flex items-center gap-1 bg-accent-blue text-white font-medium text-xs px-3 py-1.5 rounded-lg"
            >
              <Plus size={14} /> Add Step
            </button>
          </div>

          <div className="bg-bg-primary/50 rounded-2xl overflow-hidden border border-border-subtle">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-bg-elevated border-b border-border-subtle text-text-secondary text-xs">
                  <th className="p-3 w-16">Order</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-text-muted">Loading steps...</td>
                  </tr>
                ) : steps?.length > 0 ? (
                  steps.map((s) => (
                    <tr key={s._id} className="border-b border-border-subtle hover:bg-bg-elevated/40 text-sm">
                      <td className="p-3 text-text-secondary font-mono">{s.order}</td>
                      <td className="p-3 text-text-primary font-bold">{s.title}</td>
                      <td className="p-3 text-text-secondary text-xs line-clamp-1 mt-1.5">{s.desc}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => handleEdit(s)} className="text-text-muted hover:text-accent-blue">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(s._id)} className="text-text-muted hover:text-red-500">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-text-muted">No process steps added yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHomeContent;
