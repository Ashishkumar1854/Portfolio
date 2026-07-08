import Resource from '../models/Resource.js';
import { triggerNewResourceNotification } from '../utils/notificationHelper.js';

// Helper to convert title to URL safe slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

const parseArray = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map((item) => String(item).trim()).filter(Boolean);
  } catch {
    // Fall back to comma/newline separated values.
  }
  return String(value).split(/,|\n/).map((item) => item.trim()).filter(Boolean);
};

const parseBoolean = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return value === true || value === 'true' || value === 'on';
};

const parseJsonArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const normalizeFaq = (value) =>
  parseJsonArray(value)
    .map((item) => ({
      question: item.question || '',
      answer: item.answer || '',
    }))
    .filter((item) => item.question && item.answer);

const normalizeScreenshots = (value) =>
  parseJsonArray(value)
    .map((item) => ({
      image: item.image || '',
      alt: item.alt || '',
      caption: item.caption || '',
    }))
    .filter((item) => item.image);

const normalizeChangelog = (value) =>
  parseJsonArray(value)
    .map((item) => ({
      version: item.version || '',
      date: item.date || undefined,
      notes: item.notes || '',
    }))
    .filter((item) => item.version || item.notes);

const buildResourcePayload = (body, existing = {}) => ({
  title: body.title ?? existing.title,
  description: body.description ?? existing.description,
  excerpt: body.excerpt ?? existing.excerpt ?? '',
  category: body.category ?? existing.category,
  thumbnail: body.thumbnail ?? existing.thumbnail ?? '',
  ogImage: body.ogImage ?? existing.ogImage ?? '',
  downloadUrl: body.downloadUrl ?? existing.downloadUrl,
  resourceType: body.resourceType ?? existing.resourceType ?? 'Template',
  difficulty: body.difficulty ?? existing.difficulty ?? 'Beginner',
  isPremium: body.isPremium !== undefined ? parseBoolean(body.isPremium) : existing.isPremium ?? false,
  featured: body.featured !== undefined ? parseBoolean(body.featured) : existing.featured ?? false,
  version: body.version ?? existing.version ?? '1.0.0',
  author: body.author ?? existing.author ?? 'Ashish Kumar',
  tags: body.tags !== undefined ? parseArray(body.tags) : existing.tags ?? [],
  features: body.features !== undefined ? parseArray(body.features) : existing.features ?? [],
  includedFiles: body.includedFiles !== undefined ? parseArray(body.includedFiles) : existing.includedFiles ?? [],
  requirements: body.requirements !== undefined ? parseArray(body.requirements) : existing.requirements ?? [],
  installationGuide: body.installationGuide ?? existing.installationGuide ?? '',
  usage: body.usage ?? existing.usage ?? '',
  screenshots: body.screenshots !== undefined ? normalizeScreenshots(body.screenshots) : existing.screenshots ?? [],
  faq: body.faq !== undefined ? normalizeFaq(body.faq) : existing.faq ?? [],
  changelog: body.changelog !== undefined ? normalizeChangelog(body.changelog) : existing.changelog ?? [],
  publishedAt: body.publishedAt ? new Date(body.publishedAt) : existing.publishedAt ?? new Date(),
  updatedAtDisplay: body.updatedAtDisplay ? new Date(body.updatedAtDisplay) : existing.updatedAtDisplay,
  seo: {
    metaTitle: body.metaTitle ?? existing.seo?.metaTitle ?? '',
    metaDescription: body.metaDescription ?? existing.seo?.metaDescription ?? '',
    focusKeyword: body.focusKeyword ?? existing.seo?.focusKeyword ?? '',
    canonical: body.canonical ?? existing.seo?.canonical ?? '',
    ogImage: body.seoOgImage ?? existing.seo?.ogImage ?? '',
    robots: body.robots ?? existing.seo?.robots ?? 'index, follow',
  },
});

// @desc    Get all resources (with filters & search)
// @route   GET /api/resources
// @access  Public
export const getResources = async (req, res) => {
  try {
    const { category, search, isPremium, difficulty, tag, featured, sort = 'newest' } = req.query;

    let query = {};
    if (category) query.category = category;
    if (isPremium !== undefined) query.isPremium = isPremium === 'true';
    if (difficulty) query.difficulty = difficulty;
    if (tag) query.tags = tag;
    if (featured !== undefined) query.featured = featured === 'true';

    if (search) {
      // Fuzzy search or text index search
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const sortMap = {
      newest: '-createdAt',
      updated: '-updatedAtDisplay -updatedAt',
      popular: '-views -downloads',
      downloads: '-downloads',
      title: 'title',
    };

    const resources = await Resource.find(query).sort(sortMap[sort] || sortMap.newest);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single resource by slug
// @route   GET /api/resources/:slug
// @access  Public
export const getResourceBySlug = async (req, res) => {
  try {
    const resource = await Resource.findOne({ slug: req.params.slug });

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Increment view counts
    resource.views += 1;
    await resource.save();

    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Track downloads count
// @route   POST /api/resources/:id/download
// @access  Public (Requires auth checked inside controller for premium)
export const trackDownload = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Double check auth for premium resources
    if (resource.isPremium && !req.cookies.jwt) {
      return res.status(401).json({ message: 'Authentication required for premium resources' });
    }

    resource.downloads += 1;
    await resource.save();

    res.json({ downloads: resource.downloads, downloadUrl: resource.downloadUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new resource (Admin only)
// @route   POST /api/resources
// @access  Private/Admin
export const createResource = async (req, res) => {
  try {
    const payload = buildResourcePayload(req.body);

    const slug = slugify(req.body.slug || payload.title);
    const slugExists = await Resource.findOne({ slug });
    if (slugExists) {
      return res.status(400).json({ message: 'A resource with this title slug already exists' });
    }

    const resource = await Resource.create({
      ...payload,
      slug,
    });

    // Send notifications to subscribers
    triggerNewResourceNotification(resource);

    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a resource (Admin only)
// @route   PUT /api/resources/:id
// @access  Private/Admin
export const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const payload = buildResourcePayload(req.body, resource);

    if (req.body.slug && req.body.slug !== resource.slug) {
      const slug = slugify(req.body.slug);
      const slugExists = await Resource.findOne({ slug });
      if (slugExists && slugExists._id.toString() !== resource._id.toString()) {
        return res.status(400).json({ message: 'A resource with this title slug already exists' });
      }
      resource.slug = slug;
    } else if (payload.title && payload.title !== resource.title) {
      const slug = slugify(payload.title);
      const slugExists = await Resource.findOne({ slug });
      if (slugExists && slugExists._id.toString() !== resource._id.toString()) {
        return res.status(400).json({ message: 'A resource with this title slug already exists' });
      }
      resource.slug = slug;
    }

    Object.assign(resource, payload);

    const updatedResource = await resource.save();
    res.json(updatedResource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a resource (Admin only)
// @route   DELETE /api/resources/:id
// @access  Private/Admin
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    await resource.deleteOne();
    res.json({ message: 'Resource removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
