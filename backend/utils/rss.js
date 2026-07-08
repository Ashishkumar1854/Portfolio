const escapeXml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const formatRssDate = (value = new Date()) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toUTCString() : date.toUTCString();
};

export const createRssItem = ({
  title,
  description,
  url,
  guid = url,
  publishedAt,
  author,
  category,
}) => ({
  title,
  description,
  url,
  guid,
  publishedAt,
  author,
  category,
});

export const buildRssFeed = ({
  title,
  description,
  siteUrl,
  feedUrl,
  language = 'en',
  items = [],
  updatedAt = new Date(),
}) => {
  const rssItems = items
    .filter((item) => item?.title && item?.url)
    .map((item) => {
      const descriptionTag = item.description
        ? `\n      <description>${escapeXml(item.description)}</description>`
        : '';
      const authorTag = item.author ? `\n      <author>${escapeXml(item.author)}</author>` : '';
      const categoryTag = item.category ? `\n      <category>${escapeXml(item.category)}</category>` : '';

      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.url)}</link>
      <guid isPermaLink="true">${escapeXml(item.guid || item.url)}</guid>${descriptionTag}${authorTag}${categoryTag}
      <pubDate>${escapeXml(formatRssDate(item.publishedAt || updatedAt))}</pubDate>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(description)}</description>
    <language>${escapeXml(language)}</language>
    <lastBuildDate>${escapeXml(formatRssDate(updatedAt))}</lastBuildDate>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`;
};
