import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Eye, Lock, ArrowLeft, Bookmark, CheckCircle, FileText, Globe, Key, Zap } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../services/api';

const ResourceDetail = () => {
  const { slug } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const fetchResource = async () => {
    try {
      const { data } = await api.get(`/api/resources/slug/${slug}`);
      setResource(data);

      if (user) {
        const status = await api.get(`/api/bookmarks/check?itemType=Resource&itemId=${data._id}`);
        setBookmarked(status.data.bookmarked);
      }
    } catch (error) {
      console.error('Error fetching resource details:', error);
      toast.error('Failed to load resource details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResource();
  }, [slug, user]);

  // ALL downloads require login now
  const handleDownload = async () => {
    if (!user) {
      toast.error('Please login to download this resource');
      navigate('/login', { state: { from: `/resources/${slug}` } });
      return;
    }

    try {
      const { data } = await api.post(`/api/resources/${resource._id}/download`);
      setResource(prev => ({ ...prev, downloads: prev.downloads + 1 }));
      toast.success('Download starting...');
      setTimeout(() => {
        window.open(data.downloadUrl, '_blank');
      }, 500);
    } catch (error) {
      toast.error('Failed to process download link');
    }
  };

  const handleBookmarkToggle = async () => {
    if (!user) {
      toast.error('Please log in to bookmark resources');
      navigate('/login');
      return;
    }

    setBookmarkLoading(true);
    try {
      const { data } = await api.post('/api/bookmarks/toggle', {
        itemType: 'Resource',
        itemId: resource._id
      });
      setBookmarked(data.bookmarked);
      toast.success(data.message);
    } catch (error) {
      toast.error('Failed to toggle bookmark');
    } finally {
      setBookmarkLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="container py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Resource Not Found</h2>
        <Link to="/resources" className="text-accent-blue hover:underline">Back to Resources</Link>
      </div>
    );
  }

  // Show lock screen if not logged in (for ALL resources)
  const isLocked = !user;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="pb-24 pt-12 min-h-screen"
    >
      <div className="container max-w-4xl px-4 sm:px-6">
        <Link to="/resources" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm font-medium mb-8 group transition-colors">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Resources
        </Link>

        <div className="bg-bg-card border border-border-subtle rounded-3xl overflow-hidden shadow-card p-6 md:p-10 relative">
          
          {/* Header Strip */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8 pb-6 border-b border-border-subtle">
            <div className="flex-1 min-w-0">
              <span className="text-xs font-mono text-accent-cyan uppercase tracking-wider block mb-2">{resource.category}</span>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary leading-tight">{resource.title}</h1>
            </div>

            {user && (
              <button
                onClick={handleBookmarkToggle}
                disabled={bookmarkLoading}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-semibold transition-all ${
                  bookmarked
                    ? 'bg-accent-blue/10 border-accent-blue text-accent-blue'
                    : 'border-border-subtle hover:border-accent-blue/40 text-text-secondary hover:text-text-primary'
                }`}
              >
                <Bookmark size={14} className={bookmarked ? 'fill-accent-blue' : ''} />
                {bookmarked ? 'Saved' : 'Save'}
              </button>
            )}
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap gap-5 text-sm text-text-muted font-mono mb-8">
            <span className="flex items-center gap-1.5"><Download size={15} /> {resource.downloads} downloads</span>
            <span className="flex items-center gap-1.5"><Eye size={15} /> {resource.views} views</span>
            {resource.isPremium && (
              <span className="flex items-center gap-1.5 text-accent-amber"><Zap size={13} fill="currentColor" /> Premium Template</span>
            )}
          </div>

          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Description */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-base font-bold text-text-primary mb-3">Resource Overview</h3>
                <p className="text-text-secondary leading-relaxed text-sm whitespace-pre-line">{resource.description}</p>
              </div>
              
              <div className="bg-bg-primary/40 border border-border-subtle p-5 rounded-2xl space-y-3">
                <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                  <CheckCircle size={16} className="text-accent-green" /> What's Included
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-text-secondary list-disc pl-4 font-light">
                  <li>Full configuration code / blueprint</li>
                  <li>Import instruction readme file</li>
                  <li>Tested on production services</li>
                  <li>Lifetime template updates</li>
                </ul>
              </div>
            </div>

            {/* Download/Lock Card */}
            <div>
              <div className="bg-bg-elevated/40 border border-border-subtle p-6 rounded-2xl flex flex-col gap-5 h-full">
                <div>
                  <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2 text-sm">
                    <FileText size={16} className="text-accent-blue" /> Download Package
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed font-light">
                    Import directly into your automation pipelines. Setup instructions included in the README.
                  </p>
                </div>

                {isLocked ? (
                  <div className="space-y-3 mt-auto">
                    <div className="flex items-start gap-2.5 text-text-muted bg-bg-primary/60 border border-border-subtle p-3.5 rounded-xl text-xs leading-relaxed">
                      <Lock size={15} className="flex-shrink-0 mt-0.5 text-accent-blue" />
                      <span>Free account required to download resources. Takes 30 seconds to sign up.</span>
                    </div>
                    <Link
                      to="/login"
                      state={{ from: `/resources/${slug}` }}
                      className="w-full py-3 bg-accent-blue hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-blue flex items-center justify-center gap-2"
                    >
                      <Key size={13} /> Login to Download
                    </Link>
                    <Link
                      to="/register"
                      className="w-full py-2.5 border border-border-subtle hover:border-accent-blue/30 text-text-secondary hover:text-text-primary rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2"
                    >
                      Create Free Account
                    </Link>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleDownload}
                    className="mt-auto w-full py-3 bg-accent-blue hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-blue flex items-center justify-center gap-2"
                  >
                    <Download size={14} /> Get Resource File
                  </motion.button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default ResourceDetail;
