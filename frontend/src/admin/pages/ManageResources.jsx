import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Globe, FileText, Lock, Unlock, Download, Eye } from 'lucide-react';
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
  'Business Automation Blueprints'
];

const ManageResources = () => {
  const { data: resources, loading } = useApi('/api/resources');
  const [isEditing, setIsEditing] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await api.delete(`/api/resources/${id}`);
        toast.success('Resource deleted successfully');
        window.location.reload();
      } catch (error) {
        toast.error('Failed to delete resource');
      }
    }
  };

  const handleEdit = (resource) => {
    setCurrentResource(resource);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentResource(null);
    setIsEditing(true);
  };

  if (isEditing) {
    return <ResourceForm resource={currentResource} onBack={() => setIsEditing(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary">Manage Resources</h1>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-accent-cyan hover:bg-cyan-600 text-bg-primary font-medium px-4 py-2 rounded-xl transition-all shadow-glow-cyan cursor-pointer"
        >
          <Plus size={18} /> Add Resource
        </button>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-elevated border-b border-border-subtle text-text-secondary text-sm">
                <th className="p-4 font-medium">Resource Title</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Access Tier</th>
                <th className="p-4 font-medium">Downloads / Views</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-text-muted">Loading resources list...</td>
                </tr>
              ) : resources?.length > 0 ? (
                resources.map((res) => (
                  <tr key={res._id} className="border-b border-border-subtle hover:bg-bg-elevated/50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-text-primary">{res.title}</div>
                      <div className="text-[10px] text-text-muted font-mono">{res.slug}</div>
                    </td>
                    <td className="p-4 text-text-secondary text-sm">{res.category}</td>
                    <td className="p-4">
                      {res.isPremium ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-accent-amber/10 border border-accent-amber/20 text-accent-amber">
                          <Lock size={10} /> Premium
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-accent-green/10 border border-accent-green/20 text-accent-green">
                          <Unlock size={10} /> Free
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-text-secondary text-xs font-mono">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Download size={12} /> {res.downloads}</span>
                        <span className="flex items-center gap-1"><Eye size={12} /> {res.views}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleEdit(res)} className="text-text-muted hover:text-accent-cyan transition-colors" title="Edit">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(res._id)} className="text-text-muted hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-text-muted">No resources created yet.</td>
                </tr>
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
    category: resource?.category || 'AI Agent Templates',
    thumbnail: resource?.thumbnail || '',
    downloadUrl: resource?.downloadUrl || '',
    isPremium: resource?.isPremium || false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const autoGenerateSlug = (titleText) => {
    return titleText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (val) => {
    setFormData({
      ...formData,
      title: val,
      slug: resource ? formData.slug : autoGenerateSlug(val) // auto-generate only for new creations
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (resource) {
        await api.put(`/api/resources/${resource._id}`, formData);
        toast.success('Resource updated successfully');
      } else {
        await api.post('/api/resources', formData);
        toast.success('Resource created successfully');
      }
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-bg-card border border-border-subtle rounded-2xl p-8 max-w-2xl mx-auto shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{resource ? 'Edit Resource Template' : 'Add New Resource Template'}</h2>
        <button onClick={onBack} className="text-text-secondary hover:text-text-primary">Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Resource Title</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={e => handleTitleChange(e.target.value)} 
              className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 text-sm focus:border-accent-cyan outline-none" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Resource Slug (Unique URL Path)</label>
            <input 
              type="text" 
              value={formData.slug} 
              onChange={e => setFormData({...formData, slug: e.target.value.replace(/\s+/g, '-')})} 
              className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 text-sm focus:border-accent-cyan outline-none" 
              required 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-2">Description</label>
          <textarea 
            rows="4" 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
            className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 text-sm focus:border-accent-cyan outline-none" 
            required 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Category Type</label>
            <select 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})} 
              className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 text-sm focus:border-accent-cyan outline-none"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Download File or Redirect URL</label>
            <input 
              type="text" 
              placeholder="e.g. GitHub URL or Cloudinary file link"
              value={formData.downloadUrl} 
              onChange={e => setFormData({...formData, downloadUrl: e.target.value})} 
              className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 text-sm focus:border-accent-cyan outline-none" 
              required 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-2">Thumbnail Image URL (Optional)</label>
          <input 
            type="text" 
            placeholder="https://image-url..."
            value={formData.thumbnail} 
            onChange={e => setFormData({...formData, thumbnail: e.target.value})} 
            className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 text-sm focus:border-accent-cyan outline-none" 
          />
        </div>

        <div>
          <label className="flex items-center gap-2.5 text-sm text-text-secondary cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={formData.isPremium} 
              onChange={e => setFormData({...formData, isPremium: e.target.checked})} 
              className="w-4 h-4 rounded border-border-subtle bg-bg-primary text-accent-cyan accent-accent-cyan cursor-pointer" 
            />
            Premium Resource (Locks file behind authentication requirement)
          </label>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-accent-cyan hover:bg-cyan-600 text-bg-primary font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-glow-cyan"
        >
          {isSubmitting ? 'Saving...' : 'Save Resource'}
        </button>
      </form>
    </div>
  );
};

export default ManageResources;
