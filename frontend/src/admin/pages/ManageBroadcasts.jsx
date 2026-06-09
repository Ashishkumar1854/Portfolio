import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Users, Mail, Bell, BarChart3, Plus, 
  Calendar, Eye, CheckCircle, Percent, AlertCircle, X, ChevronRight
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import useApi from '../../hooks/useApi';

const AUDIENCES = [
  'All Users',
  'Blog Subscribers',
  'Resource Subscribers',
  'Case Study Subscribers',
  'Custom Segment'
];

const ManageBroadcasts = () => {
  const { data: campaigns, loading: campaignsLoading } = useApi('/api/broadcasts');
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    blogSubscribers: 0,
    resourceSubscribers: 0,
    caseStudySubscribers: 0,
    openRate: 0,
    clickRate: 0,
    totalSentEmails: 0
  });

  const [isCreating, setIsCreating] = useState(false);
  
  // Campaign Form States
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    content: '',
    bannerImage: '',
    targetAudience: 'All Users',
    sendImmediately: true,
    scheduledAt: '',
    // Custom Segment Filters
    joinedAfter: '',
    role: '',
    prefBlogs: true,
    prefResources: true,
    prefCaseStudies: true,
    prefAnnouncements: true
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/api/broadcasts/stats');
      setStats(data);
    } catch (err) {
      console.error('Error fetching broadcast stats:', err);
    }
  };

  const handleCampaignSubmit = async (e) => {
    e.preventDefault();
    
    // Validate scheduling
    if (!formData.sendImmediately && !formData.scheduledAt) {
      return toast.error('Please specify a date/time for scheduling');
    }

    try {
      const payload = {
        title: formData.title,
        subject: formData.subject,
        content: formData.content,
        bannerImage: formData.bannerImage,
        targetAudience: formData.targetAudience,
        sendImmediately: formData.sendImmediately,
        scheduledAt: formData.sendImmediately ? undefined : formData.scheduledAt,
        customFilters: formData.targetAudience === 'Custom Segment' ? {
          joinedAfter: formData.joinedAfter || undefined,
          role: formData.role || undefined,
          preferences: {
            blogs: formData.prefBlogs,
            resources: formData.prefResources,
            caseStudies: formData.prefCaseStudies,
            announcements: formData.prefAnnouncements
          }
        } : undefined
      };

      await api.post('/api/broadcasts', payload);
      toast.success(formData.sendImmediately ? 'Broadcast queued for immediate sending!' : 'Broadcast campaign scheduled');
      setIsCreating(false);
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create campaign');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12"
    >
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Broadcast Center</h1>
          <p className="text-sm text-text-secondary mt-1">Manage newsletter campaigns, segment subscribers, and monitor campaign performance.</p>
        </div>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-accent-purple hover:bg-purple-600 text-white font-medium px-4 py-2.5 rounded-xl transition-all shadow-glow-purple cursor-pointer"
          >
            <Plus size={18} /> New Campaign
          </button>
        )}
      </div>

      {/* Analytics Strip Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-bg-card border border-border-subtle p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-accent-blue/10 text-accent-blue rounded-xl">
            <Users size={22} />
          </div>
          <div>
            <span className="text-[10px] text-text-muted uppercase font-mono tracking-wider block">Total Subscribers</span>
            <span className="text-2xl font-bold text-text-primary block mt-0.5">{stats.totalSubscribers}</span>
          </div>
        </div>

        <div className="bg-bg-card border border-border-subtle p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-accent-cyan/10 text-accent-cyan rounded-xl">
            <Mail size={22} />
          </div>
          <div>
            <span className="text-[10px] text-text-muted uppercase font-mono tracking-wider block">Sent Newsletters</span>
            <span className="text-2xl font-bold text-text-primary block mt-0.5">{stats.totalSentEmails}</span>
          </div>
        </div>

        <div className="bg-bg-card border border-border-subtle p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-accent-green/10 text-accent-green rounded-xl">
            <Percent size={22} />
          </div>
          <div>
            <span className="text-[10px] text-text-muted uppercase font-mono tracking-wider block">Open Rate</span>
            <span className="text-2xl font-bold text-text-primary block mt-0.5">{stats.openRate}%</span>
          </div>
        </div>

        <div className="bg-bg-card border border-border-subtle p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-accent-purple/10 text-accent-purple rounded-xl">
            <BarChart3 size={22} />
          </div>
          <div>
            <span className="text-[10px] text-text-muted uppercase font-mono tracking-wider block">Click Rate</span>
            <span className="text-2xl font-bold text-text-primary block mt-0.5">{stats.clickRate}%</span>
          </div>
        </div>
      </div>

      {/* Campaign List / Creator Switch */}
      {isCreating ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-bg-card border border-border-subtle p-6 md:p-8 rounded-3xl shadow-xl max-w-3xl mx-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-text-primary">Create Email Campaign</h2>
            <button 
              onClick={() => setIsCreating(false)}
              className="text-text-secondary hover:text-text-primary"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleCampaignSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-text-secondary mb-2">Campaign Title (Internal Reference)</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })} 
                  className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent-purple"
                  placeholder="e.g. June AI Updates Newsletter"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-2">Email Subject Line</label>
                <input 
                  type="text" 
                  value={formData.subject} 
                  onChange={e => setFormData({ ...formData, subject: e.target.value })} 
                  className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent-purple"
                  placeholder="e.g. New AI Agent Blueprint Now Live! 🚀"
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">Banner Image URL (Optional)</label>
              <input 
                type="text" 
                value={formData.bannerImage} 
                onChange={e => setFormData({ ...formData, bannerImage: e.target.value })} 
                className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent-purple"
                placeholder="https://image-url..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-text-secondary mb-2">Target Audience Segment</label>
                <select
                  value={formData.targetAudience}
                  onChange={e => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent-purple"
                >
                  {AUDIENCES.map(aud => (
                    <option key={aud} value={aud}>{aud}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2">Dispatch Schedule</label>
                <div className="flex gap-4 items-center h-[42px]">
                  <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer select-none">
                    <input 
                      type="radio" 
                      checked={formData.sendImmediately} 
                      onChange={() => setFormData({ ...formData, sendImmediately: true })}
                      className="w-4 h-4 accent-accent-purple cursor-pointer"
                    />
                    Send Now
                  </label>
                  <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer select-none">
                    <input 
                      type="radio" 
                      checked={!formData.sendImmediately} 
                      onChange={() => setFormData({ ...formData, sendImmediately: false })}
                      className="w-4 h-4 accent-accent-purple cursor-pointer"
                    />
                    Schedule Later
                  </label>
                </div>
              </div>
            </div>

            {/* Scheduled Date Input */}
            {!formData.sendImmediately && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg-primary/50 border border-border-subtle p-4 rounded-xl"
              >
                <label className="block text-sm text-text-secondary mb-2">Scheduled Dispatch Time</label>
                <input 
                  type="datetime-local" 
                  value={formData.scheduledAt} 
                  onChange={e => setFormData({ ...formData, scheduledAt: e.target.value })} 
                  className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2 text-sm outline-none"
                />
              </motion.div>
            )}

            {/* Custom Segment Filters */}
            {formData.targetAudience === 'Custom Segment' && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg-primary/50 border border-border-subtle p-5 rounded-2xl space-y-4"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-accent-purple">Configure Custom Segment Filters</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-text-secondary mb-1.5">Joined After Date</label>
                    <input 
                      type="date" 
                      value={formData.joinedAfter}
                      onChange={e => setFormData({ ...formData, joinedAfter: e.target.value })}
                      className="w-full bg-bg-primary border border-border-subtle rounded-xl px-3 py-1.5 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1.5">User System Role</label>
                    <select
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-bg-primary border border-border-subtle rounded-xl px-3 py-1.5 text-xs outline-none"
                    >
                      <option value="">All Roles</option>
                      <option value="user">Standard Users Only</option>
                      <option value="admin">Administrators Only</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs text-text-muted font-bold">Only Deliver to Users Opted-In For:</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
                    <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.prefBlogs} 
                        onChange={e => setFormData({ ...formData, prefBlogs: e.target.checked })}
                        className="w-3.5 h-3.5 accent-accent-purple cursor-pointer"
                      />
                      Blogs
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.prefResources} 
                        onChange={e => setFormData({ ...formData, prefResources: e.target.checked })}
                        className="w-3.5 h-3.5 accent-accent-purple cursor-pointer"
                      />
                      Resources
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.prefCaseStudies} 
                        onChange={e => setFormData({ ...formData, prefCaseStudies: e.target.checked })}
                        className="w-3.5 h-3.5 accent-accent-purple cursor-pointer"
                      />
                      Case Studies
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.prefAnnouncements} 
                        onChange={e => setFormData({ ...formData, prefAnnouncements: e.target.checked })}
                        className="w-3.5 h-3.5 accent-accent-purple cursor-pointer"
                      />
                      Announcements
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-sm text-text-secondary mb-2">Newsletter HTML / Body Content (Markdown supported)</label>
              <textarea 
                rows="8" 
                value={formData.content} 
                onChange={e => setFormData({ ...formData, content: e.target.value })} 
                className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-3 text-sm outline-none focus:border-accent-purple font-mono"
                placeholder="<h2>Hello World!</h2><p>Here is our latest AI news...</p>"
                required 
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-accent-purple hover:bg-purple-600 text-white font-bold py-3 rounded-xl transition-all shadow-glow-purple cursor-pointer flex items-center justify-center gap-2"
            >
              <Send size={16} /> Broadcast Campaign
            </button>
          </form>
        </motion.div>
      ) : (
        /* Campaigns Log Grid */
        <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-border-subtle">
            <h2 className="font-bold text-text-primary text-lg flex items-center gap-2">
              <BarChart3 size={18} className="text-accent-purple" /> Historical Dispatch Campaigns
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-elevated border-b border-border-subtle text-text-secondary text-sm">
                  <th className="p-4 font-medium">Campaign Name</th>
                  <th className="p-4 font-medium">Audience</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Progress</th>
                  <th className="p-4 font-medium">Opens / Clicks</th>
                  <th className="p-4 font-medium">Scheduled / Sent Date</th>
                </tr>
              </thead>
              <tbody>
                {campaignsLoading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-text-muted">Loading campaigns history log...</td>
                  </tr>
                ) : campaigns?.length > 0 ? (
                  campaigns.map((c) => (
                    <tr key={c._id} className="border-b border-border-subtle hover:bg-bg-elevated/50 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-text-primary text-sm">{c.title}</div>
                        <div className="text-[10px] text-text-muted mt-0.5 truncate max-w-xs">{c.subject}</div>
                      </td>
                      <td className="p-4 text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-bg-primary border border-border-subtle text-text-secondary">
                          {c.targetAudience}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-semibold capitalize font-mono">
                        <span className={`px-2 py-0.5 rounded-full border ${
                          c.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                          c.status === 'processing' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                          c.status === 'scheduled' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                          'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="w-24">
                          <div className="flex justify-between text-[10px] font-mono mb-1 text-text-secondary">
                            <span>{c.sentCount} / {c.totalCount}</span>
                          </div>
                          <div className="w-full h-1.5 bg-bg-primary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-accent-purple" 
                              style={{ width: `${c.totalCount > 0 ? (c.sentCount / c.totalCount) * 100 : 0}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-mono text-text-secondary">
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1"><Eye size={11} /> {c.openCount} Opens</span>
                          <span className="flex items-center gap-1"><ChevronRight size={11} /> {c.clickCount} Clicks</span>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-mono text-text-secondary">
                        {new Date(c.scheduledAt || c.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-text-muted">No campaigns broadcasted yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ManageBroadcasts;
