import Project from '../models/Project.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryHelper.js';

const PROJECT_TYPES = [
  'Portfolio Showcase',
  'SaaS Platform',
  'AI Agent',
  'Automation',
  'Full Stack Application',
  'Mobile Application',
  'API',
  'CLI Tool',
  'Open Source',
  'Library',
  'Desktop Application',
];

const CLIENT_TYPES = ['Personal', 'Client', 'Company', 'Startup', 'Open Source', 'College', 'Hackathon', 'Research'];
const PROJECT_STATUSES = ['Completed', 'Live', 'Maintenance', 'In Progress', 'Archived'];
const TECH_GROUPS = ['frontend', 'backend', 'database', 'infrastructure', 'ai', 'devops', 'tools'];

const slugify = (text = '') =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');

const parseArray = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map((item) => String(item).trim()).filter(Boolean);
  } catch {
    // Fall back to comma separated admin input.
  }
  return String(value).split(',').map((item) => item.trim()).filter(Boolean);
};

const parseBoolean = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return value === true || value === 'true' || value === 'on';
};

const parseNumber = (value, fallback = 0) => {
  if (value === undefined || value === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeEnum = (value, allowed, fallback, legacyMap = {}) => {
  const mapped = legacyMap[value] || value;
  return allowed.includes(mapped) ? mapped : fallback;
};

const parseTechStackGroups = (body = {}) =>
  TECH_GROUPS.reduce((groups, group) => {
    groups[group] = parseArray(body[`tech_${group}`] ?? body.techStackGroups?.[group]);
    return groups;
  }, {});

const flattenTechStackGroups = (groups = {}) =>
  TECH_GROUPS.flatMap((group) => groups?.[group] || []);

const parseGalleryMeta = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const normalizeGalleryItem = (item, projectTitle = 'Project screenshot', index = 0) => {
  if (!item) return null;
  if (typeof item === 'string') {
    return {
      image: item,
      alt: `${projectTitle} screenshot ${index + 1}`,
      caption: '',
    };
  }
  return {
    image: item.image || item.url || '',
    alt: item.alt || `${projectTitle} screenshot ${index + 1}`,
    caption: item.caption || '',
  };
};

const normalizeProject = (project) => {
  if (!project) return project;
  const object = project.toObject ? project.toObject() : project;
  const thumbnail = object.thumbnail || object.imageUrl || '';
  const normalizedTechGroups = TECH_GROUPS.reduce((groups, group) => {
    groups[group] = object.techStackGroups?.[group] || [];
    return groups;
  }, {});
  const groupedTech = flattenTechStackGroups(normalizedTechGroups);
  const techStack = object.techStack?.length ? object.techStack : groupedTech.length ? groupedTech : object.tech || [];
  const gallery = (object.gallery || [])
    .map((item, index) => normalizeGalleryItem(item, object.title, index))
    .filter((item) => item?.image);
  const seo = {
    enabled: object.seo?.enabled ?? true,
    custom: object.seo?.custom ?? Boolean(object.seo?.title || object.seo?.description || object.seo?.keywords?.length),
    title: object.seo?.title || '',
    description: object.seo?.description || '',
    keywords: object.seo?.keywords || [],
    canonical: object.seo?.canonical || '',
    ogImage: object.seo?.ogImage || '',
    noIndex: object.seo?.noIndex || false,
  };

  return {
    ...object,
    thumbnail,
    imageUrl: object.imageUrl || thumbnail,
    shortDescription: object.shortDescription || object.problem || '',
    outcome: object.outcome || object.results || '',
    projectType: normalizeEnum(object.projectType, PROJECT_TYPES, 'Full Stack Application', { Software: 'Full Stack Application' }),
    clientType: normalizeEnum(object.clientType, CLIENT_TYPES, 'Personal', { Business: 'Company', Internal: 'Company', Other: 'Personal' }),
    status: normalizeEnum(object.status, PROJECT_STATUSES, 'Completed', { Published: 'Completed', Draft: 'In Progress' }),
    published: object.status === 'Draft' ? false : object.published,
    techStackGroups: normalizedTechGroups,
    techStack,
    tech: object.tech?.length ? object.tech : techStack,
    gallery,
    seo,
    ogImage: object.ogImage || seo.ogImage || thumbnail,
  };
};

const uniqueSlug = async (baseText, currentId = null) => {
  const baseSlug = slugify(baseText) || `project-${Date.now()}`;
  let candidate = baseSlug;
  let suffix = 2;

  while (true) {
    const existing = await Project.findOne({ slug: candidate });
    if (!existing || (currentId && existing._id.toString() === currentId.toString())) {
      return candidate;
    }
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
};

const publicProjectQuery = {
  published: { $ne: false },
  status: { $ne: 'Archived' },
  visibility: { $ne: 'Private' },
};

export const getProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20; // Default limit 20 to accommodate most portfolio views without paginating unnecessarily, but ready for it.
    const skip = (page - 1) * limit;
    const query = { ...publicProjectQuery };

    if (req.query.featured !== undefined) query.featured = req.query.featured === 'true';
    if (req.query.category) query.category = req.query.category;
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { shortDescription: { $regex: req.query.search, $options: 'i' } },
        { problem: { $regex: req.query.search, $options: 'i' } },
        { techStack: { $regex: req.query.search, $options: 'i' } },
        { tags: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const projects = await Project.find(query).sort('order featuredOrder -publishedAt -createdAt').skip(skip).limit(limit);
    const total = await Project.countDocuments(query);

    res.json({
      data: projects.map(normalizeProject),
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getAdminProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .sort('order -updatedAt')
      .populate('relatedProjects', 'title slug thumbnail imageUrl category shortDescription problem tech techStack');
    res.json(projects.map(normalizeProject));
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({
      slug: req.params.slug,
      ...publicProjectQuery,
    }).populate('relatedProjects', 'title slug thumbnail imageUrl category shortDescription problem tech techStack');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(normalizeProject(project));
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createProject = async (req, res) => {
  try {
    const {
      title, slug, category, featured, featuredOrder, order, projectType,
      clientType, status, visibility, published,
      shortDescription, overview, problem, solution, architecture,
      technicalChallenges, results, outcome, myRole,
      githubUrl, liveUrl, demoVideo, seoTitle, seoDescription,
      seoKeywords, canonical, noIndex, seoEnabled, seoCustom,
    } = req.body;
    let thumbnail = '';
    let ogImage = '';
    const gallery = [];

    const thumbnailFile = req.files?.thumbnail?.[0] || req.files?.image?.[0];
    if (thumbnailFile) {
      thumbnail = await uploadToCloudinary(thumbnailFile.path, 'projects');
    }

    if (req.files?.ogImage?.[0]) {
      ogImage = await uploadToCloudinary(req.files.ogImage[0].path, 'projects/og');
    }

    if (req.files?.gallery) {
      const galleryMeta = parseGalleryMeta(req.body.galleryMeta);
      for (const [index, file] of req.files.gallery.entries()) {
        const image = await uploadToCloudinary(file.path, 'projects/gallery');
        gallery.push({
          image,
          alt: galleryMeta[index]?.alt || `${title} screenshot ${index + 1}`,
          caption: galleryMeta[index]?.caption || '',
        });
      }
    }

    if (!thumbnail) {
      return res.status(400).json({ message: 'Project image is required' });
    }

    const finalPublished = parseBoolean(published, true);
    const finalSlug = await uniqueSlug(slug || title);
    const techStackGroups = parseTechStackGroups(req.body);
    const groupedTechStack = flattenTechStackGroups(techStackGroups);
    const techStack = groupedTechStack.length ? groupedTechStack : parseArray(req.body.techStack || req.body.tech);
    const finalProjectType = normalizeEnum(projectType, PROJECT_TYPES, 'Full Stack Application', { Software: 'Full Stack Application' });
    const finalClientType = normalizeEnum(clientType, CLIENT_TYPES, 'Personal', { Business: 'Company', Internal: 'Company', Other: 'Personal' });
    const finalStatus = normalizeEnum(status, PROJECT_STATUSES, 'Completed', { Published: 'Completed', Draft: 'In Progress' });

    const project = await Project.create({
      title,
      slug: finalSlug,
      category,
      featured: parseBoolean(featured),
      featuredOrder: parseNumber(featuredOrder),
      order: parseNumber(order),
      projectType: finalProjectType,
      clientType: finalClientType,
      status: finalStatus,
      visibility: visibility || 'Public',
      published: finalPublished,
      publishedAt: finalPublished ? new Date() : undefined,
      shortDescription,
      overview,
      problem,
      solution,
      architecture,
      features: parseArray(req.body.features),
      technicalChallenges,
      results: results || outcome || '',
      outcome: outcome || results || '',
      myRole,
      tech: techStack,
      techStack,
      techStackGroups,
      tags: parseArray(req.body.tags),
      githubUrl,
      liveUrl,
      demoVideo,
      imageUrl: thumbnail,
      thumbnail,
      gallery,
      ogImage: ogImage || thumbnail,
      relatedProjects: parseArray(req.body.relatedProjects),
      seo: {
        enabled: parseBoolean(seoEnabled, true),
        custom: parseBoolean(seoCustom),
        title: seoTitle || '',
        description: seoDescription || '',
        keywords: parseArray(seoKeywords),
        canonical: canonical || '',
        ogImage: ogImage || thumbnail,
        noIndex: parseBoolean(noIndex),
      },
    });

    res.status(201).json(normalizeProject(project));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const {
      title, slug, category, featured, featuredOrder, order, projectType,
      clientType, status, visibility, published,
      shortDescription, overview, problem, solution, architecture,
      technicalChallenges, results, outcome, myRole,
      githubUrl, liveUrl, demoVideo, seoTitle, seoDescription,
      seoKeywords, canonical, noIndex, seoEnabled, seoCustom,
    } = req.body;

    project.title = title || project.title;
    if (slug && slug !== project.slug) project.slug = await uniqueSlug(slug, project._id);
    if (!project.slug && title) project.slug = await uniqueSlug(title, project._id);
    project.shortDescription = shortDescription ?? project.shortDescription;
    project.overview = overview ?? project.overview;
    project.problem = problem ?? project.problem;
    project.solution = solution ?? project.solution;
    project.architecture = architecture ?? project.architecture;
    project.features = req.body.features !== undefined ? parseArray(req.body.features) : project.features;
    project.technicalChallenges = technicalChallenges ?? project.technicalChallenges;
    project.results = results ?? outcome ?? project.results;
    project.outcome = outcome ?? results ?? project.outcome;
    project.myRole = myRole ?? project.myRole;
    if (req.body.techStack !== undefined || req.body.tech !== undefined || TECH_GROUPS.some((group) => req.body[`tech_${group}`] !== undefined)) {
      const techStackGroups = parseTechStackGroups(req.body);
      const groupedTechStack = flattenTechStackGroups(techStackGroups);
      const techStack = groupedTechStack.length ? groupedTechStack : parseArray(req.body.techStack || req.body.tech);
      project.techStackGroups = techStackGroups;
      project.techStack = techStack;
      project.tech = techStack;
    }
    if (req.body.tags !== undefined) project.tags = parseArray(req.body.tags);
    project.githubUrl = githubUrl ?? project.githubUrl;
    if (liveUrl !== undefined) project.liveUrl = liveUrl;
    if (demoVideo !== undefined) project.demoVideo = demoVideo;
    project.category = category || project.category;
    if (featured !== undefined) project.featured = parseBoolean(featured, project.featured);
    project.featuredOrder = parseNumber(featuredOrder, project.featuredOrder);
    project.order = parseNumber(order, project.order);
    project.projectType = normalizeEnum(projectType || project.projectType, PROJECT_TYPES, 'Full Stack Application', { Software: 'Full Stack Application' });
    project.clientType = normalizeEnum(clientType || project.clientType, CLIENT_TYPES, 'Personal', { Business: 'Company', Internal: 'Company', Other: 'Personal' });
    project.status = normalizeEnum(status || project.status, PROJECT_STATUSES, 'Completed', { Published: 'Completed', Draft: 'In Progress' });
    project.visibility = visibility || project.visibility;
    if (published !== undefined) project.published = parseBoolean(published, project.published);
    if (project.published && !project.publishedAt) project.publishedAt = new Date();

    const thumbnailFile = req.files?.thumbnail?.[0] || req.files?.image?.[0];
    if (thumbnailFile) {
      await deleteFromCloudinary(project.thumbnail || project.imageUrl);
      project.thumbnail = await uploadToCloudinary(thumbnailFile.path, 'projects');
      project.imageUrl = project.thumbnail;
    }

    if (req.files?.ogImage?.[0]) {
      await deleteFromCloudinary(project.ogImage || project.seo?.ogImage);
      project.ogImage = await uploadToCloudinary(req.files.ogImage[0].path, 'projects/og');
    }

    if (req.files?.gallery) {
      const galleryMeta = parseGalleryMeta(req.body.galleryMeta);
      for (const [index, file] of req.files.gallery.entries()) {
        const image = await uploadToCloudinary(file.path, 'projects/gallery');
        project.gallery.push({
          image,
          alt: galleryMeta[index]?.alt || `${project.title} screenshot ${(project.gallery?.length || 0) + index + 1}`,
          caption: galleryMeta[index]?.caption || '',
        });
      }
    }

    if (req.body.relatedProjects !== undefined) project.relatedProjects = parseArray(req.body.relatedProjects);

    project.seo = {
      enabled: seoEnabled !== undefined ? parseBoolean(seoEnabled, project.seo?.enabled ?? true) : project.seo?.enabled ?? true,
      custom: seoCustom !== undefined ? parseBoolean(seoCustom, project.seo?.custom ?? false) : project.seo?.custom ?? false,
      title: seoTitle ?? project.seo?.title ?? '',
      description: seoDescription ?? project.seo?.description ?? '',
      keywords: seoKeywords !== undefined ? parseArray(seoKeywords) : project.seo?.keywords ?? [],
      canonical: canonical ?? project.seo?.canonical ?? '',
      ogImage: project.ogImage || project.seo?.ogImage || project.thumbnail || project.imageUrl || '',
      noIndex: noIndex !== undefined ? parseBoolean(noIndex) : project.seo?.noIndex ?? false,
    };

    const updatedProject = await project.save();
    res.json(normalizeProject(updatedProject));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await deleteFromCloudinary(project.thumbnail || project.imageUrl);
    await deleteFromCloudinary(project.ogImage || project.seo?.ogImage);
    if (project.gallery?.length) {
      await Promise.all(project.gallery.map((item) => deleteFromCloudinary(item.image || item)));
    }
    await project.deleteOne();

    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
