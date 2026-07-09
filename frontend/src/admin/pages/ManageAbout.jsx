import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Upload, FileText, ArrowRight, Save, Trash2, Plus, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ManageAbout = () => {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [bioTitle, setBioTitle] = useState('');
  const [bioSubtitle, setBioSubtitle] = useState('');
  
  // 3 Bio paragraphs state
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [p3, setP3] = useState('');

  // Contact States
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [followUrl, setFollowUrl] = useState('');

  const [currentAvatarUrl, setCurrentAvatarUrl] = useState('');
  const [currentResumeUrl, setCurrentResumeUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  const [whyChooseMe, setWhyChooseMe] = useState([]);
  const [newChooseTitle, setNewChooseTitle] = useState('');
  const [newChooseDesc, setNewChooseDesc] = useState('');

  useEffect(() => {
    fetchAboutInfo();
  }, []);

  const fetchAboutInfo = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/about');
      if (data) {
        setBioTitle(data.bioTitle || '');
        setBioSubtitle(data.bioSubtitle || '');
        
        // Populate paragraphs
        const paragraphs = data.bioParagraphs || [];
        setP1(paragraphs[0] || '');
        setP2(paragraphs[1] || '');
        setP3(paragraphs[2] || '');

        setCurrentAvatarUrl(data.avatarUrl || '');
        setCurrentResumeUrl(data.resumeUrl || '');
        setWhyChooseMe(data.whyChooseMe || []);

        setContactEmail(data.contactEmail || '');
        setContactPhone(data.contactPhone || '');
        setContactAddress(data.contactAddress || '');
        setFollowUrl(data.followUrl || '');
      }
    } catch {
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddChooseMe = () => {
    if (!newChooseTitle.trim() || !newChooseDesc.trim()) return;
    setWhyChooseMe([...whyChooseMe, { title: newChooseTitle.trim(), desc: newChooseDesc.trim() }]);
    setNewChooseTitle('');
    setNewChooseDesc('');
  };

  const handleRemoveChooseMe = (idx) => {
    setWhyChooseMe(whyChooseMe.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('bioTitle', bioTitle);
    formData.append('bioSubtitle', bioSubtitle);
    
    // Combine paragraphs
    const paragraphs = [p1, p2, p3].filter(p => p.trim() !== '');
    formData.append('bioParagraphs', JSON.stringify(paragraphs));
    formData.append('whyChooseMe', JSON.stringify(whyChooseMe));
    formData.append('contactEmail', contactEmail);
    formData.append('contactPhone', contactPhone);
    formData.append('contactAddress', contactAddress);
    formData.append('followUrl', followUrl);

    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }

    try {
      const { data } = await api.put('/api/about', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Profile details updated successfully');
      setCurrentAvatarUrl(data.avatarUrl || '');
      setCurrentResumeUrl(data.resumeUrl || '');
      setAvatarFile(null);
      setResumeFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="pb-12 space-y-8"
    >
      <div>
        <h1 className="text-3xl font-display font-bold text-text-primary">About Profile Editor</h1>
        <p className="text-text-secondary text-sm mt-1">Configure your bio descriptions, profile photo, downloadable resume document, and choose-me items.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left / Middle: Text Configurations */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 shadow-xl space-y-6">
              <h2 className="text-lg font-display font-bold text-text-primary flex items-center gap-2">
                <User size={18} className="text-accent-blue" /> Bio Section
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-2">Subheading / Eyebrow</label>
                  <input
                    type="text"
                    value={bioSubtitle}
                    onChange={(e) => setBioSubtitle(e.target.value)}
                    placeholder="e.g. Who I Am"
                    className="w-full bg-bg-primary border border-border-subtle hover:border-text-muted rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-blue transition-all text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-2">Main Heading</label>
                  <input
                    type="text"
                    value={bioTitle}
                    onChange={(e) => setBioTitle(e.target.value)}
                    placeholder="e.g. AI Automation Engineer & SaaS Product Builder"
                    className="w-full bg-bg-primary border border-border-subtle hover:border-text-muted rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-blue transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* Bio Paragraphs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-2">Paragraph 1 (Intro)</label>
                  <textarea
                    value={p1}
                    onChange={(e) => setP1(e.target.value)}
                    placeholder="Introduce yourself..."
                    className="w-full bg-bg-primary border border-border-subtle hover:border-text-muted rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-blue transition-all text-sm h-20 resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-2">Paragraph 2 (SaaS / Experience)</label>
                  <textarea
                    value={p2}
                    onChange={(e) => setP2(e.target.value)}
                    placeholder="Describe professional SaaS work, projects, hackathons..."
                    className="w-full bg-bg-primary border border-border-subtle hover:border-text-muted rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-blue transition-all text-sm h-20 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-2">Paragraph 3 (Philosophy / Handoff)</label>
                  <textarea
                    value={p3}
                    onChange={(e) => setP3(e.target.value)}
                    placeholder="Explain your approach, outcomes, etc..."
                    className="w-full bg-bg-primary border border-border-subtle hover:border-text-muted rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-blue transition-all text-sm h-20 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Contact Details Editor */}
            <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 shadow-xl space-y-6">
              <h2 className="text-lg font-display font-bold text-text-primary flex items-center gap-2">
                <Mail size={18} className="text-accent-blue" /> Contact & Social Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. contact@domain.com"
                    className="w-full bg-bg-primary border border-border-subtle hover:border-text-muted rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-blue transition-all text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-2">Contact Number</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-bg-primary border border-border-subtle hover:border-text-muted rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-blue transition-all text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-2">Location / Address</label>
                  <input
                    type="text"
                    value={contactAddress}
                    onChange={(e) => setContactAddress(e.target.value)}
                    placeholder="e.g. New Delhi, India"
                    className="w-full bg-bg-primary border border-border-subtle hover:border-text-muted rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-blue transition-all text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider mb-2">Follow Button Link (e.g. LinkedIn / Instagram)</label>
                  <input
                    type="url"
                    value={followUrl}
                    onChange={(e) => setFollowUrl(e.target.value)}
                    placeholder="e.g. https://linkedin.com/in/username"
                    className="w-full bg-bg-primary border border-border-subtle hover:border-text-muted rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-blue transition-all text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Why Choose Me section */}
            <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-lg font-display font-bold text-text-primary">Why Choose Me Checklist</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newChooseTitle}
                  onChange={(e) => setNewChooseTitle(e.target.value)}
                  placeholder="Key selling title (e.g. Full-Stack Ownership)..."
                  className="bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-text-primary text-xs"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newChooseDesc}
                    onChange={(e) => setNewChooseDesc(e.target.value)}
                    placeholder="Short description..."
                    className="flex-grow bg-bg-primary border border-border-subtle rounded-xl px-4 py-2.5 text-text-primary text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddChooseMe}
                    className="px-4 bg-bg-elevated border border-border-subtle rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 text-xs font-semibold cursor-pointer"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3 p-3 bg-bg-primary/20 border border-border-subtle rounded-xl max-h-60 overflow-y-auto">
                {whyChooseMe.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-4 p-3 bg-bg-elevated/40 rounded-lg border border-border-subtle/40">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-text-primary">{item.title}</h4>
                      <p className="text-[11px] text-text-secondary leading-relaxed">{item.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveChooseMe(idx)}
                      className="text-text-muted hover:text-red-500 mt-0.5"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                {whyChooseMe.length === 0 && <span className="text-[10px] text-text-muted block text-center py-4">No selling points configured yet.</span>}
              </div>
            </div>
          </div>

          {/* Right: Files Upload (Avatar & Resume) */}
          <div className="space-y-6">
            <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 shadow-xl space-y-6">
              <h2 className="text-lg font-display font-bold text-text-primary flex items-center gap-2">
                <Upload size={18} className="text-accent-purple" /> File Assets
              </h2>

              {/* Avatar upload */}
              <div className="space-y-3">
                <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider">Profile Avatar Image</label>
                <div className="flex items-center gap-4">
                  {currentAvatarUrl ? (
                    <img 
                      src={currentAvatarUrl} 
                      alt="Avatar" 
                      className="w-16 h-16 rounded-full border border-border-subtle object-cover bg-bg-primary"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-bg-primary border border-border-subtle flex items-center justify-center font-bold text-text-muted">
                      No Photo
                    </div>
                  )}
                  <div className="flex-grow">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={(e) => setAvatarFile(e.target.files[0])}
                      className="text-xs text-text-secondary w-full"
                    />
                    <p className="text-[10px] text-text-muted mt-1">Accepts JPG, PNG, WEBP. Uploads to Cloudinary.</p>
                  </div>
                </div>
              </div>

              {/* Resume upload */}
              <div className="space-y-3 pt-4 border-t border-border-subtle/50">
                <label className="block text-text-secondary text-xs font-mono uppercase tracking-wider">Resume PDF / DOC Document</label>
                <div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="text-xs text-text-secondary w-full"
                  />
                  <p className="text-[10px] text-text-muted mt-1">Accepts PDF, DOC, DOCX. Uploads to Cloudinary.</p>
                  
                  {currentResumeUrl && (
                    <div className="mt-3 bg-bg-elevated border border-border-subtle rounded-xl p-3 flex justify-between items-center">
                      <span className="text-xs text-text-secondary flex items-center gap-1.5 truncate pr-2">
                        <FileText size={14} className="text-accent-blue" /> Current Resume File
                      </span>
                      <a 
                        href={currentResumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-accent-blue hover:underline whitespace-nowrap flex items-center gap-1"
                      >
                        Download <ArrowRight size={12} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Save Buttons */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent-blue hover:bg-blue-600 disabled:bg-accent-blue/50 text-white font-medium py-3.5 rounded-xl transition-all shadow-lg shadow-accent-blue/10 hover:shadow-accent-blue/20 flex items-center justify-center gap-2 group cursor-pointer"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  Save Settings
                </>
              )}
            </button>
          </div>

        </div>
      </form>
    </motion.div>
  );
};

export default ManageAbout;
