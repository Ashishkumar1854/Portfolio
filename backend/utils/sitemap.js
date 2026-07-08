const escapeXml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const formatDate = (value) => {
  const date = new Date(value || Date.now());
  return Number.isNaN(date.getTime()) ? new Date().toISOString().slice(0, 10) : date.toISOString().slice(0, 10);
};

export const normalizeBaseUrl = (url = '') => url.replace(/\/+$/, '');

export const buildAbsoluteUrl = (baseUrl, path = '/') => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedBase = normalizeBaseUrl(baseUrl);
  return `${normalizedBase}${path.startsWith('/') ? path : `/${path}`}`;
};

export const createSitemapEntry = ({
  baseUrl,
  path,
  lastmod = new Date(),
  changefreq = 'monthly',
  priority = '0.7',
}) => ({
  loc: buildAbsoluteUrl(baseUrl, path),
  lastmod: formatDate(lastmod),
  changefreq,
  priority,
});

export const uniqueSitemapEntries = (entries = []) => {
  const byUrl = new Map();

  entries.filter(Boolean).forEach((entry) => {
    if (!entry.loc || byUrl.has(entry.loc)) return;
    byUrl.set(entry.loc, entry);
  });

  return Array.from(byUrl.values());
};

export const buildSitemapXml = (entries = []) => {
  const urls = uniqueSitemapEntries(entries)
    .map((entry) => {
      const lastmod = entry.lastmod ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : '';
      const changefreq = entry.changefreq ? `\n    <changefreq>${escapeXml(entry.changefreq)}</changefreq>` : '';
      const priority = entry.priority ? `\n    <priority>${escapeXml(entry.priority)}</priority>` : '';

      return `  <url>
    <loc>${escapeXml(entry.loc)}</loc>${lastmod}${changefreq}${priority}
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
};
