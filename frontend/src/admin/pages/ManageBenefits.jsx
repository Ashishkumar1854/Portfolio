import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Edit2, Trash2, Gift, Shield, Sparkles, 
  Compass, Cpu, MessageSquare, Users, Bell, Trophy,
  BookOpen, Star, Award, Zap, CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import useApi from '../../hooks/useApi';
import api from '../../services/api';

const BENEFIT_ICONS = [
  { name: 'Gift', icon: Gift },
  { name: 'Shield', icon: Shield },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Compass', icon: Compass },
  { name: 'Cpu', icon: Cpu },
  { name: 'MessageSquare', icon: MessageSquare },
  { name: 'Users', icon: Users },
  { name: 'Bell', icon: Bell },
  { name: 'Trophy', icon: Trophy },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'Star', icon: Star },
  { name: 'Award', icon: Award },
  { name: 'Zap', icon: Zap },
  { name: 'CheckCircle2', icon: CheckCircle2 }
];

const ManageBenefits = () => {
  const { data: benefits, loading } = useApi('/api/benefits');
  const [isEditing, setIsEditing] = useState(false);
  const [currentBenefit, setCurrentBenefit] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this benefit? This will not remove sent notification emails, but will update the sign-up page benefits list.')) {
      try {
        await api.delete(`/api/benefits/${id}`);
        toast.success('Benefit deleted successfully');
        window.location.reload();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete benefit');
      }
    }
  };

  const handleEdit = (benefit) => {
    setCurrentBenefit(benefit);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentBenefit(null);
    setIsEditing(true);
  };

  const renderIcon = (iconName) => {
    const found = BENEFIT_ICONS.find(item => item.name === iconName);
    if (found) {
      const IconComponent = found.icon;
      return <IconComponent size={20} />;
    }
    return <Gift size={20} />;
  };

  if (isEditing) {
    return <BenefitForm benefit={currentBenefit} onBack={() => setIsEditing(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Manage Community Benefits</h1>
          <p className="text-sm text-text-secondary mt-1">Configure the incentives shown to new subscribers on the community signup board.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-accent-blue hover:bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl transition-all shadow-glow-blue cursor-pointer"
        >
          <Plus size={18} /> Add Benefit
        </button>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-elevated border-b border-border-subtle text-text-secondary text-sm">
                <th className="p-4 font-medium w-16">Order</th>
                <th className="p-4 font-medium w-20">Icon</th>
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Description</th>
                <th className="p-4 font-medium text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-text-muted">Loading benefits...</td>
                </tr>
              ) : benefits?.length > 0 ? (
                benefits.map((benefit) => (
                  <tr key={benefit._id} className="border-b border-border-subtle hover:bg-bg-elevated/50 transition-colors">
                    <td className="p-4 text-text-secondary font-mono">{benefit.order}</td>
                    <td className="p-4">
                      <div className="p-2 bg-accent-blue/10 text-accent-blue rounded-lg w-fit">
                        {renderIcon(benefit.icon)}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-text-primary">{benefit.title}</td>
                    <td className="p-4 text-text-secondary text-sm max-w-sm truncate">{benefit.description}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleEdit(benefit)} className="text-text-muted hover:text-accent-blue transition-colors cursor-pointer">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(benefit._id)} className="text-text-muted hover:text-red-500 transition-colors cursor-pointer">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-text-muted">No benefits found. Add some to display on signup page!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const BenefitForm = ({ benefit, onBack }) => {
  const [formData, setFormData] = useState({
    title: benefit?.title || '',
    description: benefit?.description || '',
    icon: benefit?.icon || 'Gift',
    order: benefit?.order || 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (benefit) {
        await api.put(`/api/benefits/${benefit._id}`, formData);
        toast.success('Benefit updated successfully');
      } else {
        await api.post('/api/benefits', formData);
        toast.success('Benefit created and broadcasts/notifications queued successfully!');
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
        <h2 className="text-2xl font-bold flex items-center gap-2 text-text-primary">
          {benefit ? 'Edit Community Benefit' : 'Add New Community Benefit'}
        </h2>
        <button 
          onClick={onBack} 
          className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Cancel
        </button>
      </div>

      {!benefit && (
        <div className="bg-accent-blue/10 border border-accent-blue/20 rounded-xl p-4 mb-6">
          <p className="text-xs text-accent-blue leading-relaxed">
            <strong>Pro Tip:</strong> Adding a new benefit automatically queues a notification and sends newsletter updates to all subscribers configured for announcement preferences!
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-text-secondary mb-2">Benefit Title</label>
          <input 
            type="text" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
            className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-text-primary outline-none focus:border-accent-blue" 
            placeholder="e.g., Weekly Live Office Hours"
            required 
          />
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-2">Description</label>
          <textarea 
            rows={4}
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
            className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-text-primary leading-relaxed outline-none focus:border-accent-blue" 
            placeholder="Describe what community members get with this benefit..."
            required 
          />
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-2">Select Icon representation</label>
          <div className="grid grid-cols-7 gap-3 bg-bg-primary/50 border border-border-subtle p-4 rounded-xl">
            {BENEFIT_ICONS.map((item) => {
              const IconComponent = item.icon;
              const isSelected = formData.icon === item.name;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: item.name })}
                  title={item.name}
                  className={`p-3 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-accent-blue text-white shadow-glow-blue scale-110' 
                      : 'bg-bg-primary text-text-muted hover:text-text-primary hover:bg-bg-elevated'
                  }`}
                >
                  <IconComponent size={20} />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-2">Display Sort Order rank (Lower numbers show first)</label>
          <input 
            type="number" 
            value={formData.order} 
            onChange={e => setFormData({...formData, order: Number(e.target.value)})} 
            className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-text-primary outline-none focus:border-accent-blue" 
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-accent-blue hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-glow-blue disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? 'Saving Benefit & Triggering Alerts...' : (benefit ? 'Save Changes' : 'Create Benefit & Notify Subscribers')}
        </button>
      </form>
    </div>
  );
};

export default ManageBenefits;
