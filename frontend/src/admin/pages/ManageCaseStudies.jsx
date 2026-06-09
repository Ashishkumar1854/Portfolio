import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Image as ImageIcon, X as XIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import useApi from '../../hooks/useApi';
import api from '../../services/api';

/* ── List View ── */
const ManageCaseStudies = () => {
  const { data: caseStudies, loading } = useApi('/api/case-studies');
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

  const handleEdit = (cs) => { setCurrent(cs); setIsEditing(true); };
  const handleCreate = () => { setCurrent(null); setIsEditing(true); };

  if (isEditing) return <CaseStudyForm cs={current} onBack={() => setIsEditing(false)} />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary">Manage Case Studies</h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-accent-cyan hover:bg-cyan-500 text-bg-primary px-4 py-2 rounded-xl transition-all font-semibold"
        >
          <Plus size={18} /> New Case Study
        </button>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-elevated border-b border-border-subtle text-text-secondary text-sm">
                <th className="p-4 font-medium">Image</th>
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Featured</th>
                <th className="p-4 font-medium">Screenshots</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-text-muted">Loading...</td></tr>
              ) : caseStudies?.length > 0 ? (
                caseStudies.map((cs) => (
                  <tr key={cs._id} className="border-b border-border-subtle hover:bg-bg-elevated/50 transition-colors">
                    <td className="p-4">
                      {cs.imageUrl
                        ? <img src={cs.imageUrl} alt={cs.title} className="w-16 h-12 object-cover rounded bg-bg-secondary" />
                        : <div className="w-16 h-12 bg-bg-secondary rounded flex items-center justify-center text-text-muted"><ImageIcon size={18} /></div>
                      }
                    </td>
                    <td className="p-4 text-text-primary font-medium">{cs.title}</td>
                    <td className="p-4 text-text-secondary">{cs.category}</td>
                    <td className="p-4">
                      {cs.featured
                        ? <span className="text-accent-cyan bg-accent-cyan/10 px-2 py-1 rounded text-xs">Yes</span>
                        : <span className="text-text-muted text-xs">No</span>
                      }
                    </td>
                    <td className="p-4 text-text-secondary text-sm">{cs.screenshots?.length || 0} images</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleEdit(cs)} className="text-text-muted hover:text-accent-cyan transition-colors"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(cs._id)} className="text-text-muted hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="p-8 text-center text-text-muted">No case studies yet. Create your first one!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Create / Edit Form ── */
const CaseStudyForm = ({ cs, onBack }) => {
  const [formData, setFormData] = useState({
    title: cs?.title || '',
    subtitle: cs?.subtitle || '',
    overview: cs?.overview || '',
    problem: cs?.problem || '',
    research: cs?.research || '',
    architecture: cs?.architecture || '',
    implementation: cs?.implementation || '',
    results: cs?.results || '',
    lessonsLearned: cs?.lessonsLearned || '',
    techStack: cs?.techStack?.join(', ') || '',
    category: cs?.category || 'Other',
    featured: cs?.featured || false,
  });
  const [mainImage, setMainImage] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [removingScreenshot, setRemovingScreenshot] = useState(null);
  const [existingScreenshots, setExistingScreenshots] = useState(cs?.screenshots || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleRemoveExistingScreenshot = async (url) => {
    if (!window.confirm('Remove this screenshot?')) return;
    try {
      await api.delete(`/api/case-studies/${cs._id}/screenshot`, { data: { url } });
      setExistingScreenshots(prev => prev.filter(s => s !== url));
      toast.success('Screenshot removed');
    } catch {
      toast.error('Failed to remove screenshot');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (k === 'techStack') {
        data.append(k, JSON.stringify(v.split(',').map(t => t.trim()).filter(Boolean)));
      } else {
        data.append(k, v);
      }
    });
    if (mainImage) data.append('image', mainImage);
    screenshots.forEach(file => data.append('screenshots', file));

    try {
      if (cs) {
        await api.put(`/api/case-studies/${cs._id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
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

  const inputCls = "w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-blue transition-colors text-sm";
  const labelCls = "block text-sm text-text-secondary mb-2";

  return (
    <div className="bg-bg-card border border-border-subtle rounded-2xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary">{cs ? 'Edit Case Study' : 'Create Case Study'}</h2>
        <button onClick={onBack} className="text-text-secondary hover:text-text-primary text-sm">Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputCls} required />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className={inputCls}>
              {['SaaS', 'AI Automation', 'WhatsApp Automation', 'n8n', 'Full Stack', 'Other'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls}>Subtitle / Short Description</label>
          <textarea name="subtitle" value={formData.subtitle} onChange={handleChange} rows={2} className={`${inputCls} resize-none`} />
        </div>

        {/* Text sections */}
        {[
          { name: 'overview', label: 'Overview' },
          { name: 'problem', label: 'Problem' },
          { name: 'research', label: 'Research' },
          { name: 'architecture', label: 'Architecture' },
          { name: 'implementation', label: 'Implementation' },
          { name: 'results', label: 'Results' },
          { name: 'lessonsLearned', label: 'Lessons Learned' },
        ].map(field => (
          <div key={field.name}>
            <label className={labelCls}>{field.label}</label>
            <textarea name={field.name} value={formData[field.name]} onChange={handleChange} rows={4} className={`${inputCls} resize-y`} />
          </div>
        ))}

        <div>
          <label className={labelCls}>Tech Stack (comma separated)</label>
          <input type="text" name="techStack" value={formData.techStack} onChange={handleChange} className={inputCls} placeholder="React, Node.js, PostgreSQL, n8n" />
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3">
          <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4" />
          <label htmlFor="featured" className="text-sm text-text-secondary">Featured Case Study (shows on homepage)</label>
        </div>

        {/* Main image */}
        <div>
          <label className={labelCls}>Main Image {cs && '(leave empty to keep current)'}</label>
          {cs?.imageUrl && (
            <div className="mb-3">
              <img src={cs.imageUrl} alt="Current" className="h-20 rounded-lg border border-border-subtle object-cover" />
              <p className="text-xs text-text-muted mt-1 font-mono break-all">{cs.imageUrl}</p>
            </div>
          )}
          <input type="file" onChange={e => setMainImage(e.target.files[0])} accept="image/*" className="w-full text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent-cyan/10 file:text-accent-cyan hover:file:bg-accent-cyan/20" />
        </div>

        {/* Screenshots */}
        <div>
          <label className={labelCls}>Screenshots (multiple images, added to gallery)</label>
          {existingScreenshots.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {existingScreenshots.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt={`Screenshot ${i + 1}`} className="w-24 h-16 rounded-lg object-cover border border-border-subtle" />
                  {cs && (
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingScreenshot(url)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XIcon size={10} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          <input
            type="file"
            multiple
            onChange={e => setScreenshots(Array.from(e.target.files))}
            accept="image/*"
            className="w-full text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent-blue/10 file:text-accent-blue hover:file:bg-accent-blue/20"
          />
          {screenshots.length > 0 && (
            <p className="text-xs text-text-muted mt-1">{screenshots.length} new screenshot(s) selected</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-accent-cyan hover:bg-cyan-500 text-bg-primary px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 mt-4"
        >
          {isSubmitting ? 'Saving...' : cs ? 'Update Case Study' : 'Create Case Study'}
        </button>
      </form>
    </div>
  );
};

export default ManageCaseStudies;
