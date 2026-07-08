import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryHelper.js';
import { triggerNewBlogNotification } from '../utils/notificationHelper.js';

const BLOG_CATEGORIES = ['AI Automation', 'AI Agents', 'n8n', 'SaaS', 'Development', 'System Design', 'Startup Journey', ''];
const BLOG_STATUSES = ['Draft', 'Published', 'Archived'];

const slugify = (text = '') =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');

const parseBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase());
};

const parseArray = (value, fallback = []) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch {
    return String(value).split(',').map((item) => item.trim()).filter(Boolean);
  }
  return fallback;
};

const parseObjectArray = (value, fallback = []) => {
  if (Array.isArray(value)) return value;
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const normalizeStatus = (value, fallback = 'Published') =>
  BLOG_STATUSES.includes(value) ? value : fallback;

const publicBlogQuery = {
  $and: [
    {
      $or: [
        { published: { $exists: false } },
        { published: { $ne: false } },
      ],
    },
    {
      $or: [
        { status: { $exists: false } },
        { status: 'Published' },
      ],
    },
    {
      $or: [
        { noIndex: { $exists: false } },
        { noIndex: { $ne: true } },
      ],
    },
  ],
};

const normalizeBlog = (blog) => {
  const object = blog.toObject ? blog.toObject() : blog;
  return {
    ...object,
    excerpt: object.excerpt || object.subtitle || '',
    subtitle: object.subtitle || object.excerpt || '',
    coverImage: object.coverImage || object.imageUrl || '',
    imageUrl: object.imageUrl || object.coverImage || '',
  };
};

const uniqueSlug = async (text, ignoreId = null) => {
  const baseSlug = slugify(text) || `blog-${Date.now()}`;
  let candidate = baseSlug;
  let counter = 2;

  while (true) {
    const query = { slug: candidate };
    if (ignoreId) query._id = { $ne: ignoreId };
    const existing = await Blog.findOne(query).select('_id');
    if (!existing) return candidate;
    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

const findBlogByIdOrSlug = async (identifier, query = {}) => {
  const idQuery = mongoose.Types.ObjectId.isValid(identifier) ? { _id: identifier } : null;
  const slugQuery = { slug: identifier };
  const lookup = idQuery ? { $or: [idQuery, slugQuery] } : slugQuery;
  return Blog.findOne({ ...lookup, ...query })
    .populate('author', 'name')
    .populate('relatedBlogs', 'title slug excerpt subtitle coverImage imageUrl category readingTime publishedAt createdAt');
};

const getAutomaticRelatedBlogs = async (blog) => {
  const criteria = [];
  if (blog.category) criteria.push({ category: blog.category });
  if (blog.tags?.length) criteria.push({ tags: { $in: blog.tags } });
  if (!criteria.length) return [];

  const related = await Blog.find({
    ...publicBlogQuery,
    _id: { $ne: blog._id },
    $or: criteria,
  })
    .select('title slug excerpt subtitle coverImage imageUrl category readingTime publishedAt createdAt')
    .sort('-featured -publishedAt -createdAt')
    .limit(3)
    .lean();

  return related.map(normalizeBlog);
};

const buildBlogPayload = (body, existing = {}) => {
  const published = parseBoolean(body.published, existing.published ?? true);
  const status = normalizeStatus(body.status, published ? 'Published' : 'Draft');
  const excerpt = body.excerpt ?? body.subtitle ?? existing.excerpt ?? existing.subtitle ?? '';

  return {
    title: body.title ?? existing.title,
    excerpt,
    subtitle: excerpt,
    content: body.content ?? existing.content,
    category: BLOG_CATEGORIES.includes(body.category) ? body.category : existing.category ?? '',
    tags: parseArray(body.tags, existing.tags || []),
    status,
    featured: parseBoolean(body.featured, existing.featured ?? false),
    published: status === 'Published' ? published : false,
    publishedAt: body.publishedAt
      ? new Date(body.publishedAt)
      : existing.publishedAt,
    seoTitle: body.seoTitle ?? existing.seoTitle ?? '',
    seoDescription: body.seoDescription ?? existing.seoDescription ?? '',
    focusKeyword: body.focusKeyword ?? existing.focusKeyword ?? '',
    canonical: body.canonical ?? existing.canonical ?? '',
    noIndex: parseBoolean(body.noIndex, existing.noIndex ?? false),
    relatedBlogs: parseArray(body.relatedBlogs, existing.relatedBlogs || []),
    faq: parseObjectArray(body.faq, existing.faq || []),
  };
};

const uploadBlogImages = async (files = {}, existing = {}) => {
  const updates = {};

  const coverFile = files.coverImage?.[0] || files.image?.[0];
  if (coverFile) {
    if (existing.coverImage || existing.imageUrl) {
      try { await deleteFromCloudinary(existing.coverImage || existing.imageUrl); } catch { /* ignore */ }
    }
    const coverImage = await uploadToCloudinary(coverFile.path, 'blogs/cover');
    updates.coverImage = coverImage;
    updates.imageUrl = coverImage;
  }

  const ogFile = files.ogImage?.[0];
  if (ogFile) {
    if (existing.ogImage) {
      try { await deleteFromCloudinary(existing.ogImage); } catch { /* ignore */ }
    }
    updates.ogImage = await uploadToCloudinary(ogFile.path, 'blogs/og');
  }

  return updates;
};

export const getBlogs = async (req, res) => {
  try {
    const search = req.query.search?.trim();
    const category = req.query.category?.trim();
    const tag = req.query.tag?.trim();
    const featured = req.query.featured;
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 100);

    const query = { ...publicBlogQuery };
    if (category && category !== 'All') query.category = category;
    if (tag && tag !== 'All') query.tags = tag;
    if (featured !== undefined) query.featured = parseBoolean(featured);
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name')
      .sort('-featured -publishedAt -createdAt')
      .limit(limit);

    res.json(blogs.map(normalizeBlog));
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getAdminBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name')
      .populate('relatedBlogs', 'title slug')
      .sort('-createdAt');

    res.json(blogs.map(normalizeBlog));
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getBlog = async (req, res) => {
  try {
    const blog = await findBlogByIdOrSlug(req.params.id, publicBlogQuery);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    await Blog.updateOne({ _id: blog._id }, { $inc: { views: 1 } });
    const normalized = normalizeBlog(blog);
    normalized.views = (normalized.views || 0) + 1;
    if (!normalized.relatedBlogs?.length) {
      normalized.relatedBlogs = await getAutomaticRelatedBlogs(blog);
    }
    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getBlogBySlug = async (req, res) => {
  req.params.id = req.params.slug;
  return getBlog(req, res);
};

export const createBlog = async (req, res) => {
  try {
    const payload = buildBlogPayload(req.body);
    const slug = await uniqueSlug(req.body.slug || payload.title);
    const imageUpdates = await uploadBlogImages(req.files || {});

    const blog = await Blog.create({
      ...payload,
      ...imageUpdates,
      slug,
      author: req.user._id,
      publishedAt: payload.published ? payload.publishedAt || new Date() : undefined,
    });

    if (blog.published && blog.status === 'Published') {
      triggerNewBlogNotification(blog);
    }

    res.status(201).json(normalizeBlog(blog));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const payload = buildBlogPayload(req.body, blog);
    Object.assign(blog, payload);

    if (req.body.slug && req.body.slug !== blog.slug) {
      blog.slug = await uniqueSlug(req.body.slug, blog._id);
    } else if (!blog.slug && blog.title) {
      blog.slug = await uniqueSlug(blog.title, blog._id);
    }

    const imageUpdates = await uploadBlogImages(req.files || {}, blog);
    Object.assign(blog, imageUpdates);

    if (blog.published && blog.status === 'Published' && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }

    const updatedBlog = await blog.save();
    res.json(normalizeBlog(updatedBlog));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (blog.coverImage || blog.imageUrl) {
      try { await deleteFromCloudinary(blog.coverImage || blog.imageUrl); } catch { /* ignore */ }
    }
    if (blog.ogImage) {
      try { await deleteFromCloudinary(blog.ogImage); } catch { /* ignore */ }
    }
    await blog.deleteOne();
    res.json({ message: 'Blog removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const likeBlog = async (req, res) => {
  try {
    const blog = await findBlogByIdOrSlug(req.params.id, publicBlogQuery);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const userId = req.user._id;
    const alreadyLiked = blog.likes.some((id) => id.toString() === userId.toString());
    blog.likes = alreadyLiked
      ? blog.likes.filter((id) => id.toString() !== userId.toString())
      : [...blog.likes, userId];

    await blog.save();
    res.json({ likes: blog.likes, liked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rateBlog = async (req, res) => {
  try {
    const blog = await findBlogByIdOrSlug(req.params.id, publicBlogQuery);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const ratingValue = parseInt(req.body.value, 10);
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const userId = req.user._id;
    const existingIndex = blog.ratings.findIndex((rating) => rating.userId.toString() === userId.toString());
    if (existingIndex !== -1) {
      blog.ratings[existingIndex].value = ratingValue;
    } else {
      blog.ratings.push({ userId, value: ratingValue });
    }

    await blog.save();
    res.json({ ratings: blog.ratings, avgRating: blog.avgRating, userRating: ratingValue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
