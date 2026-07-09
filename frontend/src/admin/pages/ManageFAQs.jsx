import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useApi from '../../hooks/useApi';
import api from '../../services/api';

const ManageFAQs = () => {
  const { data: faqs, loading } = useApi('/api/faqs');
  const [isEditing, setIsEditing] = useState(false);
  const [currentFaq, setCurrentFaq] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await api.delete(`/api/faqs/${id}`);
        toast.success('FAQ deleted successfully');
        window.location.reload();
      } catch {
        toast.error('Failed to delete FAQ');
      }
    }
  };

  const handleEdit = (faq) => {
    setCurrentFaq(faq);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentFaq(null);
    setIsEditing(true);
  };

  if (isEditing) {
    return <FaqForm faq={currentFaq} onBack={() => setIsEditing(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary">Manage FAQs</h1>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-accent-blue hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-glow-blue"
        >
          <Plus size={18} /> Add FAQ
        </button>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-elevated border-b border-border-subtle text-text-secondary text-sm">
                <th className="p-4 font-medium w-16">Order</th>
                <th className="p-4 font-medium">Question</th>
                <th className="p-4 font-medium">Answer</th>
                <th className="p-4 font-medium text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-text-muted">Loading FAQs...</td>
                </tr>
              ) : faqs?.length > 0 ? (
                faqs.map((faq) => (
                  <tr key={faq._id} className="border-b border-border-subtle hover:bg-bg-elevated/50 transition-colors">
                    <td className="p-4 text-text-secondary font-mono">{faq.order}</td>
                    <td className="p-4 font-semibold text-text-primary">{faq.question}</td>
                    <td className="p-4 text-text-secondary text-sm line-clamp-2 mt-2">{faq.answer}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleEdit(faq)} className="text-text-muted hover:text-accent-blue transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(faq._id)} className="text-text-muted hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-text-muted">No FAQs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const FaqForm = ({ faq, onBack }) => {
  const [formData, setFormData] = useState({
    question: faq?.question || '',
    answer: faq?.answer || '',
    order: faq?.order || 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (faq) {
        await api.put(`/api/faqs/${faq._id}`, formData);
        toast.success('FAQ updated successfully');
      } else {
        await api.post('/api/faqs', formData);
        toast.success('FAQ created successfully');
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
        <h2 className="text-2xl font-bold">{faq ? 'Edit FAQ' : 'Add New FAQ'}</h2>
        <button onClick={onBack} className="text-text-secondary hover:text-text-primary">Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-text-secondary mb-2">Question</label>
          <input 
            type="text" 
            value={formData.question} 
            onChange={e => setFormData({...formData, question: e.target.value})} 
            className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 text-text-primary" 
            placeholder="e.g. How much does development cost?"
            required 
          />
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-2">Answer</label>
          <textarea 
            rows={4}
            value={formData.answer} 
            onChange={e => setFormData({...formData, answer: e.target.value})} 
            className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 text-text-primary leading-relaxed" 
            placeholder="Provide a detailed explanation..."
            required 
          />
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-2">Order (Numerical sorting rank)</label>
          <input 
            type="number" 
            value={formData.order} 
            onChange={e => setFormData({...formData, order: Number(e.target.value)})} 
            className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 text-text-primary" 
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-accent-blue hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save FAQ'}
        </button>
      </form>
    </div>
  );
};

export default ManageFAQs;
