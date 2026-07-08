import Blog from '../models/Blog.js';
import CaseStudy from '../models/CaseStudy.js';
import Project from '../models/Project.js';
import Resource from '../models/Resource.js';
import { buildRssFeed } from '../utils/rss.js';
import {
  buildAbsoluteUrl,
  buildSitemapXml,
  createSitemapEntry,
  normalizeBaseUrl,
  uniqueSitemapEntries,
} from '../utils/sitemap.js';

const siteUrl = normalizeBaseUrl(process.env.SITE_URL || process.env.CLIENT_URL || 'http://localhost:3000');
const siteShortName = process.env.APP_SHORT_NAME || 'Ashish';
const siteDescription =
  process.env.SITE_DESCRIPTION ||
  'Ashish Kumar is an AI Automation Engineer and SaaS Product Builder specializing in AI agents, automation workflows, full-stack applications, and developer resources.';
const siteLanguage = process.env.SITE_LANGUAGE || 'en';

const staticPages = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/journey', changefreq: 'monthly', priority: '0.7' },
  { path: '/services', changefreq: 'monthly', priority: '0.9' },
  { path: '/projects', changefreq: 'weekly', priority: '0.9' },
  { path: '/resources', changefreq: 'weekly', priority: '0.9' },
  { path: '/blog', changefreq: 'weekly', priority: '0.8' },
  { path: '/case-studies', changefreq: 'monthly', priority: '0.8' },
];

const blockedRobotPaths = [
  '/admin',
  '/admin/',
  '/login',
  '/register',
  '/dashboard',
  '/reset-password',
  '/forgot-password',
];

const publicLifecycleQuery = {
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
        { status: { $nin: ['Draft', 'Archived', 'Private'] } },
      ],
    },
    {
      $or: [
        { 'seo.noIndex': { $exists: false } },
        { 'seo.noIndex': { $ne: true } },
      ],
    },
    {
      $or: [
        { noIndex: { $exists: false } },
        { noIndex: { $ne: true } },
      ],
    },
    {
      $or: [
        { 'seo.robots': { $exists: false } },
        { 'seo.robots': { $not: /noindex/i } },
      ],
    },
  ],
};

const projectQuery = {
  slug: { $exists: true, $ne: '' },
  published: { $ne: false },
  status: { $ne: 'Archived' },
  visibility: { $ne: 'Private' },
  'seo.enabled': { $ne: false },
  'seo.noIndex': { $ne: true },
};

const resourceQuery = {
  slug: { $exists: true, $ne: '' },
  $and: [
    {
      $or: [
        { publishedAt: { $exists: false } },
        { publishedAt: { $lte: new Date() } },
      ],
    },
    {
      $or: [
        { 'seo.robots': { $exists: false } },
        { 'seo.robots': { $not: /noindex/i } },
      ],
    },
  ],
};

const getItemPath = (collectionPath, item) => {
  const identifier = item.slug || item._id?.toString();
  return identifier ? `/${collectionPath}/${identifier}` : null;
};

const getStaticEntries = () =>
  staticPages.map((page) =>
    createSitemapEntry({
      baseUrl: siteUrl,
      path: page.path,
      changefreq: page.changefreq,
      priority: page.priority,
    }),
  );

const getDynamicEntries = async () => {
  const [projects, resources, blogs, caseStudies] = await Promise.all([
    Project.find(projectQuery).select('slug updatedAt publishedAt createdAt').lean(),
    Resource.find(resourceQuery).select('slug updatedAt updatedAtDisplay publishedAt createdAt').lean(),
    Blog.find(publicLifecycleQuery).select('slug updatedAt createdAt').lean(),
    CaseStudy.find(publicLifecycleQuery).select('slug updatedAt createdAt').lean(),
  ]);

  return [
    ...projects.map((project) =>
      createSitemapEntry({
        baseUrl: siteUrl,
        path: getItemPath('projects', project),
        lastmod: project.updatedAt || project.publishedAt || project.createdAt,
        changefreq: 'monthly',
        priority: '0.8',
      }),
    ),
    ...resources.map((resource) =>
      createSitemapEntry({
        baseUrl: siteUrl,
        path: getItemPath('resources', resource),
        lastmod: resource.updatedAtDisplay || resource.updatedAt || resource.publishedAt || resource.createdAt,
        changefreq: 'monthly',
        priority: '0.75',
      }),
    ),
    ...blogs.map((blog) =>
      createSitemapEntry({
        baseUrl: siteUrl,
        path: getItemPath('blog', blog),
        lastmod: blog.updatedAt || blog.createdAt,
        changefreq: 'monthly',
        priority: '0.7',
      }),
    ),
    ...caseStudies.map((caseStudy) =>
      createSitemapEntry({
        baseUrl: siteUrl,
        path: getItemPath('case-studies', caseStudy),
        lastmod: caseStudy.updatedAt || caseStudy.createdAt,
        changefreq: 'monthly',
        priority: '0.7',
      }),
    ),
  ];
};

export const getSitemap = async (req, res) => {
  try {
    const entries = uniqueSitemapEntries([
      ...getStaticEntries(),
      ...(await getDynamicEntries()),
    ]);

    res.type('application/xml');
    res.set('Cache-Control', 'public, max-age=900');
    res.send(buildSitemapXml(entries));
  } catch (error) {
    res.status(500).type('text/plain').send('Unable to generate sitemap');
  }
};

export const getRobots = (req, res) => {
  const disallowRules = blockedRobotPaths
    .map((path) => `Disallow: ${path}`)
    .join('\n');

  res.type('text/plain');
  res.set('Cache-Control', 'public, max-age=3600');
  res.send(`User-agent: *
Allow: /
${disallowRules}

Sitemap: ${buildAbsoluteUrl(siteUrl, '/sitemap.xml')}
`);
};

export const getRssFeed = (req, res) => {
  const feed = buildRssFeed({
    title: `${siteShortName} RSS Feed`,
    description: siteDescription,
    siteUrl,
    feedUrl: buildAbsoluteUrl(siteUrl, '/rss.xml'),
    language: siteLanguage,
    items: [],
  });

  res.type('application/rss+xml');
  res.set('Cache-Control', 'public, max-age=900');
  res.send(feed);
};
