import seoConfig from '../config/seoConfig';
import { absoluteUrl } from '../utils/seoUtils';

const resourceSchema = (resource) => {
  if (!resource) return null;

  const resourceUrl = `${seoConfig.site.baseUrl}/resources/${resource.slug}`;
  const isSoftwareLike = ['Tool', 'Template', 'Workflow', 'Schema', 'Prompt Library'].includes(resource.resourceType);

  if (isSoftwareLike) {
    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: resource.title,
      description: resource.seo?.metaDescription || resource.excerpt || resource.description,
      applicationCategory: resource.category,
      operatingSystem: 'Web',
      softwareVersion: resource.version || '1.0.0',
      author: {
        '@type': 'Person',
        name: resource.author || seoConfig.author.name,
        url: seoConfig.site.baseUrl,
      },
      offers: {
        '@type': 'Offer',
        price: resource.isPremium ? undefined : '0',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        url: resourceUrl,
      },
      image: absoluteUrl(resource.ogImage || resource.thumbnail || resource.seo?.ogImage, seoConfig.branding.ogImage),
      url: resourceUrl,
      datePublished: resource.publishedAt || resource.createdAt,
      dateModified: resource.updatedAtDisplay || resource.updatedAt,
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: resource.title,
    description: resource.seo?.metaDescription || resource.excerpt || resource.description,
    author: {
      '@type': 'Person',
      name: resource.author || seoConfig.author.name,
    },
    image: absoluteUrl(resource.ogImage || resource.thumbnail || resource.seo?.ogImage, seoConfig.branding.ogImage),
    url: resourceUrl,
    datePublished: resource.publishedAt || resource.createdAt,
    dateModified: resource.updatedAtDisplay || resource.updatedAt,
  };
};

export default resourceSchema;
