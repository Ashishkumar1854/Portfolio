import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useApi from '../../hooks/useApi';
import api from '../../services/api';
import SkillIcon from '../../components/ui/SkillIcon';

const ManageSkills = () => {
  const { data: skills, loading } = useApi('/api/skills');
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await api.delete(`/api/skills/${id}`);
        toast.success('Skill deleted');
        window.location.reload();
      } catch {
        toast.error('Failed to delete skill');
      }
    }
  };

  const handleEdit = (skill) => {
    setCurrentSkill(skill);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentSkill(null);
    setIsEditing(true);
  };

  if (isEditing) {
    return <SkillForm skill={currentSkill} onBack={() => setIsEditing(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary">Manage Skills</h1>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-accent-cyan hover:bg-cyan-600 text-bg-primary font-medium px-4 py-2 rounded-xl transition-all shadow-glow-cyan"
        >
          <Plus size={18} /> Add Skill
        </button>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-elevated border-b border-border-subtle text-text-secondary text-sm">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Proficiency</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-text-muted">Loading skills...</td>
                </tr>
              ) : skills?.length > 0 ? (
                skills.map((skill) => (
                  <tr key={skill._id} className="border-b border-border-subtle hover:bg-bg-elevated/50 transition-colors">
                    <td className="p-4 text-text-primary font-medium flex items-center gap-3 flex-wrap">
                      <SkillIcon icon={skill.icon} />
                      <span>{skill.name}</span>
                      {skill.showOnHome && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent-green/10 border border-accent-green/20 text-accent-green">Home</span>
                      )}
                    </td>
                    <td className="p-4 text-text-secondary">{skill.category}</td>
                    <td className="p-4 text-text-secondary">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-bg-primary rounded-full overflow-hidden">
                          <div className="h-full bg-accent-cyan" style={{ width: `${skill.proficiency}%` }} />
                        </div>
                        <span className="text-xs">{skill.proficiency}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => handleEdit(skill)} className="text-text-muted hover:text-accent-cyan transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(skill._id)} className="text-text-muted hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-text-muted">No skills found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const SkillForm = ({ skill, onBack }) => {
  const [formData, setFormData] = useState({
    name: skill?.name || '',
    category: skill?.category || 'Frontend',
    icon: skill?.icon || '',
    proficiency: skill?.proficiency || 50,
    badge: skill?.badge || 'Proficient',
    showOnHome: skill?.showOnHome || false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (skill) {
        await api.put(`/api/skills/${skill._id}`, formData);
        toast.success('Skill updated');
      } else {
        await api.post('/api/skills', formData);
        toast.success('Skill created');
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
        <h2 className="text-2xl font-bold">{skill ? 'Edit Skill' : 'Add New Skill'}</h2>
        <button onClick={onBack} className="text-text-secondary hover:text-text-primary">Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Skill Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2" required />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Category</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2">
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="AI & Agentic AI">AI &amp; Agentic AI</option>
              <option value="Automation">Automation</option>
              <option value="Databases">Databases</option>
              <option value="DevOps & Cloud">DevOps &amp; Cloud</option>
              <option value="Tools">Tools</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-text-secondary mb-2">
              Icon (Emoji or Devicon Class)
            </label>
            <div className="flex gap-2 items-center">
              {/* Live preview */}
              <div className="w-10 h-10 flex-shrink-0 bg-bg-elevated border border-border-subtle rounded-lg flex items-center justify-center">
                <SkillIcon icon={formData.icon} />
              </div>
              <input
                type="text"
                placeholder="e.g. devicon-react-original or 🤖"
                value={formData.icon}
                onChange={e => setFormData({...formData, icon: e.target.value})}
                className="flex-1 bg-bg-primary border border-border-subtle rounded-lg px-4 py-2 text-sm"
                required
              />
            </div>
            <p className="text-[11px] text-text-muted mt-1.5">
              Find classes at{' '}
              <a href="https://devicon.dev" target="_blank" rel="noreferrer" className="text-accent-blue hover:underline">
                devicon.dev
              </a>
              {' '}· Format: <code className="text-accent-cyan">devicon-react-original</code>
            </p>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-2">Badge</label>
            <select value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} className="w-full bg-bg-primary border border-border-subtle rounded-lg px-4 py-2">
              <option value="Expert">Expert</option>
              <option value="Proficient">Proficient</option>
              <option value="Learning">Learning</option>
              <option value="Familiar">Familiar</option>
            </select>
          </div>
        </div>


        <div>
          <label className="block text-sm text-text-secondary mb-2">Proficiency ({formData.proficiency}%)</label>
          <input type="range" min="0" max="100" value={formData.proficiency} onChange={e => setFormData({...formData, proficiency: Number(e.target.value)})} className="w-full accent-accent-cyan" />
        </div>

        <div>
          <label className="flex items-center gap-2.5 text-sm text-text-secondary cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={formData.showOnHome} 
              onChange={e => setFormData({...formData, showOnHome: e.target.checked})} 
              className="w-4 h-4 rounded border-border-subtle bg-bg-primary text-accent-cyan accent-accent-cyan cursor-pointer" 
            />
            Show on Home Page Tech Stack List (Highlight)
          </label>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-accent-cyan hover:bg-cyan-600 text-bg-primary font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-50">
          {isSubmitting ? 'Saving...' : 'Save Skill'}
        </button>
      </form>
    </div>
  );
};

export default ManageSkills;
