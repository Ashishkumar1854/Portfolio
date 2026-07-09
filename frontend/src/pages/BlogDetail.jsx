import { useContext, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calendar, Clock, MessageCircle, Share2, Star, ThumbsUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import useApi from '../hooks/useApi';
import api from '../services/api';
import SEO from '../seo/components/SEO';
import seoConfig from '../seo/config/seoConfig';
import articleSchema from '../seo/schemas/articleSchema';
import faqSchema from '../seo/schemas/faqSchema';

const WHATSAPP_LINK = import.meta.env.VITE_COMMUNITY_WHATSAPP_LINK || '#';

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

const getImage = (blog) => blog?.coverImage || blog?.imageUrl || blog?.ogImage || '';
const getExcerpt = (blog) => blog?.excerpt || blog?.subtitle || '';

const StarRating = ({ value, onChange, disabled }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" disabled={disabled} onClick={() => onChange?.(star)} onMouseEnter={() => !disabled && setHovered(star)} onMouseLeave={() => !disabled && setHovered(0)} className={`transition-all ${disabled ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}>
          <Star size={20} className={`transition-colors ${star <= (hovered || value) ? 'fill-yellow-400 text-yellow-400' : 'text-text-muted/40'}`} />
        </button>
      ))}
    </div>
  );
};

