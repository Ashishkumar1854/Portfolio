import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit2, Trash2, X, Check, HelpCircle, 
  Bot, Workflow, MessageCircle, Layers, Globe, Zap, ListPlus, Activity 
} from 'lucide-react';
import toast from 'react-hot-toast';
import useApi from '../../hooks/useApi';
import api from '../../services/api';

const AVAILABLE_ICONS = [
  { name: 'Bot', component: <Bot size={18} /> },
  { name: 'Workflow', component: <Workflow size={18} /> },
  { name: 'MessageCircle', component: <MessageCircle size={18} /> },
  { name: 'Layers', component: <Layers size={18} /> },
  { name: 'Globe', component: <Globe size={18} /> },
  { name: 'Zap', component: <Zap size={18} /> },
  { name: 'Activity', component: <Activity size={18} /> },
];

const ManageServices = () => {
  const { data: services, loading, refresh } = useApi('/api/services');
  const [formOpen, setFormOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Form States
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('Zap');
  const [color, setColor] = useState('text-accent-blue');
  const [bg, setBg] = useState('bg-accent-blue/10');
  const [overview, setOverview] = useState('');
  const [pricing, setPricing] = useState('');
  const [category, setCategory] = useState('Automation');
  const [deliverables, setDeliverables] = useState([]);
  const [newDeliverable, setNewDeliverable] = useState('');
  const [process, setProcess] = useState([]);
  const [newProcess, setNewProcess] = useState('');
  const [faq, setFaq] = useState([]);
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');

  const openCreateForm = () => {
    setEditingService(null);
    setTitle('');
    setIcon('Zap');
    setColor('text-accent-blue');
    setBg('bg-accent-blue/10');
    setOverview('');
    setPricing('');
    setCategory('Automation');
    setDeliverables([]);
    setProcess([]);
    setFaq([]);
    setFormOpen(true);
  };

  const openEditForm = (svc) => {
    setEditingService(svc);
    setTitle(svc.title);
    setIcon(svc.icon);
    setColor(svc.color || 'text-accent-blue');
    setBg(svc.bg || 'bg-accent-blue/10');
    setOverview(svc.overview);
    setPricing(svc.pricing);
    setCategory(svc.category || 'Automation');
    setDeliverables(svc.deliverables || []);
    setProcess(svc.process || []);
    setFaq(svc.faq || []);
    setFormOpen(true);
  };

  // Deliverables managers
  const addDeliverable = () => {
    if (!newDeliverable.trim()) return;
    setDeliverables([...deliverables, newDeliverable.trim()]);
    setNewDeliverable('');
  };
  const removeDeliverable = (idx) => {
    setDeliverables(deliverables.filter((_, i) => i !== idx));
  };

  // Process managers
  const addProcess = () => {
    if (!newProcess.trim()) return;
    setProcess([...process, newProcess.trim()]);
    setNewProcess('');
  };
  const removeProcess = (idx) => {
    setProcess(process.filter((_, i) => i !== idx));
  };

  // FAQ managers
  const addFaq = () => {
    if (!newQ.trim() || !newA.trim()) return;
    setFaq([...faq, { q: newQ.trim(), a: newA.trim() }]);
    setNewQ('');
    setNewA('');
  };
  const removeFaq = (idx) => {
    setFaq(faq.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title, icon, color, bg, overview, deliverables, process, pricing, faq, category
    };

    try {
      if (editingService) {
        await api.put(`/api/services/${editingService._id}`, payload);
        toast.success('Service updated successfully');
      } else {
        await api.post('/api/services', payload);
        toast.success('Service created successfully');
      }
      setFormOpen(false);
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save service');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/api/services/${id}`);
      toast.success('Service deleted');
      refresh();
    } catch {
      toast.error('Failed to delete service');
    }
  };

  const renderIconComponent = (iconName) => {
    switch (iconName) {
      case 'Bot': return <Bot size={18} />;
      case 'Workflow': return <Workflow size={18} />;
      case 'MessageCircle': return <MessageCircle size={18} />;
      case 'Layers': return <Layers size={18} />;
      case 'Globe': return <Globe size={18} />;
      case 'Activity': return <Activity size={18} />;
      default: return <Zap size={18} />;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Manage Services</h1>
          <p className="text-text-secondary text-sm mt-1">Configure the core business deliverables displayed on your Services page.</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent-blue hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-accent-blue/10 cursor-pointer"
        >
          <Plus size={18} /> Add Service
        </button>
      </div>

      {/* Services Table List */}
      <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-elevated border-b border-border-subtle text-text-secondary text-sm">
                <th className="p-4 font-medium">Service Name</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Pricing</th>
                <th className="p-4 font-medium">Overview Summary</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-text-muted">Loading services...</td></tr>
              ) : services?.length > 0 ? (
                services.map((svc) => (
                  <tr key={svc._id} className="border-b border-border-subtle hover:bg-bg-elevated/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${svc.bg || 'bg-accent-blue/10'} ${svc.color || 'text-accent-blue'} flex items-center justify-center`}>
                          {renderIconComponent(svc.icon)}
                        </div>
                        <span className="font-bold text-text-primary">{svc.title}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs px-2.5 py-1 bg-white/5 border border-white/5 rounded-full text-text-secondary font-mono">{svc.category}</span>
                    </td>
                    <td className="p-4 font-mono text-sm text-text-secondary">{svc.pricing}</td>
                    <td className="p-4 max-w-xs truncate text-sm text-text-muted">{svc.overview}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditForm(svc)}
                          className="p-2 text-text-muted hover:text-accent-blue bg-bg-primary rounded-lg transition-colors border border-border-subtle"
                          title="Edit Service"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(svc._id)}
                          className="p-2 text-text-muted hover:text-red-500 bg-bg-primary rounded-lg transition-colors border border-border-subtle"
                          title="Delete Service"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="p-8 text-center text-text-muted">No custom services found. Add one now!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Form Modal */}
      <AnimatePresence>
        {formOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-bg-card border border-border-subtle rounded-3xl p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-text-primary">
                  {editingService ? 'Edit Service Details' : 'Create New Service'}
                </h2>
                <button onClick={() => setFormOpen(false)} className="text-text-muted hover:text-text-primary"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* General Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-2">Service Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. n8n Automation"
                        className="w-full bg-bg-primary border border-border-subtle hover:border-text-muted rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/20 transition-all text-sm"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-2">Icon Type</label>
                        <select
                          value={icon}
                          onChange={(e) => setIcon(e.target.value)}
                          className="w-full bg-bg-primary border border-border-subtle rounded-xl px-3 py-2.5 text-text-primary focus:outline-none focus:border-accent-blue transition-all text-sm"
                        >
                          <option value="Bot">Bot (AI)</option>
                          <option value="Workflow">Workflow (Automation)</option>
                          <option value="MessageCircle">Message (WhatsApp)</option>
                          <option value="Layers">Layers (SaaS)</option>
                          <option value="Globe">Globe (Fullstack)</option>
                          <option value="Zap">Zap (AI/API)</option>
                          <option value="Activity">Activity (Monitoring)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-2">Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-bg-primary border border-border-subtle rounded-xl px-3 py-2.5 text-text-primary focus:outline-none focus:border-accent-blue transition-all text-sm"
                        >
                          <option value="Automation">Automation</option>
                          <option value="SaaS">SaaS</option>
                          <option value="AI">AI</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-2">Color CSS Class</label>
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          placeholder="text-accent-blue"
                          className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-text-primary text-xs font-mono focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-2">Bg CSS Class</label>
                        <input
                          type="text"
                          value={bg}
                          onChange={(e) => setBg(e.target.value)}
                          placeholder="bg-accent-blue/10"
                          className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-text-primary text-xs font-mono focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-2">Pricing Structure</label>
                      <input
                        type="text"
                        value={pricing}
                        onChange={(e) => setPricing(e.target.value)}
                        placeholder="e.g. ₹20,000 - ₹80,000"
                        className="w-full bg-bg-primary border border-border-subtle hover:border-text-muted rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-blue transition-all text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-2">Overview Description</label>
                      <textarea
                        value={overview}
                        onChange={(e) => setOverview(e.target.value)}
                        placeholder="Define the scope and objectives of the service..."
                        className="w-full bg-bg-primary border border-border-subtle hover:border-text-muted rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-blue transition-all text-sm h-28 resize-none"
                        required
                      />
                    </div>
                  </div>

                  {/* List arrays (Deliverables & Process) */}
                  <div className="space-y-4">
                    {/* Deliverables */}
                    <div>
                      <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-2">Deliverables Checklist</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newDeliverable}
                          onChange={(e) => setNewDeliverable(e.target.value)}
                          placeholder="Add a deliverable..."
                          className="flex-grow bg-bg-primary border border-border-subtle rounded-xl px-4 py-2 text-text-primary focus:outline-none focus:border-accent-blue text-xs"
                        />
                        <button
                          type="button"
                          onClick={addDeliverable}
                          className="px-3 bg-bg-elevated border border-border-subtle rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 text-xs font-semibold"
                        >
                          Add
                        </button>
                      </div>
                      <div className="max-h-24 overflow-y-auto space-y-1.5 p-2 bg-bg-primary/30 border border-border-subtle rounded-xl">
                        {deliverables.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-bg-elevated/40 px-3 py-1 rounded-lg border border-border-subtle/40">
                            <span className="text-xs text-text-secondary truncate pr-4">{item}</span>
                            <button type="button" onClick={() => removeDeliverable(idx)} className="text-text-muted hover:text-red-500"><X size={12} /></button>
                          </div>
                        ))}
                        {deliverables.length === 0 && <span className="text-[10px] text-text-muted block text-center py-2">No deliverables added yet.</span>}
                      </div>
                    </div>

                    {/* Process */}
                    <div>
                      <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-2">Workflow Process Steps</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newProcess}
                          onChange={(e) => setNewProcess(e.target.value)}
                          placeholder="Add a process step..."
                          className="flex-grow bg-bg-primary border border-border-subtle rounded-xl px-4 py-2 text-text-primary focus:outline-none focus:border-accent-blue text-xs"
                        />
                        <button
                          type="button"
                          onClick={addProcess}
                          className="px-3 bg-bg-elevated border border-border-subtle rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 text-xs font-semibold"
                        >
                          Add
                        </button>
                      </div>
                      <div className="max-h-24 overflow-y-auto space-y-1.5 p-2 bg-bg-primary/30 border border-border-subtle rounded-xl">
                        {process.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-bg-elevated/40 px-3 py-1 rounded-lg border border-border-subtle/40">
                            <span className="text-xs text-text-secondary truncate pr-4">{idx + 1}. {item}</span>
                            <button type="button" onClick={() => removeProcess(idx)} className="text-text-muted hover:text-red-500"><X size={12} /></button>
                          </div>
                        ))}
                        {process.length === 0 && <span className="text-[10px] text-text-muted block text-center py-2">No process steps added yet.</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQ Block (full width) */}
                <div className="border-t border-border-subtle/50 pt-4">
                  <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-3">Service FAQs</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <input
                      type="text"
                      value={newQ}
                      onChange={(e) => setNewQ(e.target.value)}
                      placeholder="Question..."
                      className="bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-text-primary focus:outline-none text-xs"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newA}
                        onChange={(e) => setNewA(e.target.value)}
                        placeholder="Answer..."
                        className="flex-grow bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-text-primary focus:outline-none text-xs"
                      />
                      <button
                        type="button"
                        onClick={addFaq}
                        className="px-4 bg-bg-elevated border border-border-subtle rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 text-xs font-semibold"
                      >
                        Add FAQ
                      </button>
                    </div>
                  </div>

                  <div className="max-h-36 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-bg-primary/30 border border-border-subtle rounded-xl">
                    {faq.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start gap-3 bg-bg-elevated/40 p-3 rounded-lg border border-border-subtle/40">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-text-primary">Q: {item.q}</p>
                          <p className="text-[11px] text-text-secondary">A: {item.a}</p>
                        </div>
                        <button type="button" onClick={() => removeFaq(idx)} className="text-text-muted hover:text-red-500 mt-0.5"><X size={12} /></button>
                      </div>
                    ))}
                    {faq.length === 0 && <span className="col-span-2 text-[10px] text-text-muted block text-center py-4">No FAQs added yet.</span>}
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-border-subtle/50">
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="px-5 py-2.5 bg-bg-elevated border border-border-subtle rounded-xl text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-accent-blue hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-accent-blue/10 cursor-pointer"
                  >
                    {editingService ? 'Save Changes' : 'Create Service'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ManageServices;
