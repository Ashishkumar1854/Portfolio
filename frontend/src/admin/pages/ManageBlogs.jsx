import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useApi from '../../hooks/useApi';
import api from '../../services/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ManageBlogs = () => {
  const { data: blogs, loading } = useApi('/api/blogs');
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await api.delete(`/api/blogs/${id}`);
        toast.success('Blog deleted');
        window.location.reload();
      } catch (error) {
        toast.error('Failed to delete blog');
      }
    }
  };

  const handleEdit = (blog) => {
    setCurrentBlog(blog);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentBlog(null);
    setIsEditing(true);
  };

  if (isEditing) {
    return <BlogForm blog={currentBlog} onBack={() => setIsEditing(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary">Manage Blogs</h1>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-accent-purple hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-all shadow-glow-purple"
        >
          <Plus size={18} /> New Post
        </button>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-elevated border-b border-border-subtle text-text-secondary text-sm">
                <th className="p-4 font-medium">Image</th>
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-text-muted">Loading blogs...</td>
                </tr>
              ) : blogs?.length > 0 ? (
                blogs.map((blog) => (
                  <tr key={blog._id} className="border-b border-border-subtle hover:bg-bg-elevated/50 transition-colors">
                    <td className="p-4">
                      <img src={blog.imageUrl} alt={blog.title} className="w-16 h-12 object-cover rounded bg-bg-secondary" />
                    </td>
                    <td className="p-4 text-text-primary font-medium">{blog.title}</td>
                    <td className="p-4 text-text-secondary">{new Date(blog.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleEdit(blog)} className="text-text-muted hover:text-accent-purple transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(blog._id)} className="text-text-muted hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-text-muted">No blogs found. Start writing!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const BlogForm = ({ blog, onBack }) => {
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    subtitle: blog?.subtitle || '',
    content: blog?.content || '',
    category: blog?.category || '',
  });
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('subtitle', formData.subtitle);
    data.append('content', formData.content);
    data.append('category', formData.category);
    if (image) data.append('image', image);

    try {
      if (blog) {
        await api.put(`/api/blogs/${blog._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Blog updated');
      } else {
        await api.post('/api/blogs', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Blog published');
      }
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-bg-card border border-border-subtle rounded-2xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{blog ? 'Edit Blog' : 'Create New Blog'}</h2>
        <button onClick={onBack} className="text-text-secondary hover:text-text-primary">Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-text-secondary mb-2">Title</label>
          <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2" required />
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-2">Subtitle / Excerpt</label>
          <textarea value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} rows={2} className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 resize-none" required />
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-2">Content (Rich Text)</label>
          <div className="bg-white text-black rounded-lg overflow-hidden">
            <ReactQuill theme="snow" value={formData.content} onChange={val => setFormData({...formData, content: val})} className="h-64 mb-12" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-2">Category (optional)</label>
          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2">
            <option value="">Select category</option>
            {['AI Automation', 'AI Agents', 'n8n', 'SaaS', 'Development', 'System Design', 'Startup Journey'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-2">Cover Image {blog && '(Leave empty to keep current)'}</label>
          {blog?.imageUrl && (
            <div className="mb-2">
              <img src={blog.imageUrl} alt="Current" className="h-16 rounded-lg border border-border-subtle object-cover mb-1" />
              <p className="text-xs text-text-muted font-mono break-all">{blog.imageUrl}</p>
            </div>
          )}
          <input type="file" onChange={e => setImage(e.target.files[0])} accept="image/*" className="w-full text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent-purple/10 file:text-accent-purple hover:file:bg-accent-purple/20" />
        </div>

        <button type="submit" disabled={isSubmitting} className="bg-accent-purple hover:bg-purple-600 text-white px-6 py-2 rounded-xl transition-all disabled:opacity-50 mt-8">
          {isSubmitting ? 'Saving...' : (blog ? 'Update Blog' : 'Publish Blog')}
        </button>
      </form>
    </div>
  );
};

export default ManageBlogs;
