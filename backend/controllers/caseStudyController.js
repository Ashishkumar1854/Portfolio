import mongoose from 'mongoose';
import CaseStudy from '../models/CaseStudy.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryHelper.js';
import { triggerNewCaseStudyNotification } from '../utils/notificationHelper.js';

const CASE_CATEGORIES = ['SaaS', 'AI Automation', 'WhatsApp Automation', 'n8n', 'Full Stack', 'Other', ''];
const CASE_STATUSES = ['Draft', 'Published', 'Archived'];

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

const parseObject = (value, fallback = {}) => {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const normalizeStatus = (value, fallback = 'Published') =>
  CASE_STATUSES.includes(value) ? value : fallback;

const publicCaseStudyQuery = {
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

const publicReadableCaseStudyQuery = {
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
  ],
};

const normalizeCaseStudy = (caseStudy) => {
  const object = caseStudy.toObject ? caseStudy.toObject({ virtuals: true }) : caseStudy;
  const screenshots = object.screenshots || [];
  const gallery = object.gallery?.length
    ? object.gallery
    : screenshots.map((url) => ({ url, caption: '' }));

  return {
    ...object,
    excerpt: object.excerpt || object.subtitle || object.overview || '',
    subtitle: object.subtitle || object.excerpt || object.overview || '',
    coverImage: object.coverImage || object.imageUrl || '',
    imageUrl: object.imageUrl || object.coverImage || '',
    challenge: object.challenge || object.problem || '',
    problem: object.problem || object.challenge || '',
    solution: object.solution || object.architecture || '',
    conclusion: object.conclusion || object.lessonsLearned || '',
    lessonsLearned: object.lessonsLearned || object.conclusion || '',
    industry: object.industry || object.category || '',
    gallery,
    screenshots,
  };
};

const uniqueSlug = async (text, ignoreId = null) => {
  const baseSlug = slugify(text) || `case-study-${Date.now()}`;
  let candidate = baseSlug;
  let counter = 2;

  while (true) {
    const query = { slug: candidate };
    if (ignoreId) query._id = { $ne: ignoreId };
    const existing = await CaseStudy.findOne(query).select('_id');
    if (!existing) return candidate;
    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

const findCaseStudyByIdOrSlug = async (identifier, query = {}) => {
  const idQuery = mongoose.Types.ObjectId.isValid(identifier) ? { _id: identifier } : null;
  const slugQuery = { slug: identifier };
  const lookup = idQuery ? { $or: [idQuery, slugQuery] } : slugQuery;

  return CaseStudy.findOne({ ...lookup, ...query })
    .populate('relatedCaseStudies', 'title slug excerpt subtitle coverImage imageUrl industry category techStack readingTime publishedAt createdAt');
};

const getAutomaticRelatedCaseStudies = async (caseStudy) => {
  const criteria = [];
  if (caseStudy.industry) criteria.push({ industry: caseStudy.industry });
  if (caseStudy.category) criteria.push({ category: caseStudy.category });
  if (caseStudy.techStack?.length) criteria.push({ techStack: { $in: caseStudy.techStack } });
  if (!criteria.length) return [];

  const related = await CaseStudy.find({
    ...publicCaseStudyQuery,
    _id: { $ne: caseStudy._id },
    $or: criteria,
  })
    .select('title slug excerpt subtitle coverImage imageUrl industry category techStack readingTime publishedAt createdAt')
    .sort('-featured -publishedAt -createdAt')
    .limit(3)
    .lean();

  return related.map(normalizeCaseStudy);
};

const buildCaseStudyPayload = (body, existing = {}) => {
  const published = parseBoolean(body.published, existing.published ?? true);
  const status = normalizeStatus(body.status, published ? 'Published' : 'Draft');
  const excerpt = body.excerpt ?? body.subtitle ?? existing.excerpt ?? existing.subtitle ?? '';
  const category = CASE_CATEGORIES.includes(body.category)
    ? body.category
    : existing.category ?? 'Other';

  return {
    title: body.title ?? existing.title,
    excerpt,
    subtitle: excerpt,
    clientName: body.clientName ?? existing.clientName ?? '',
    industry: body.industry ?? existing.industry ?? category,
    projectDuration: body.projectDuration ?? existing.projectDuration ?? '',
    completionDate: body.completionDate ? new Date(body.completionDate) : existing.completionDate,
    content: body.content ?? existing.content ?? '',
    overview: body.overview ?? existing.overview ?? '',
    challenge: body.challenge ?? body.problem ?? existing.challenge ?? existing.problem ?? '',
    problem: body.problem ?? body.challenge ?? existing.problem ?? existing.challenge ?? '',
    solution: body.solution ?? existing.solution ?? existing.architecture ?? '',
    research: body.research ?? existing.research ?? '',
    architecture: body.architecture ?? body.solution ?? existing.architecture ?? existing.solution ?? '',
    implementation: body.implementation ?? existing.implementation ?? '',
    results: body.results ?? existing.results ?? '',
    conclusion: body.conclusion ?? body.lessonsLearned ?? existing.conclusion ?? existing.lessonsLearned ?? '',
    lessonsLearned: body.lessonsLearned ?? body.conclusion ?? existing.lessonsLearned ?? existing.conclusion ?? '',
    metrics: parseObjectArray(body.metrics, existing.metrics || []),
    techStack: parseArray(body.techStack, existing.techStack || []),
    gallery: parseObjectArray(body.gallery, existing.gallery || []),
    testimonial: parseObject(body.testimonial, existing.testimonial || {}),
    category,
    status,
    published: status === 'Published' ? published : false,
    featured: parseBoolean(body.featured, existing.featured ?? false),
    publishedAt: body.publishedAt ? new Date(body.publishedAt) : existing.publishedAt,
    seoTitle: body.seoTitle ?? existing.seoTitle ?? '',
    seoDescription: body.seoDescription ?? existing.seoDescription ?? '',
    focusKeyword: body.focusKeyword ?? existing.focusKeyword ?? '',
    canonicalUrl: body.canonicalUrl ?? body.canonical ?? existing.canonicalUrl ?? '',
    noIndex: parseBoolean(body.noIndex, existing.noIndex ?? false),
    faq: parseObjectArray(body.faq, existing.faq || []),
    relatedCaseStudies: parseArray(body.relatedCaseStudies, existing.relatedCaseStudies || []),
  };
};

const uploadCaseStudyImages = async (files = {}, existing = {}) => {
  const updates = {};

  const coverFile = files.coverImage?.[0] || files.image?.[0];
  if (coverFile) {
    if (existing.coverImage || existing.imageUrl) {
      try { await deleteFromCloudinary(existing.coverImage || existing.imageUrl); } catch { /* ignore */ }
    }
    const coverImage = await uploadToCloudinary(coverFile.path, 'case-studies/cover');
    updates.coverImage = coverImage;
    updates.imageUrl = coverImage;
  }

  const ogFile = files.ogImage?.[0];
  if (ogFile) {
    if (existing.ogImage) {
      try { await deleteFromCloudinary(existing.ogImage); } catch { /* ignore */ }
    }
    updates.ogImage = await uploadToCloudinary(ogFile.path, 'case-studies/og');
  }

  const clientImageFile = files.clientImage?.[0];
  if (clientImageFile) {
    const clientImage = await uploadToCloudinary(clientImageFile.path, 'case-studies/testimonials');
    updates.testimonial = {
      ...(existing.testimonial?.toObject ? existing.testimonial.toObject() : existing.testimonial || {}),
      clientImage,
    };
  }

  const galleryFiles = [...(files.screenshots || []), ...(files.gallery || [])];
  if (galleryFiles.length) {
    const uploaded = [];
    for (const file of galleryFiles) {
      const url = await uploadToCloudinary(file.path, 'case-studies/gallery');
      uploaded.push(url);
    }
    updates.screenshots = [...(existing.screenshots || []), ...uploaded];
    updates.gallery = [
      ...(existing.gallery || []),
      ...uploaded.map((url) => ({ url, caption: '' })),
    ];
  }

  return updates;
};

export const getCaseStudies = async (req, res) => {
  try {
    const search = req.query.search?.trim();
    const industry = req.query.industry?.trim();
    const technology = req.query.technology?.trim();
    const featured = req.query.featured;
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 100);

    const query = { ...publicCaseStudyQuery };
    if (industry && industry !== 'All') {
      query.$or = [{ industry }, { category: industry }];
    }
    if (technology && technology !== 'All') query.techStack = technology;
    if (featured !== undefined) query.featured = parseBoolean(featured);
    if (search) {
      const searchFields = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
        { clientName: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { techStack: { $regex: search, $options: 'i' } },
      ];
      if (query.$or) query.$and = [...(query.$and || []), { $or: query.$or }, { $or: searchFields }];
      else query.$or = searchFields;
    }

    const caseStudies = await CaseStudy.find(query)
      .sort('-featured -publishedAt -createdAt')
      .limit(limit);

    res.json(caseStudies.map(normalizeCaseStudy));
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getAdminCaseStudies = async (req, res) => {
  try {
    const caseStudies = await CaseStudy.find()
      .populate('relatedCaseStudies', 'title slug')
      .sort('-createdAt');
    res.json(caseStudies.map(normalizeCaseStudy));
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getCaseStudy = async (req, res) => {
  try {
    const caseStudy = await findCaseStudyByIdOrSlug(req.params.id, publicReadableCaseStudyQuery);
    if (!caseStudy) return res.status(404).json({ message: 'Case study not found' });

    await CaseStudy.updateOne({ _id: caseStudy._id }, { $inc: { views: 1 } });
    const normalized = normalizeCaseStudy(caseStudy);
    normalized.views = (normalized.views || 0) + 1;
    if (!normalized.relatedCaseStudies?.length) {
      normalized.relatedCaseStudies = await getAutomaticRelatedCaseStudies(caseStudy);
    }
    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getCaseStudyBySlug = async (req, res) => {
  req.params.id = req.params.slug;
  return getCaseStudy(req, res);
};

export const createCaseStudy = async (req, res) => {
  try {
    const payload = buildCaseStudyPayload(req.body);
    const slug = await uniqueSlug(req.body.slug || payload.title);
    const imageUpdates = await uploadCaseStudyImages(req.files || {});

    const caseStudy = await CaseStudy.create({
      ...payload,
      ...imageUpdates,
      testimonial: {
        ...(payload.testimonial || {}),
        ...(imageUpdates.testimonial || {}),
      },
      slug,
      publishedAt: payload.published ? payload.publishedAt || new Date() : undefined,
    });

    if (caseStudy.published && caseStudy.status === 'Published') {
      triggerNewCaseStudyNotification(caseStudy);
    }

    res.status(201).json(normalizeCaseStudy(caseStudy));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findById(req.params.id);
    if (!caseStudy) return res.status(404).json({ message: 'Case study not found' });

    const payload = buildCaseStudyPayload(req.body, caseStudy);
    Object.assign(caseStudy, payload);

    if (req.body.slug && req.body.slug !== caseStudy.slug) {
      caseStudy.slug = await uniqueSlug(req.body.slug, caseStudy._id);
    } else if (!caseStudy.slug && caseStudy.title) {
      caseStudy.slug = await uniqueSlug(caseStudy.title, caseStudy._id);
    }

    const imageUpdates = await uploadCaseStudyImages(req.files || {}, caseStudy);
    Object.assign(caseStudy, {
      ...imageUpdates,
      testimonial: {
        ...(caseStudy.testimonial?.toObject ? caseStudy.testimonial.toObject() : caseStudy.testimonial || {}),
        ...(payload.testimonial || {}),
        ...(imageUpdates.testimonial || {}),
      },
    });

    if (caseStudy.published && caseStudy.status === 'Published' && !caseStudy.publishedAt) {
      caseStudy.publishedAt = new Date();
    }

    const updated = await caseStudy.save();
    res.json(normalizeCaseStudy(updated));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findById(req.params.id);
    if (!caseStudy) return res.status(404).json({ message: 'Case study not found' });
    const imageUrls = [
      caseStudy.coverImage,
      caseStudy.imageUrl,
      caseStudy.ogImage,
      caseStudy.testimonial?.clientImage,
      ...(caseStudy.screenshots || []),
      ...(caseStudy.gallery || []).map((item) => item.url),
    ].filter(Boolean);
    for (const imageUrl of [...new Set(imageUrls)]) {
      try { await deleteFromCloudinary(imageUrl); } catch { /* ignore */ }
    }
    await caseStudy.deleteOne();
    res.json({ message: 'Case study deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const removeScreenshot = async (req, res) => {
  try {
    const { url } = req.body;
    const caseStudy = await CaseStudy.findById(req.params.id);
    if (!caseStudy) return res.status(404).json({ message: 'Case study not found' });
    caseStudy.screenshots = caseStudy.screenshots.filter((screenshot) => screenshot !== url);
    caseStudy.gallery = (caseStudy.gallery || []).filter((item) => item.url !== url);
    await caseStudy.save();
    res.json({ message: 'Screenshot removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
