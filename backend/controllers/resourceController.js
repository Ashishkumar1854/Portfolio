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

// @desc    Get all resources (with filters & search)
// @route   GET /api/resources
// @access  Public
export const getResources = async (req, res) => {
  try {
    const { category, search, isPremium } = req.query;

    let query = {};
    if (category) query.category = category;
    if (isPremium !== undefined) query.isPremium = isPremium === 'true';

    if (search) {
      // Fuzzy search or text index search
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const resources = await Resource.find(query).sort('-createdAt');
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
    const { title, description, category, thumbnail, downloadUrl, isPremium } = req.body;

    const slug = slugify(title);
    const slugExists = await Resource.findOne({ slug });
    if (slugExists) {
      return res.status(400).json({ message: 'A resource with this title slug already exists' });
    }

    const resource = await Resource.create({
      title,
      slug,
      description,
      category,
      thumbnail: thumbnail || '',
      downloadUrl,
      isPremium: isPremium || false,
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

    const { title, description, category, thumbnail, downloadUrl, isPremium } = req.body;

    if (title && title !== resource.title) {
      const slug = slugify(title);
      const slugExists = await Resource.findOne({ slug });
      if (slugExists && slugExists._id.toString() !== resource._id.toString()) {
        return res.status(400).json({ message: 'A resource with this title slug already exists' });
      }
      resource.title = title;
      resource.slug = slug;
    }

    resource.description = description !== undefined ? description : resource.description;
    resource.category = category !== undefined ? category : resource.category;
    resource.thumbnail = thumbnail !== undefined ? thumbnail : resource.thumbnail;
    resource.downloadUrl = downloadUrl !== undefined ? downloadUrl : resource.downloadUrl;
    resource.isPremium = isPremium !== undefined ? isPremium : resource.isPremium;

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
