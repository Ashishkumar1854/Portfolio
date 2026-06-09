import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Eye, Trash2, Paperclip, ExternalLink, Mail, Save, Calendar, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import useApi from '../../hooks/useApi';
import api from '../../services/api';

const ManageHireRequests = () => {
  const { data: requests, loading, refresh } = useApi('/api/hire');
  const [selected, setSelected] = useState(null);

  // Editable fields in modal
  const [editBudget, setEditBudget] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTrackingLink, setEditTrackingLink] = useState('');
  const [editStatus, setEditStatus] = useState('pending');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const openDetailModal = (req) => {
    setSelected(req);
    setEditBudget(req.budget || '');
    setEditDate(req.date || '');
    setEditTrackingLink(req.trackingLink || '');
    setEditStatus(req.status || 'pending');
  };

  const handleUpdateStatusDirect = async (id, status) => {
    try {
      await api.put(`/api/hire/${id}`, { status });
      toast.success(`Request marked as ${status}`);
      refresh();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setIsUpdating(true);

    try {
      await api.put(`/api/hire/${selected._id}`, {
        budget: editBudget,
        date: editDate,
        trackingLink: editTrackingLink,
        status: editStatus
      });
      toast.success('Project details updated successfully');
      setSelected(null);
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update details');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmAndSendEmail = async () => {
    if (!selected) return;
    setIsConfirming(true);

    try {
      // First save current details
      await api.put(`/api/hire/${selected._id}`, {
        budget: editBudget,
        date: editDate,
        trackingLink: editTrackingLink,
        status: 'confirmed'
      });

      // Trigger Resend email dispatcher
      const { data } = await api.post(`/api/hire/${selected._id}/confirm`);
      toast.success(data.message || 'Project confirmed & email sent!');
      setSelected(null);
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to confirm request');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hire request?')) return;
    try {
      await api.delete(`/api/hire/${id}`);
      toast.success('Request deleted');
      refresh();
    } catch {
      toast.error('Failed to delete request');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Hire & Booking Requests</h1>
          <p className="text-text-secondary text-sm mt-1">Review inbound proposals, schedule timelines, set budgets, and send client confirmation emails.</p>
        </div>
        <span className="text-text-muted text-sm font-mono">{requests?.length || 0} total</span>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-elevated border-b border-border-subtle text-text-secondary text-sm">
                <th className="p-4 font-medium">Inquiry Date</th>
                <th className="p-4 font-medium">Client Info</th>
                <th className="p-4 font-medium">Service Info</th>
                <th className="p-4 font-medium">Project Budget</th>
                <th className="p-4 font-medium">Target Schedule</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-text-muted">Loading requests...</td></tr>
              ) : requests?.length > 0 ? (
                requests.map((req) => (
                  <tr key={req._id} className="border-b border-border-subtle hover:bg-bg-elevated/50 transition-colors text-sm">
                    <td className="p-4 text-text-secondary whitespace-nowrap">
                      {new Date(req.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-text-primary">{req.name}</div>
                      <div className="text-xs text-text-muted">{req.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-text-secondary">{req.serviceType}</div>
                      {req.attachmentUrl && (
                        <a
                          href={req.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1 text-xs text-accent-blue hover:underline"
                        >
                          <Paperclip size={12} /> Doc Attached
                        </a>
                      )}
                    </td>
                    <td className="p-4 font-mono text-text-secondary font-medium">
                      {req.budget}
                    </td>
                    <td className="p-4 text-text-secondary">
                      {req.date ? (
                        <span className="flex items-center gap-1.5 text-xs">
                          <Calendar size={13} className="text-accent-blue" />
                          {req.date}
                        </span>
                      ) : (
                        <span className="text-text-muted text-xs font-mono">Unscheduled</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold tracking-wide uppercase inline-block ${
                        req.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20' :
                        req.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openDetailModal(req)}
                          className="p-2 text-text-muted hover:text-accent-blue bg-bg-primary rounded-lg transition-colors border border-border-subtle hover:border-accent-blue/30"
                          title="View & Edit"
                        >
                          <Eye size={15} />
                        </button>
                        {req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatusDirect(req._id, 'confirmed')}
                              className="p-2 text-text-muted hover:text-green-500 bg-bg-primary rounded-lg transition-colors border border-border-subtle hover:border-green-500/30"
                              title="Confirm"
                            >
                              <Check size={15} />
                            </button>
                            <button
                              onClick={() => handleUpdateStatusDirect(req._id, 'rejected')}
                              className="p-2 text-text-muted hover:text-red-500 bg-bg-primary rounded-lg transition-colors border border-border-subtle hover:border-red-500/30"
                              title="Reject"
                            >
                              <X size={15} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(req._id)}
                          className="p-2 text-text-muted hover:text-red-500 bg-bg-primary rounded-lg transition-colors border border-border-subtle hover:border-red-500/30"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="p-8 text-center text-text-muted">No hire requests found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit & Confirm Detail Modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-bg-card border border-border-subtle rounded-3xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-text-primary">Proposal Management</h2>
                  <p className="text-xs text-text-muted mt-0.5">Edit parameters and email project confirmations to client</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-text-muted hover:text-text-primary"><X size={20} /></button>
              </div>

              <form onSubmit={handleSaveDetails} className="space-y-6">
                
                {/* Fixed read-only details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-bg-primary/30 p-4 border border-border-subtle rounded-2xl text-sm">
                  <div>
                    <span className="text-text-muted text-xs block font-mono">Client Name</span>
                    <span className="text-text-primary font-semibold block mt-0.5">{selected.name}</span>
                  </div>
                  <div>
                    <span className="text-text-muted text-xs block font-mono">Client Email</span>
                    <span className="text-text-primary font-semibold block mt-0.5">{selected.email}</span>
                  </div>
                  <div>
                    <span className="text-text-muted text-xs block font-mono">Service Type Requested</span>
                    <span className="text-accent-blue font-semibold block mt-0.5">{selected.serviceType}</span>
                  </div>
                  <div>
                    <span className="text-text-muted text-xs block font-mono">Inquiry Date</span>
                    <span className="text-text-secondary block mt-0.5">{new Date(selected.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Scope & Message */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selected.scope && (
                    <div>
                      <span className="text-text-muted text-xs block font-mono mb-2">Project Scope Definitions</span>
                      <div className="bg-bg-primary border border-border-subtle rounded-xl p-3.5 text-xs text-text-secondary h-28 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                        {selected.scope}
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="text-text-muted text-xs block font-mono mb-2">Client Message</span>
                    <div className="bg-bg-primary border border-border-subtle rounded-xl p-3.5 text-xs text-text-secondary h-28 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                      {selected.message}
                    </div>
                  </div>
                </div>

                {selected.attachmentUrl && (
                  <div className="bg-bg-primary/20 border border-border-subtle p-3.5 rounded-xl flex items-center justify-between">
                    <span className="text-xs text-text-secondary flex items-center gap-1.5">
                      <Paperclip size={14} className="text-accent-blue" /> Doc Attached: {selected.name}_proposal
                    </span>
                    <a
                      href={selected.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-accent-blue hover:underline flex items-center gap-1"
                    >
                      View Attachment <ExternalLink size={12} />
                    </a>
                  </div>
                )}

                {/* Editable Parameters */}
                <div className="border-t border-white/5 pt-6 space-y-4">
                  <h3 className="text-sm font-bold text-text-primary">Review & Modify Parameters</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-2">Budget (Editable)</label>
                      <input
                        type="text"
                        value={editBudget}
                        onChange={(e) => setEditBudget(e.target.value)}
                        placeholder="e.g. ₹50,000"
                        className="w-full bg-bg-primary border border-border-subtle hover:border-text-muted rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-blue text-xs font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-2">Project Date (Editable)</label>
                      <input
                        type="text"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        placeholder="e.g. June 15, 2026"
                        className="w-full bg-bg-primary border border-border-subtle hover:border-text-muted rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-blue text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-2">Status</label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="w-full bg-bg-primary border border-border-subtle rounded-xl px-3 py-2.5 text-text-primary focus:outline-none focus:border-accent-blue text-xs font-semibold"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-2">Tracking / GitHub Link (Editable)</label>
                    <input
                      type="url"
                      value={editTrackingLink}
                      onChange={(e) => setEditTrackingLink(e.target.value)}
                      placeholder="e.g. https://github.com/ashishyadav/saas-repo"
                      className="w-full bg-bg-primary border border-border-subtle hover:border-text-muted rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-blue text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-6 border-t border-white/5">
                  <button
                    type="button"
                    disabled={isConfirming}
                    onClick={handleConfirmAndSendEmail}
                    className="px-6 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isConfirming ? (
                      <span className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={14} />
                        Confirm & Send Email
                      </>
                    )}
                  </button>
                  
                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="px-5 py-2.5 bg-bg-elevated border border-border-subtle rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="px-6 py-2.5 bg-accent-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-accent-blue/10 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isUpdating ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Save size={14} />
                          Save Details
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ManageHireRequests;
