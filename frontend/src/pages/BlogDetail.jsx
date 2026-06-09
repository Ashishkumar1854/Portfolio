import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, BookOpen, ThumbsUp, Share2, Star, MessageCircle, ExternalLink } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import useApi from '../hooks/useApi';
import api from '../services/api';
import toast from 'react-hot-toast';

const WHATSAPP_LINK = import.meta.env.VITE_COMMUNITY_WHATSAPP_LINK || '#';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const readingTime = (html = '') => {
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

const StarRating = ({ value, onChange, disabled }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => !disabled && setHovered(star)}
          onMouseLeave={() => !disabled && setHovered(0)}
          className={`transition-all ${disabled ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
        >
          <Star
            size={20}
            className={`transition-colors ${
              star <= (hovered || value)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-text-muted/40'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { data: blog, loading, error } = useApi(`/api/blogs/${id}`);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  useEffect(() => {
    if (blog) {
      setLikeCount(blog.likes?.length || 0);
      setAvgRating(blog.avgRating || 0);
      setRatingCount(blog.ratings?.length || 0);
      if (user) {
        setLiked(blog.likes?.some(lid => lid === user._id || lid?._id === user._id) || false);
        const myRating = blog.ratings?.find(r => r.userId === user._id || r.userId?._id === user._id);
        if (myRating) setUserRating(myRating.value);
      }
    }
  }, [blog, user]);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like this article');
      navigate('/login');
      return;
    }
    try {
      const { data } = await api.post(`/api/blogs/${id}/like`);
      setLiked(data.liked);
      setLikeCount(data.likes.length);
      toast.success(data.liked ? '❤️ Liked!' : 'Like removed');
    } catch {
      toast.error('Failed to update like');
    }
  };

  const handleRating = async (value) => {
    if (!user) {
      toast.error('Please login to rate this article');
      navigate('/login');
      return;
    }
    setRatingSubmitting(true);
    try {
      const { data } = await api.post(`/api/blogs/${id}/rate`, { value });
      setAvgRating(data.avgRating);
      setRatingCount(data.ratings.length);
      setUserRating(data.userRating);
      toast.success(`Rated ${value}/5 ⭐`);
    } catch {
      toast.error('Failed to submit rating');
    } finally {
      setRatingSubmitting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success('Link copied to clipboard!'))
      .catch(() => toast.error('Failed to copy link'));
  };

  if (loading) {
    return (
      <div className="container max-w-3xl py-24 space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-bg-card animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container py-24 text-center">
        <BookOpen size={48} className="text-text-muted mx-auto mb-4 opacity-30" />
        <h2 className="text-2xl font-bold text-text-primary mb-4">Article not found</h2>
        <Link to="/blog" className="text-accent-blue hover:underline">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="pb-24 pt-8"
    >
      <div className="container max-w-3xl mx-auto px-4 sm:px-6">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors mb-10 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Blog</span>
        </button>

        {/* Hero image */}
        {blog.imageUrl && (
          <div className="h-56 sm:h-72 md:h-80 rounded-2xl overflow-hidden mb-10 shadow-card border border-border-subtle">
            <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-text-muted mb-5">
          {blog.category && (
            <span className="px-3 py-1 bg-bg-elevated border border-border-subtle rounded-full">{blog.category}</span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar size={11} /> {formatDate(blog.createdAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={11} /> {readingTime(blog.content)} min read
          </span>
          <span className="flex items-center gap-1.5">
            <ThumbsUp size={11} /> {likeCount}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-5 leading-tight">
          {blog.title}
        </h1>

        {/* Subtitle */}
        {blog.subtitle && (
          <p className="text-lg text-text-secondary mb-10 leading-relaxed border-l-4 border-accent-blue/40 pl-5">
            {blog.subtitle}
          </p>
        )}

        {/* Rich text content */}
        <article
          className="blog-content prose prose-invert prose-lg max-w-none
            prose-headings:font-display prose-headings:text-text-primary
            prose-p:text-text-secondary prose-p:leading-relaxed
            prose-a:text-accent-blue prose-a:no-underline hover:prose-a:underline
            prose-strong:text-text-primary
            prose-code:text-accent-cyan prose-code:text-sm
            prose-pre:rounded-2xl
            prose-blockquote:border-accent-blue prose-blockquote:text-text-secondary
            prose-img:rounded-2xl prose-img:border prose-img:border-border-subtle
            prose-li:text-text-secondary"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Action Bar: Like | Share | Rating */}
        <div className="mt-12 bg-bg-card/60 border border-border-subtle p-5 sm:p-6 rounded-2xl backdrop-blur-md space-y-5">
          
          {/* Like & Share */}
          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                liked
                  ? 'bg-accent-blue/10 border-accent-blue text-accent-blue'
                  : 'border-border-subtle hover:border-accent-blue/50 text-text-secondary hover:text-text-primary'
              }`}
            >
              <ThumbsUp size={15} className={liked ? 'fill-accent-blue' : ''} />
              {liked ? 'Liked' : 'Like'} · {likeCount}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border border-border-subtle hover:border-accent-blue/50 text-text-secondary hover:text-text-primary"
            >
              <Share2 size={15} />
              Share
            </motion.button>
          </div>

          {/* Rating */}
          <div className="border-t border-border-subtle pt-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary mb-0.5">Rate this article</p>
                <p className="text-xs text-text-muted">
                  {ratingCount > 0 ? `${avgRating}/5 avg · ${ratingCount} rating${ratingCount > 1 ? 's' : ''}` : 'No ratings yet — be the first!'}
                </p>
              </div>
              <div className="flex flex-col sm:items-end gap-1.5">
                {user ? (
                  <>
                    <StarRating value={userRating} onChange={handleRating} disabled={ratingSubmitting} />
                    {userRating > 0 && (
                      <span className="text-[11px] text-text-muted">Your rating: {userRating}/5</span>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <StarRating value={Math.round(avgRating)} disabled />
                    <Link to="/login" className="text-xs text-accent-blue hover:underline whitespace-nowrap">Login to rate</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Join Community CTA */}
        <motion.a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-emerald-500/10 via-emerald-400/5 to-transparent border border-emerald-500/25 hover:border-emerald-400/50 p-5 sm:p-6 rounded-2xl transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
              <MessageCircle size={22} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary mb-0.5">Join the WhatsApp Community</p>
              <p className="text-xs text-text-muted leading-relaxed">Get notified about new articles, AI automation tips & workflow templates — directly on WhatsApp.</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 whitespace-nowrap group-hover:gap-2.5 transition-all">
            Join Free <ExternalLink size={12} />
          </div>
        </motion.a>

        {/* Bottom nav */}
        <div className="mt-14 pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
          >
            <ArrowLeft size={15} /> Back to Blog
          </button>
          <Link
            to="/hire"
            className="px-6 py-3 bg-accent-blue hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-glow-blue"
          >
            Work With Me →
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogDetail;
