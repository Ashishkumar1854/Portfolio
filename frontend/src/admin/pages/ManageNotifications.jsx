import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Bell, Megaphone, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ManageNotifications = () => {
  const [announcement, setAnnouncement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!announcement.trim()) {
      return toast.error('Announcement content cannot be empty');
    }
    
    setIsSubmitting(true);
    try {
      const { data } = await api.post('/api/notifications/announcement', {
        text: announcement
      });
      toast.success(data.message || 'Announcement broadcasted successfully!');
      setAnnouncement('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send broadcast');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold text-text-primary">System Announcements</h1>
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3 text-accent-purple">
          <Megaphone size={24} className="animate-bounce" />
          <h2 className="text-lg font-bold text-text-primary">Broadcast a New Global Announcement</h2>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed">
          Broadcast a real-time message notification to every registered user on the platform. 
          The alert will appear instantly in their inbox dashboard under the "Notifications" tab.
        </p>

        <form onSubmit={handleBroadcast} className="space-y-6">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Announcement Message</label>
            <textarea 
              rows="4"
              value={announcement}
              onChange={e => setAnnouncement(e.target.value)}
              placeholder="Type your system alert, feature update, or community news here..."
              className="w-full bg-bg-primary border border-border-subtle hover:border-border-active focus:border-accent-purple rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none"
              required
            />
            <span className="text-[10px] text-text-muted mt-1 block font-mono">
              Avoid overly lengthy texts for better readability in dashboard layouts.
            </span>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full flex items-center justify-center gap-2 bg-accent-purple hover:bg-purple-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-glow-purple"
          >
            {isSubmitting ? (
              <>Sending Broadcast...</>
            ) : (
              <>
                <Send size={16} /> Broadcast Announcement
              </>
            )}
          </button>
        </form>
      </div>

      {/* Usage Tips Card */}
      <div className="bg-bg-card/40 border border-border-subtle rounded-2xl p-6">
        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <CheckCircle size={14} className="text-accent-green" /> Moderation Tips
        </h3>
        <ul className="text-xs text-text-secondary list-disc pl-5 space-y-1.5 leading-relaxed">
          <li>Announcements target all users database-wide.</li>
          <li>Users cannot delete announcements directly; they appear in their read/unread list.</li>
          <li>Ensure announcements are clear and relevant to community topics.</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default ManageNotifications;
