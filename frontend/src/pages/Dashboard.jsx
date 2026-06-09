import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User as UserIcon, Bell, Save,
  Trash2, ArrowRight, ExternalLink, Shield,
  KeyRound, Download, BookOpen, MessageCircle, LogOut
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const AVATAR_PRESETS = ['👨‍💻', '👩‍💻', '🤖', '🚀', '🎨', '🐱', '🦊', '🦁', '🦄', '🧙‍♂️'];
const WHATSAPP_LINK = import.meta.env.VITE_COMMUNITY_WHATSAPP_LINK || '#';

const Dashboard = () => {
  const { user, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    avatar: '👨‍💻',
    github: '',
    linkedin: '',
    emailNotifications: true,
    newsletterSubscribed: true,
    prefBlogs: true,
    prefResources: true,
    prefAnnouncements: true,
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmNewPassword: ''
  });

  const [savedResources, setSavedResources] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        bio: user.bio || '',
        avatar: user.avatar || '👨‍💻',
        github: user.github || '',
        linkedin: user.linkedin || '',
        emailNotifications: user.emailNotifications ?? true,
        newsletterSubscribed: user.newsletterSubscribed ?? true,
        prefBlogs: user.notificationPreferences?.blogs ?? true,
        prefResources: user.notificationPreferences?.resources ?? true,
        prefAnnouncements: user.notificationPreferences?.announcements ?? true,
      });
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [bookmarksRes, notifRes] = await Promise.all([
        api.get('/api/bookmarks'),
        api.get('/api/notifications')
      ]);
      // Only show Resource bookmarks now
      setSavedResources(bookmarksRes.data.filter(b => b.itemType === 'Resource'));
      setNotifications(notifRes.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: profileData.name,
        bio: profileData.bio,
        avatar: profileData.avatar,
        github: profileData.github,
        linkedin: profileData.linkedin,
        emailNotifications: profileData.emailNotifications,
        newsletterSubscribed: profileData.newsletterSubscribed,
        notificationPreferences: {
          blogs: profileData.prefBlogs,
          resources: profileData.prefResources,
          announcements: profileData.prefAnnouncements,
          caseStudies: true,
        }
      };
      const { data } = await api.put('/api/auth/profile', payload);
      setUser(data);
      toast.success('Profile saved ✓');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      return toast.error('Passwords do not match');
    }
    if (passwordData.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    try {
      await api.put('/api/auth/profile', { password: passwordData.newPassword });
      toast.success('Password updated ✓');
      setPasswordData({ newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      toast.error('Failed to update password');
    }
  };

  const removeBookmark = async (itemType, itemId) => {
    try {
      await api.post('/api/bookmarks/toggle', { itemType, itemId });
      setSavedResources(prev => prev.filter(b => !(b.itemType === itemType && b.itemId === itemId)));
      toast.success('Removed from saved');
    } catch {
      toast.error('Failed to remove');
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch { /* silent */ }
  };

  const markAllRead = async () => {
    try {
      await api.put('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All marked as read');
    } catch { toast.error('Failed'); }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch { /* silent */ }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <h2 className="text-2xl font-bold text-text-primary mb-3">Please Login</h2>
        <p className="text-text-secondary mb-6 text-sm">Sign in to access your dashboard.</p>
        <Link to="/login" className="px-6 py-2.5 bg-accent-blue hover:bg-blue-500 rounded-xl text-white font-medium shadow-glow-blue transition-all">
          Sign In
        </Link>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <UserIcon size={16} /> },
    { id: 'saved', label: `Saved (${savedResources.length})`, icon: <Download size={16} /> },
    { id: 'notifications', label: 'Alerts', icon: <Bell size={16} />, badge: unreadCount },
  ];

  return (
    <div className="min-h-screen py-12 sm:py-16 bg-bg-primary text-text-primary">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-10"
        >
          <div className="w-16 h-16 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-3xl flex-shrink-0">
            {profileData.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-display font-bold text-text-primary truncate">{user.name}</h1>
              {user.role === 'admin' && (
                <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple">
                  <Shield size={9} /> Admin
                </span>
              )}
            </div>
            <p className="text-text-muted text-sm mt-0.5">{user.email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap gap-3 sm:gap-4 text-xs text-text-muted">
              <div className="text-center">
                <div className="text-base font-bold text-text-primary">{savedResources.length}</div>
                <div className="text-[10px] uppercase tracking-wide font-mono">Saved</div>
              </div>
              <div className="text-center">
                <div className="text-base font-bold text-accent-purple">{unreadCount}</div>
                <div className="text-[10px] uppercase tracking-wide font-mono">Unread</div>
              </div>
            </div>
            {/* Logout Button */}
            <button
              onClick={async () => { await logout(); navigate('/'); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/15 hover:border-red-500/40 text-xs font-semibold transition-all"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-bg-card/40 border border-border-subtle rounded-2xl p-1 mb-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-accent-blue text-white shadow-glow-blue'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated/60'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.badge > 0 && (
                <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ─── Profile Tab ─── */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Profile Form */}
              <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 sm:p-8">
                <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                  <UserIcon size={18} className="text-accent-blue" /> Your Profile
                </h2>

                <form onSubmit={handleProfileSubmit} className="space-y-5">
                  {/* Avatar */}
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Avatar</label>
                    <div className="flex flex-wrap gap-2">
                      {AVATAR_PRESETS.map(preset => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setProfileData({ ...profileData, avatar: preset })}
                          className={`text-xl p-2.5 rounded-xl border transition-all hover:scale-110 ${
                            profileData.avatar === preset
                              ? 'border-accent-blue bg-accent-blue/5 shadow-glow-blue scale-110'
                              : 'border-border-subtle hover:border-border-active bg-bg-primary/50'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-text-secondary mb-1.5">Display Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-text-secondary mb-1.5 flex items-center gap-1.5">
                        <FaGithub size={13} /> GitHub URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/you"
                        value={profileData.github}
                        onChange={e => setProfileData({ ...profileData, github: e.target.value })}
                        className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue transition-all"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm text-text-secondary mb-1.5">Short Bio</label>
                      <textarea
                        rows="2"
                        placeholder="What do you build or automate?"
                        value={profileData.bio}
                        onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                        className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue transition-all resize-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm text-text-secondary mb-1.5 flex items-center gap-1.5">
                        <FaLinkedin size={13} /> LinkedIn URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/you"
                        value={profileData.linkedin}
                        onChange={e => setProfileData({ ...profileData, linkedin: e.target.value })}
                        className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue transition-all"
                      />
                    </div>
                  </div>

                  {/* Notification Preferences */}
                  <div className="pt-5 border-t border-border-subtle space-y-3">
                    <h3 className="text-sm font-semibold text-text-primary">Email & Notification Settings</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-bg-primary/40 border border-border-subtle rounded-xl p-4">
                      {[
                        { key: 'emailNotifications', label: 'Enable email notifications' },
                        { key: 'newsletterSubscribed', label: 'Subscribe to newsletter' },
                        { key: 'prefBlogs', label: 'Notify me on new blogs' },
                        { key: 'prefResources', label: 'Notify me on new resources' },
                        { key: 'prefAnnouncements', label: 'Notify me on announcements' },
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-2.5 text-xs text-text-secondary cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={profileData[key]}
                            onChange={e => setProfileData({ ...profileData, [key]: e.target.checked })}
                            className="w-4 h-4 rounded border-border-subtle bg-bg-primary accent-accent-blue cursor-pointer"
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-accent-blue hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-glow-blue cursor-pointer"
                  >
                    <Save size={15} /> Save Changes
                  </button>
                </form>
              </div>

              {/* Change Password */}
              <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 sm:p-8">
                <h2 className="text-lg font-bold text-text-primary mb-5 flex items-center gap-2">
                  <KeyRound size={18} className="text-accent-purple" /> Change Password
                </h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-text-secondary mb-1.5">New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue transition-all"
                        placeholder="Min 6 characters"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1.5">Confirm Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmNewPassword}
                        onChange={e => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                        className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue transition-all"
                        placeholder="Repeat password"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-accent-purple hover:bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                  >
                    <KeyRound size={15} /> Update Password
                  </button>
                </form>
              </div>

              {/* WhatsApp Community Promo */}
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 hover:border-emerald-400/50 p-5 rounded-2xl transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={18} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Join WhatsApp Community</p>
                    <p className="text-xs text-text-muted">Get AI automation tips, n8n workflows & exclusive updates.</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 group-hover:gap-2 transition-all whitespace-nowrap">
                  Join Free <ArrowRight size={12} />
                </span>
              </a>
            </motion.div>
          )}

          {/* ─── Saved Resources Tab ─── */}
          {activeTab === 'saved' && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <BookOpen size={18} className="text-accent-blue" /> Saved Resources
                </h2>
                <Link to="/resources" className="text-xs text-accent-blue hover:underline flex items-center gap-1">
                  Browse All <ArrowRight size={11} />
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-12 text-text-muted text-sm">Loading...</div>
              ) : savedResources.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedResources.map(bookmark => {
                    const details = bookmark.itemDetails;
                    if (!details) return null;
                    const linkPath = `/resources/${details.slug}`;
                    return (
                      <div
                        key={bookmark._id}
                        className="bg-bg-card border border-border-subtle p-5 rounded-2xl hover:border-accent-blue/20 transition-all flex flex-col justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-bg-elevated text-text-muted border border-border-subtle">
                              {details.category || 'Resource'}
                            </span>
                            <button
                              onClick={() => removeBookmark(bookmark.itemType, bookmark.itemId)}
                              className="text-text-muted hover:text-red-500 transition-colors p-1"
                              title="Remove from saved"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <h3 className="font-bold text-text-primary text-sm line-clamp-2">
                            <Link to={linkPath} className="hover:text-accent-blue transition-colors">
                              {details.title}
                            </Link>
                          </h3>
                          {details.description && (
                            <p className="text-xs text-text-muted line-clamp-2 mt-1.5 leading-relaxed">{details.description}</p>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-border-subtle/50 text-[10px] text-text-muted font-mono">
                          <span>Saved {new Date(bookmark.createdAt).toLocaleDateString()}</span>
                          <Link to={linkPath} className="flex items-center gap-1 text-accent-blue hover:underline">
                            Download <Download size={9} />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-bg-card/30 border border-border-subtle rounded-2xl">
                  <Download size={32} className="text-text-muted mx-auto mb-3 opacity-30" />
                  <p className="text-text-muted text-sm mb-4">No saved resources yet.</p>
                  <Link to="/resources" className="text-accent-blue hover:underline text-sm font-medium">
                    Browse Resources →
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {/* ─── Notifications Tab ─── */}
          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <Bell size={18} className="text-accent-blue" /> Notifications
                </h2>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-accent-blue hover:underline font-medium">
                    Mark all as read
                  </button>
                )}
              </div>

              {notifications.length > 0 ? (
                <div className="space-y-2.5">
                  {notifications.map(notif => {
                    const linkPath = notif.link || (notif.blogId ? `/blog/${notif.blogId}` : '');
                    return (
                      <motion.div
                        key={notif._id}
                        layout
                        onMouseEnter={() => !notif.isRead && markNotificationRead(notif._id)}
                        className={`flex items-start justify-between gap-4 p-4 border rounded-2xl transition-all ${
                          notif.isRead
                            ? 'bg-bg-card/40 border-border-subtle opacity-70'
                            : 'bg-accent-blue/5 border-accent-blue/25'
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <span className="text-lg flex-shrink-0 mt-0.5">📢</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-text-primary font-medium leading-snug">{notif.text}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[10px] text-text-muted font-mono">
                              <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                              {linkPath && (
                                <Link to={linkPath} className="text-accent-blue hover:underline flex items-center gap-0.5">
                                  View <ExternalLink size={8} />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteNotification(notif._id)}
                          className="text-text-muted hover:text-red-500 transition-colors p-1 flex-shrink-0"
                          title="Dismiss"
                        >
                          <Trash2 size={13} />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-bg-card/30 border border-border-subtle rounded-2xl">
                  <Bell size={32} className="text-text-muted mx-auto mb-3 opacity-30" />
                  <p className="text-text-muted text-sm">No notifications yet.</p>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
