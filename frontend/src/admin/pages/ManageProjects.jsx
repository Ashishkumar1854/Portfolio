import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import useApi from '../../hooks/useApi';
import api from '../../services/api';

const ManageProjects = () => {
  const { data: projects, loading } = useApi('/api/projects');
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/api/projects/${id}`);
        toast.success('Project deleted');
        window.location.reload(); // simple reload for now, ideally update state
      } catch (error) {
        toast.error('Failed to delete project');
      }
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
    return <ProjectForm project={currentProject} onBack={() => setIsEditing(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary">Manage Projects</h1>
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
                <th className="p-4 font-medium">Image</th>
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Featured</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-text-muted">Loading projects...</td>
                </tr>
              ) : projects?.length > 0 ? (
                projects.map((project) => (
                  <tr key={project._id} className="border-b border-border-subtle hover:bg-bg-elevated/50 transition-colors">
                    <td className="p-4">
                      <img src={project.imageUrl} alt={project.title} className="w-16 h-12 object-cover rounded bg-bg-secondary" />
                    </td>
                    <td className="p-4 text-text-primary font-medium">{project.title}</td>
                    <td className="p-4 text-text-secondary">{project.category}</td>
                    <td className="p-4 text-text-secondary">
                      {project.featured ? <span className="text-accent-purple bg-accent-purple/10 px-2 py-1 rounded text-xs">Yes</span> : 'No'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleEdit(project)} className="text-text-muted hover:text-accent-blue transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(project._id)} className="text-text-muted hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-text-muted">No projects found. Create one!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectForm = ({ project, onBack }) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    problem: project?.problem || '',
    tech: project?.tech?.join(', ') || '',
    githubUrl: project?.githubUrl || '',
    liveUrl: project?.liveUrl || '',
    category: project?.category || 'Frontend',
    featured: project?.featured || false,
  });
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('problem', formData.problem);
    data.append('tech', JSON.stringify(formData.tech.split(',').map(t => t.trim())));
    data.append('githubUrl', formData.githubUrl);
    data.append('liveUrl', formData.liveUrl);
    data.append('category', formData.category);
    data.append('featured', formData.featured);
    if (image) data.append('image', image);

    try {
      if (project) {
        await api.put(`/api/projects/${project._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Project updated');
      } else {
        await api.post('/api/projects', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Project created');
      }
      window.location.reload(); // simple reload
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-bg-card border border-border-subtle rounded-2xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{project ? 'Edit Project' : 'Create Project'}</h2>
        <button onClick={onBack} className="text-text-secondary hover:text-text-primary">Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2" required />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Category</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2">
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Full-Stack">Full-Stack</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-2">Description / Problem Statement</label>
          <textarea value={formData.problem} onChange={e => setFormData({...formData, problem: e.target.value})} rows={3} className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 resize-none" required />
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-2">Technologies (comma separated)</label>
          <input type="text" value={formData.tech} onChange={e => setFormData({...formData, tech: e.target.value})} className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2" placeholder="React, Node.js, MongoDB" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-text-secondary mb-2">GitHub URL</label>
            <input type="url" value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2" required />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Live URL (Optional)</label>
            <input type="url" value={formData.liveUrl} onChange={e => setFormData({...formData, liveUrl: e.target.value})} className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2" />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex-1">
            <label className="block text-sm text-text-secondary mb-2">Project Image {project && '(Leave empty to keep current)'}</label>
            <input type="file" onChange={e => setImage(e.target.files[0])} accept="image/*" className="w-full text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent-blue/10 file:text-accent-blue hover:file:bg-accent-blue/20" />
          </div>
          <div className="flex items-center mt-6">
            <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="mr-2" />
            <label htmlFor="featured" className="text-sm text-text-secondary">Featured Project</label>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="bg-accent-blue hover:bg-blue-600 text-white px-6 py-2 rounded-xl transition-all disabled:opacity-50">
          {isSubmitting ? 'Saving...' : 'Save Project'}
        </button>
      </form>
    </div>
  );
};

export default ManageProjects;
