import mongoose from 'mongoose';
import Service from '../models/Service.js';
import CaseStudy from '../models/CaseStudy.js';
import { deleteFromCloudinary, uploadToCloudinary } from '../utils/cloudinaryHelper.js';

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
    return String(value).split(/,|\n/).map((item) => item.trim()).filter(Boolean);
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

const validIds = (value) =>
  parseArray(value)
    .map((item) => String(item))
    .filter((item) => mongoose.Types.ObjectId.isValid(item));

const normalizeStatus = (value, fallback = 'Published') =>
  ['Draft', 'Published', 'Archived'].includes(value) ? value : fallback;

const publicServiceQuery = {
  published: { $ne: false },
  status: 'Published',
  noIndex: { $ne: true },
};

const publicReadableServiceQuery = {
  published: { $ne: false },
  status: 'Published',
};

const uniqueSlug = async (text, ignoreId = null) => {
  const baseSlug = slugify(text) || `service-${Date.now()}`;
  let candidate = baseSlug;
  let counter = 2;

  while (await Service.exists({ slug: candidate, ...(ignoreId ? { _id: { $ne: ignoreId } } : {}) })) {
    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return candidate;
};

const normalizeFaq = (value) =>
  parseObjectArray(value)
    .map((item) => ({
      question: item.question || item.q || '',
      answer: item.answer || item.a || '',
      q: item.q || item.question || '',
      a: item.a || item.answer || '',
    }))
    .filter((item) => item.question && item.answer);

const normalizeFeatures = (value) =>
  parseObjectArray(value)
    .map((item) => ({
      title: item.title || '',
      description: item.description || '',
      icon: item.icon || 'Zap',
    }))
    .filter((item) => item.title || item.description);

const normalizeWorkflowSteps = (value) =>
  parseObjectArray(value)
    .map((item, index) => ({
      step: Number(item.step || index + 1),
      title: item.title || '',
      description: item.description || '',
    }))
    .filter((item) => item.title || item.description);

const normalizeGallery = (value) =>
  parseObjectArray(value)
    .map((item) => ({
      url: item.url || item.image || '',
      caption: item.caption || '',
      alt: item.alt || '',
    }))
    .filter((item) => item.url);

const normalizeService = (service) => {
  const object = service?.toObject ? service.toObject({ virtuals: true }) : service;
  if (!object) return object;
  return {
    ...object,
    shortDescription: object.shortDescription || object.excerpt || object.overview || '',
    excerpt: object.excerpt || object.shortDescription || object.overview || '',
    pricingText: object.pricingText || object.pricing || '',
    pricing: object.pricing || object.pricingText || '',
    faq: (object.faq || []).map((item) => ({
      ...item,
      question: item.question || item.q || '',
      answer: item.answer || item.a || '',
      q: item.q || item.question || '',
      a: item.a || item.answer || '',
    })),
  };
};

const uploadServiceImages = async (files = {}, existing = {}) => {
  const uploads = {};
  const coverFile = files.coverImage?.[0] || files.image?.[0];
  const ogFile = files.ogImage?.[0];
  const galleryFiles = files.gallery || [];

  if (coverFile) {
    uploads.coverImage = await uploadToCloudinary(coverFile.path, 'services/cover');
    await deleteFromCloudinary(existing.coverImage);
  }
  if (ogFile) {
    uploads.ogImage = await uploadToCloudinary(ogFile.path, 'services/og');
    await deleteFromCloudinary(existing.ogImage);
  }
  if (galleryFiles.length) {
    const galleryUrls = await Promise.all(galleryFiles.map((file) => uploadToCloudinary(file.path, 'services/gallery')));
    uploads.gallery = [
      ...(existing.gallery || []),
      ...galleryUrls.map((url) => ({ url, caption: '', alt: '' })),
    ];
  }

  return uploads;
};

const buildPayload = async (body, existing = {}, files = {}, userId = null) => {
  const status = normalizeStatus(body.status, existing.status || 'Published');
  const published = body.published !== undefined ? parseBoolean(body.published, status === 'Published') : status === 'Published';
  const requestedSlug = body.slug || existing.slug || body.title || existing.title;
  const slug = requestedSlug && requestedSlug !== existing.slug
    ? await uniqueSlug(requestedSlug, existing._id)
    : existing.slug || await uniqueSlug(requestedSlug);
  const uploads = await uploadServiceImages(files, existing);

  return {
    title: body.title ?? existing.title,
    slug,
    shortDescription: body.shortDescription ?? existing.shortDescription ?? body.excerpt ?? existing.excerpt ?? '',
    excerpt: body.excerpt ?? existing.excerpt ?? body.shortDescription ?? existing.shortDescription ?? '',
    overview: body.overview ?? existing.overview ?? '',
    icon: body.icon ?? existing.icon ?? 'Zap',
    color: body.color ?? existing.color ?? 'text-accent-blue',
    bg: body.bg ?? existing.bg ?? 'bg-accent-blue/10',
    coverImage: uploads.coverImage ?? body.coverImage ?? existing.coverImage ?? '',
    ogImage: uploads.ogImage ?? body.ogImage ?? existing.ogImage ?? '',
    gallery: uploads.gallery ?? (body.gallery !== undefined ? normalizeGallery(body.gallery) : existing.gallery ?? []),
    category: body.category ?? existing.category ?? 'Automation',
    featured: body.featured !== undefined ? parseBoolean(body.featured) : existing.featured ?? false,
    status,
    published,
    publishedDate: body.publishedDate ? new Date(body.publishedDate) : existing.publishedDate,
    publishedAt: body.publishedDate ? new Date(body.publishedDate) : existing.publishedAt,
    displayOrder: body.displayOrder !== undefined ? Number(body.displayOrder) : existing.displayOrder ?? 0,
    startingPrice: body.startingPrice !== undefined ? Number(body.startingPrice || 0) : existing.startingPrice ?? 0,
    endingPrice: body.endingPrice !== undefined ? Number(body.endingPrice || 0) : existing.endingPrice ?? 0,
    pricingText: body.pricingText ?? existing.pricingText ?? body.pricing ?? existing.pricing ?? '',
    pricing: body.pricing ?? body.pricingText ?? existing.pricing ?? existing.pricingText ?? '',
    currency: body.currency ?? existing.currency ?? 'INR',
    pricingModel: body.pricingModel ?? existing.pricingModel ?? 'Project based',
    content: body.content ?? existing.content ?? '',
    problem: body.problem ?? existing.problem ?? '',
    solution: body.solution ?? existing.solution ?? '',
    workflow: body.workflow ?? existing.workflow ?? '',
    implementation: body.implementation ?? existing.implementation ?? '',
    benefits: body.benefits !== undefined ? parseArray(body.benefits) : existing.benefits ?? [],
    useCases: body.useCases !== undefined ? parseArray(body.useCases) : existing.useCases ?? [],
    whoItsFor: body.whoItsFor !== undefined ? parseArray(body.whoItsFor) : existing.whoItsFor ?? [],
    whyChooseUs: body.whyChooseUs !== undefined ? parseArray(body.whyChooseUs) : existing.whyChooseUs ?? [],
    estimatedDelivery: body.estimatedDelivery ?? existing.estimatedDelivery ?? '',
    supportPeriod: body.supportPeriod ?? existing.supportPeriod ?? '',
    revisionPolicy: body.revisionPolicy ?? existing.revisionPolicy ?? '',
    technologyStack: body.technologyStack !== undefined ? parseArray(body.technologyStack) : existing.technologyStack ?? [],
    integrations: body.integrations !== undefined ? parseArray(body.integrations) : existing.integrations ?? [],
    supportedPlatforms: body.supportedPlatforms !== undefined ? parseArray(body.supportedPlatforms) : existing.supportedPlatforms ?? [],
    features: body.features !== undefined ? normalizeFeatures(body.features) : existing.features ?? [],
    deliverables: body.deliverables !== undefined ? parseArray(body.deliverables) : existing.deliverables ?? [],
    process: body.process !== undefined ? parseArray(body.process) : existing.process ?? [],
    workflowSteps: body.workflowSteps !== undefined ? normalizeWorkflowSteps(body.workflowSteps) : existing.workflowSteps ?? [],
    faq: body.faq !== undefined ? normalizeFaq(body.faq) : existing.faq ?? [],
    metaTitle: body.metaTitle ?? existing.metaTitle ?? '',
    metaDescription: body.metaDescription ?? existing.metaDescription ?? '',
    focusKeyword: body.focusKeyword ?? existing.focusKeyword ?? '',
    canonical: body.canonical ?? existing.canonical ?? '',
    noIndex: body.noIndex !== undefined ? parseBoolean(body.noIndex) : existing.noIndex ?? false,
    twitterTitle: body.twitterTitle ?? existing.twitterTitle ?? '',
    twitterDescription: body.twitterDescription ?? existing.twitterDescription ?? '',
    twitterImage: body.twitterImage ?? existing.twitterImage ?? '',
    relatedServices: body.relatedServices !== undefined ? validIds(body.relatedServices) : existing.relatedServices ?? [],
    relatedCaseStudies: body.relatedCaseStudies !== undefined ? validIds(body.relatedCaseStudies) : existing.relatedCaseStudies ?? [],
    ...(existing._id ? { updatedBy: userId } : { createdBy: userId, updatedBy: userId }),
  };
};

export const getServices = async (req, res) => {
  try {
    const { category, search, featured, sort = 'order', limit } = req.query;
    const query = { ...publicServiceQuery };

    if (category) query.category = category;
    if (featured !== undefined) query.featured = featured === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { overview: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { technologyStack: { $regex: search, $options: 'i' } },
      ];
    }

    const sortMap = {
      order: 'displayOrder -featured title',
      newest: '-createdAt',
      updated: '-updatedAt',
      popular: '-views',
      title: 'title',
    };

    let serviceQuery = Service.find(query).sort(sortMap[sort] || sortMap.order);
    if (limit) serviceQuery = serviceQuery.limit(Number(limit));
    const services = await serviceQuery;
    res.json(services.map(normalizeService));
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getAdminServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate('relatedServices', 'title slug')
      .populate('relatedCaseStudies', 'title slug')
      .sort('displayOrder -createdAt');
    res.json(services.map(normalizeService));
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getService = async (req, res) => {
  try {
    const identifier = req.params.id;
    const query = mongoose.Types.ObjectId.isValid(identifier)
      ? { $or: [{ _id: identifier }, { slug: identifier }] }
      : { slug: identifier };
    const service = await Service.findOne({ ...query, ...publicReadableServiceQuery })
      .populate('relatedServices', 'title slug shortDescription excerpt overview icon coverImage category pricingText pricing')
      .populate('relatedCaseStudies', 'title slug excerpt subtitle coverImage imageUrl industry category readingTime');

    if (!service) return res.status(404).json({ message: 'Service not found' });

    await Service.updateOne({ _id: service._id }, { $inc: { views: 1 } });
    const normalized = normalizeService(service);
    normalized.views = (normalized.views || 0) + 1;

    if (!normalized.relatedServices?.length) {
      normalized.relatedServices = await Service.find({
        _id: { $ne: service._id },
        category: service.category,
        ...publicServiceQuery,
      }).select('title slug shortDescription excerpt overview icon coverImage category pricingText pricing').limit(3);
    }
    if (!normalized.relatedCaseStudies?.length) {
      normalized.relatedCaseStudies = await CaseStudy.find({
        published: { $ne: false },
        status: 'Published',
        noIndex: { $ne: true },
        $or: [
          { category: service.category },
          { industry: service.category },
          { techStack: { $in: service.technologyStack || [] } },
        ],
      }).select('title slug excerpt subtitle coverImage imageUrl industry category readingTime').limit(3);
    }

    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const payload = await buildPayload(req.body, {}, req.files, req.user?._id);
    const service = await Service.create(payload);
    res.status(201).json(normalizeService(service));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const payload = await buildPayload(req.body, service, req.files, req.user?._id);
    Object.assign(service, payload);
    const updatedService = await service.save();
    res.json(normalizeService(updatedService));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    await Promise.all([
      deleteFromCloudinary(service.coverImage),
      deleteFromCloudinary(service.ogImage),
      ...(service.gallery || []).map((item) => deleteFromCloudinary(item.url)),
    ]);

    await service.deleteOne();
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
