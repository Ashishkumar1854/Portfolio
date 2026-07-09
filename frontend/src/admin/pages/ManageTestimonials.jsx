import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import useApi from '../../hooks/useApi';
import api from '../../services/api';

const ManageTestimonials = () => {
  const { data: testimonials, loading } = useApi('/api/testimonials');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await api.delete(`/api/testimonials/${id}`);
        toast.success('Testimonial deleted');
        window.location.reload();
      } catch {
        toast.error('Failed to delete testimonial');
      }
    }
  };

  const handleToggleApprove = async (testimonial) => {
    try {
      await api.put(`/api/testimonials/${testimonial._id}`, {
        approved: !testimonial.approved
      });
      toast.success(`Testimonial ${!testimonial.approved ? 'approved' : 'hidden'}`);
      window.location.reload();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleEdit = (testimonial) => {
    setCurrentTestimonial(testimonial);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentTestimonial(null);
    setIsEditing(true);
  };

  if (isEditing) {
    return <TestimonialForm testimonial={currentTestimonial} onBack={() => setIsEditing(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary">Manage Testimonials</h1>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-text-primary hover:bg-gray-300 text-bg-primary font-medium px-4 py-2 rounded-xl transition-all"
        >
          <Plus size={18} /> Add Testimonial
        </button>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-elevated border-b border-border-subtle text-text-secondary text-sm">
                <th className="p-4 font-medium">Client</th>
                <th className="p-4 font-medium">Project</th>
                <th className="p-4 font-medium">Rating</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-text-muted">Loading testimonials...</td>
                </tr>
              ) : testimonials?.length > 0 ? (
                testimonials.map((test) => (
                  <tr key={test._id} className="border-b border-border-subtle hover:bg-bg-elevated/50 transition-colors">
                    <td className="p-4 text-text-primary font-medium">{test.clientName}</td>
                    <td className="p-4 text-text-secondary">{test.projectTitle}</td>
                    <td className="p-4 text-yellow-400">{'★'.repeat(test.rating)}</td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleToggleApprove(test)}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md border ${
                          test.approved ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'
                        }`}
                      >
                        {test.approved ? <><CheckCircle size={12} /> Public</> : <><XCircle size={12} /> Hidden</>}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleEdit(test)} className="text-text-muted hover:text-white transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(test._id)} className="text-text-muted hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-text-muted">No testimonials found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialForm = ({ testimonial, onBack }) => {
  const [formData, setFormData] = useState({
    clientName: testimonial?.clientName || '',
    projectTitle: testimonial?.projectTitle || '',
    content: testimonial?.content || '',
    rating: testimonial?.rating || 5,
    approved: testimonial ? testimonial.approved : true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (testimonial) {
        await api.put(`/api/testimonials/${testimonial._id}`, formData);
        toast.success('Testimonial updated');
      } else {
        await api.post('/api/testimonials', formData);
        toast.success('Testimonial created');
      }
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-bg-card border border-border-subtle rounded-2xl p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{testimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
        <button onClick={onBack} className="text-text-secondary hover:text-text-primary">Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Client Name</label>
            <input type="text" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2" required />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Project Title</label>
            <input type="text" value={formData.projectTitle} onChange={e => setFormData({...formData, projectTitle: e.target.value})} className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2" required />
          </div>
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-2">Review Content</label>
          <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows={4} className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 resize-none" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Rating (1-5)</label>
            <input type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2" required />
          </div>
          <div className="flex items-center mt-6">
            <input type="checkbox" id="approved" checked={formData.approved} onChange={e => setFormData({...formData, approved: e.target.checked})} className="mr-2" />
            <label htmlFor="approved" className="text-sm text-text-secondary">Approved (Visible on site)</label>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-text-primary hover:bg-gray-300 text-bg-primary font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-50">
          {isSubmitting ? 'Saving...' : 'Save Testimonial'}
        </button>
      </form>
    </div>
  );
};

export default ManageTestimonials;
