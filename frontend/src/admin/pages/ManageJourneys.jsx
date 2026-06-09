import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useApi from '../../hooks/useApi';
import api from '../../services/api';

const ManageJourneys = () => {
  const { data: journeys, loading } = useApi('/api/journey');
  const [isEditing, setIsEditing] = useState(false);
  const [currentJourney, setCurrentJourney] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this timeline event?')) {
      try {
        await api.delete(`/api/journey/${id}`);
        toast.success('Event deleted');
        window.location.reload();
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const handleEdit = (journey) => {
    setCurrentJourney(journey);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentJourney(null);
    setIsEditing(true);
  };

  if (isEditing) {
    return <JourneyForm journey={currentJourney} onBack={() => setIsEditing(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary">Manage Journey</h1>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-text-primary hover:bg-gray-300 text-bg-primary font-medium px-4 py-2 rounded-xl transition-all"
        >
          <Plus size={18} /> Add Event
        </button>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-elevated border-b border-border-subtle text-text-secondary text-sm">
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Year</th>
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-text-muted">Loading timeline...</td>
                </tr>
              ) : journeys?.length > 0 ? (
                journeys.map((journey) => (
                  <tr key={journey._id} className="border-b border-border-subtle hover:bg-bg-elevated/50 transition-colors">
                    <td className="p-4 text-text-muted">{journey.order}</td>
                    <td className="p-4 font-mono text-accent-blue">{journey.year}</td>
                    <td className="p-4 text-text-primary">{journey.title}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleEdit(journey)} className="text-text-muted hover:text-white transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(journey._id)} className="text-text-muted hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-text-muted">No timeline events found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const JourneyForm = ({ journey, onBack }) => {
  const [formData, setFormData] = useState({
    year: journey?.year || '',
    title: journey?.title || '',
    description: journey?.description || '',
    order: journey?.order || 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (journey) {
        await api.put(`/api/journey/${journey._id}`, formData);
        toast.success('Event updated');
      } else {
        await api.post('/api/journey', formData);
        toast.success('Event created');
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
        <h2 className="text-2xl font-bold">{journey ? 'Edit Event' : 'Add New Event'}</h2>
        <button onClick={onBack} className="text-text-secondary hover:text-text-primary">Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Year / Date</label>
            <input type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2" placeholder="e.g. 2021 - Present" required />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Order (Sorting)</label>
            <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: Number(e.target.value)})} className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2" required />
          </div>
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-2">Title / Role</label>
          <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2" placeholder="e.g. Senior Frontend Developer" required />
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-2">Description</label>
          <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 resize-none" required />
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-text-primary hover:bg-gray-300 text-bg-primary font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-50">
          {isSubmitting ? 'Saving...' : 'Save Event'}
        </button>
      </form>
    </div>
  );
};

export default ManageJourneys;