const BlogDetail = () => {
  const { slug, id } = useParams();
  const identifier = slug || id;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { data: blog, loading, error } = useApi(`/api/blogs/${identifier}`);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!blog) return;
    setLikeCount(blog.likes?.length || 0);
    setAvgRating(blog.avgRating || 0);
    setRatingCount(blog.ratings?.length || 0);
    if (user) {
      setLiked(blog.likes?.some((likeId) => likeId === user._id || likeId?._id === user._id) || false);
      const myRating = blog.ratings?.find((rating) => rating.userId === user._id || rating.userId?._id === user._id);
      if (myRating) setUserRating(myRating.value);
    }
  }, [blog, user]);

  const seoMeta = useMemo(() => {
    if (!blog) return {};
    const path = `/blog/${blog.slug || blog._id}`;
    return {
      title: blog.seoTitle || `${blog.title} | Technical Blog`,
      description: blog.seoDescription || getExcerpt(blog) || seoConfig.defaults.description,
      keywords: [blog.focusKeyword, blog.category, ...(blog.tags || [])].filter(Boolean),
      canonical: blog.canonical || `${seoConfig.site.baseUrl}${path}`,
      ogImage: blog.ogImage || getImage(blog) || seoConfig.branding.ogImage,
      index: !blog.noIndex,
      follow: true,
      ogType: 'article',
      publishedTime: blog.publishedAt || blog.createdAt,
      modifiedTime: blog.updatedAt,
      path,
      breadcrumbItems: [
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: blog.title, url: path },
      ],
    };
  }, [blog]);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like this article');
      navigate('/login');
      return;
    }
    try {
      const { data } = await api.post(`/api/blogs/${blog.slug || blog._id}/like`);
      setLiked(data.liked);
      setLikeCount(data.likes.length);
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
      const { data } = await api.post(`/api/blogs/${blog.slug || blog._id}/rate`, { value });
      setAvgRating(data.avgRating);
      setRatingCount(data.ratings.length);
      setUserRating(data.userRating);
    } catch {
      toast.error('Failed to submit rating');
    } finally {
      setRatingSubmitting(false);
    }
  };

  const canonicalShareUrl = seoMeta.canonical || (blog ? `${seoConfig.site.baseUrl}/blog/${blog.slug || blog._id}` : '');
  const encodedShareUrl = encodeURIComponent(canonicalShareUrl);
  const encodedShareTitle = encodeURIComponent(blog?.title || 'Technical Blog');

  const handleShare = () => {
    navigator.clipboard.writeText(canonicalShareUrl)
      .then(() => toast.success('Link copied'))
      .catch(() => toast.error('Failed to copy link'));
  };

  if (loading) {
    return <div className="container max-w-4xl py-24 space-y-6">{[1, 2, 3].map((item) => <div key={item} className="h-32 animate-pulse rounded-2xl bg-bg-card" />)}</div>;
  }

  if (error || !blog) {
    return (
      <div className="container py-24 text-center">
        <BookOpen size={48} className="mx-auto mb-4 text-text-muted opacity-30" />
        <h2 className="mb-4 text-2xl font-bold text-text-primary">Article not found</h2>
        <Link to="/blog" className="text-accent-blue hover:underline">Back to Blog</Link>
      </div>
    );
  }

  const image = getImage(blog);
  const toc = blog.tableOfContents || [];
  const related = blog.relatedBlogs || [];

  return (
    <>
      <SEO page="blog" meta={seoMeta} schemas={[articleSchema({
        ...blog,
        description: seoMeta.description,
        image,
        ogImage: seoMeta.ogImage,
        keywords: seoMeta.keywords,
      }), faqSchema(blog.faq)]} />
      <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-transparent">
        <div className="h-full bg-accent-purple transition-all duration-150" style={{ width: `${progress}%` }} />
      </div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }} className="relative overflow-hidden pb-28 pt-8">
        <div className="absolute inset-x-0 top-0 h-[30rem] bg-gradient-to-b from-accent-purple/7 via-accent-blue/5 to-transparent pointer-events-none" />
        <div className="container relative max-w-7xl">
          <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 rounded-lg text-sm font-medium text-text-muted transition-colors hover:text-text-primary">
            <ArrowLeft size={18} /> Back to Blog
          </button>

          <section className="mb-12 grid gap-8 lg:grid-cols-[1fr_0.42fr]">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-mono text-text-muted">
                {blog.category && <span className="rounded-full border border-border-subtle bg-bg-card px-3 py-1">{blog.category}</span>}
                <span className="flex items-center gap-1"><Calendar size={12} /> Published {formatDate(blog.publishedAt || blog.createdAt)}</span>
                <span className="flex items-center gap-1">Updated {formatDate(blog.updatedAt)}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {blog.readingTime || 1} min read</span>
                <span className="flex items-center gap-1"><ThumbsUp size={12} /> {likeCount}</span>
              </div>
              <h1 className="font-display text-4xl font-bold leading-tight text-text-primary md:text-6xl">{blog.title}</h1>
              {getExcerpt(blog) && <p className="mt-6 max-w-3xl text-lg leading-8 text-text-secondary">{getExcerpt(blog)}</p>}
            </div>
            <aside className="rounded-[1.5rem] border border-border-subtle bg-bg-card/85 p-5 shadow-xl backdrop-blur lg:sticky lg:top-28 lg:self-start">
              <p className="mb-3 text-xs font-mono uppercase tracking-widest text-accent-purple">Article Tools</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={handleLike} className={`rounded-xl border px-4 py-2 text-sm font-bold ${liked ? 'border-accent-purple bg-accent-purple/10 text-accent-purple' : 'border-border-subtle text-text-secondary hover:text-text-primary'}`}>Like · {likeCount}</button>
                <button onClick={handleShare} className="inline-flex items-center gap-2 rounded-xl border border-border-subtle px-4 py-2 text-sm font-bold text-text-secondary hover:text-text-primary"><Share2 size={14} /> Copy Link</button>
                <a href={`https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodedShareTitle}`} target="_blank" rel="noreferrer" className="rounded-xl border border-border-subtle px-4 py-2 text-sm font-bold text-text-secondary hover:text-text-primary">Twitter</a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`} target="_blank" rel="noreferrer" className="rounded-xl border border-border-subtle px-4 py-2 text-sm font-bold text-text-secondary hover:text-text-primary">LinkedIn</a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`} target="_blank" rel="noreferrer" className="rounded-xl border border-border-subtle px-4 py-2 text-sm font-bold text-text-secondary hover:text-text-primary">Facebook</a>
                <a href={`https://wa.me/?text=${encodedShareTitle}%20${encodedShareUrl}`} target="_blank" rel="noreferrer" className="rounded-xl border border-border-subtle px-4 py-2 text-sm font-bold text-text-secondary hover:text-text-primary">WhatsApp</a>
              </div>
              <div className="mt-5 border-t border-border-subtle pt-5">
                <p className="mb-2 text-sm font-semibold text-text-primary">Rate this article</p>
                <StarRating value={userRating || Math.round(avgRating)} onChange={handleRating} disabled={ratingSubmitting || !user} />
                <p className="mt-2 text-xs text-text-muted">{ratingCount ? `${avgRating}/5 avg · ${ratingCount} ratings` : 'No ratings yet'}</p>
              </div>
              {toc.length > 0 && (
                <nav className="mt-5 border-t border-border-subtle pt-5">
                  <p className="mb-3 text-sm font-semibold text-text-primary">On this page</p>
                  <div className="space-y-2">
                    {toc.map((item, index) => <a key={index} href={`#${item.anchor}`} className="block text-sm text-text-secondary hover:text-accent-purple">{item.title}</a>)}
                  </div>
                </nav>
              )}
            </aside>
          </section>

          {image && (
            <div className="mb-12 overflow-hidden rounded-[2rem] border border-border-subtle bg-bg-card p-3 shadow-[0_30px_100px_rgba(15,23,42,0.14)]">
              <img src={image} alt={blog.title} className="max-h-[34rem] w-full rounded-[1.5rem] object-cover" />
            </div>
          )}

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <article className="blog-content prose prose-invert prose-lg max-w-none rounded-[2rem] border border-border-subtle bg-bg-card/80 p-6 shadow-xl md:p-10 prose-headings:font-display prose-headings:text-text-primary prose-p:leading-8 prose-p:text-text-secondary prose-a:text-accent-blue prose-strong:text-text-primary prose-code:text-accent-cyan prose-pre:rounded-2xl prose-blockquote:border-accent-purple prose-img:rounded-2xl" dangerouslySetInnerHTML={{ __html: blog.content }} />
            <aside className="space-y-5">
              <div className="rounded-2xl border border-border-subtle bg-bg-card p-5">
                <p className="mb-3 text-sm font-bold text-text-primary">Tags</p>
                <div className="flex flex-wrap gap-2">{(blog.tags || []).map((tag) => <span key={tag} className="rounded-full bg-bg-elevated px-3 py-1 text-xs font-mono text-text-muted">#{tag}</span>)}</div>
              </div>
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="block rounded-2xl border border-accent-green/20 bg-accent-green/10 p-5 text-accent-green transition-all hover:-translate-y-1">
                <MessageCircle size={20} className="mb-3" />
                <p className="font-bold">Discuss this topic</p>
                <p className="mt-1 text-sm opacity-80">Join the community conversation.</p>
              </a>
            </aside>
          </div>

          {blog.faq?.length > 0 && (
            <section className="mt-14">
              <h2 className="mb-5 font-display text-2xl font-bold text-text-primary">FAQ</h2>
              <div className="grid gap-4 md:grid-cols-2">{blog.faq.map((item, index) => <div key={index} className="rounded-2xl border border-border-subtle bg-bg-card p-6"><h3 className="font-bold text-text-primary">{item.question}</h3><p className="mt-2 leading-7 text-text-secondary">{item.answer}</p></div>)}</div>
            </section>
          )}

          {related.length > 0 && (
            <section className="mt-14">
              <h2 className="mb-5 font-display text-2xl font-bold text-text-primary">Related Blogs</h2>
              <div className="grid gap-5 md:grid-cols-3">{related.map((item) => <Link key={item._id} to={`/blog/${item.slug || item._id}`} className="rounded-2xl border border-border-subtle bg-bg-card p-5 transition-all hover:-translate-y-1 hover:border-accent-purple/40"><h3 className="font-bold text-text-primary">{item.title}</h3><p className="mt-2 line-clamp-2 text-sm text-text-secondary">{item.excerpt || item.subtitle}</p></Link>)}</div>
            </section>
          )}

          <section className="mt-14 rounded-[2rem] border border-accent-purple/20 bg-gradient-to-br from-accent-purple/12 via-bg-card to-accent-blue/10 p-8 text-center md:p-12">
            <h2 className="font-display text-3xl font-bold text-text-primary">Need this thinking applied to your product?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-text-secondary">I help founders and teams design AI automation, SaaS platforms, and production web systems.</p>
            <Link to="/hire" className="mt-6 inline-flex rounded-2xl bg-accent-purple px-6 py-3 font-bold text-white shadow-glow-purple transition-all hover:-translate-y-1">Hire Me</Link>
          </section>
        </div>
      </motion.div>
    </>
  );
};

export default BlogDetail;
