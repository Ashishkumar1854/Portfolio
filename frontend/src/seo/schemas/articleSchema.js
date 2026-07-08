import seoConfig from "../config/seoConfig";
import { absoluteUrl } from "../utils/seoUtils";

const articleSchema = (article = {}) => {
  if (!article.title) return null;

  const slug = article.slug || article.path;
  const articlePath = slug?.startsWith("/") ? slug : `/blog/${slug}`;
  const url = article.url || (slug ? absoluteUrl(articlePath) : seoConfig.site.baseUrl);
  const image = absoluteUrl(article.ogImage || article.thumbnail || article.image, seoConfig.branding.ogImage);

  return {
    "@context": "https://schema.org",
    "@type": article.type || "Article",
    "@id": `${url}#article`,
    headline: article.title,
    name: article.title,
    description: article.description || article.excerpt,
    image,
    url,
    inLanguage: seoConfig.site.language,
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt || article.modifiedAt,
    author: {
      "@type": "Person",
      "@id": `${seoConfig.site.baseUrl}/#person`,
      name: article.author || seoConfig.author.name,
      url: seoConfig.site.baseUrl,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${seoConfig.site.baseUrl}/#organization`,
      name: seoConfig.site.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(seoConfig.branding.logo),
      },
    },
    keywords: Array.isArray(article.keywords) ? article.keywords.join(", ") : article.keywords,
  };
};

export default articleSchema;
