import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useApi from '../../hooks/useApi';
import api from '../../services/api';

const ManageAchievements = () => {
  const { data: achievements, loading } = useApi('/api/achievements');
  const [isEditing, setIsEditing] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        await api.delete(`/api/achievements/${id}`);
        toast.success('Achievement deleted');
        window.location.reload();
      } catch {
        toast.error('Failed to delete achievement');
      }
    }
  };

  const handleEdit = (achievement) => {
    setCurrentAchievement(achievement);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentAchievement(null);
    setIsEditing(true);
  };

  if (isEditing) {
    return <AchievementForm achievement={currentAchievement} onBack={() => setIsEditing(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary">Manage Achievements</h1>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-bg-primary font-bold px-4 py-2 rounded-xl transition-all shadow-glow-yellow"
        >
          <Plus size={18} /> Add Stat
        </button>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-elevated border-b border-border-subtle text-text-secondary text-sm">
                <th className="p-4 font-medium">Value</th>
                <th className="p-4 font-medium">Label</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-text-muted">Loading achievements...</td>
                </tr>
              ) : achievements?.length > 0 ? (
                achievements.map((ach) => (
                  <tr key={ach._id} className="border-b border-border-subtle hover:bg-bg-elevated/50 transition-colors">
                    <td className="p-4 font-display font-bold text-xl text-text-primary">{ach.value}</td>
                    <td className="p-4 text-text-secondary">{ach.label}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleEdit(ach)} className="text-text-muted hover:text-yellow-500 transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(ach._id)} className="text-text-muted hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-text-muted">No achievements found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const AchievementForm = ({ achievement, onBack }) => {
  const [formData, setFormData] = useState({
    label: achievement?.label || '',
    value: achievement?.value || '',
    icon: achievement?.icon || 'star',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (achievement) {
        await api.put(`/api/achievements/${achievement._id}`, formData);
        toast.success('Achievement updated');
      } else {
        await api.post('/api/achievements', formData);
        toast.success('Achievement created');
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
        <h2 className="text-2xl font-bold">{achievement ? 'Edit Achievement' : 'Add New Achievement'}</h2>
        <button onClick={onBack} className="text-text-secondary hover:text-text-primary">Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-text-secondary mb-2">Value (e.g. 15+, 99%)</label>
          <input type="text" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 text-2xl font-display font-bold" required />
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-2">Label</label>
          <input type="text" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2" placeholder="e.g. Projects Built" required />
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-2">Icon Identifier (optional class)</label>
          <input type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2" required />
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-yellow-500 hover:bg-yellow-400 text-bg-primary font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-50">
          {isSubmitting ? 'Saving...' : 'Save Achievement'}
        </button>
      </form>
    </div>
  );
};

export default ManageAchievements;
