import seoConfig from "../config/seoConfig";
import { absoluteUrl } from "../utils/seoUtils";

const serviceSchema = (service = {}) => {
  if (!service.name && !service.title) return null;

  const name = service.name || service.title;
  const path = service.path || service.slug;
  const servicePath = path?.startsWith("/") ? path : `/services/${path}`;
  const url = service.url || (path ? absoluteUrl(servicePath) : `${seoConfig.site.baseUrl}/services`);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    serviceType: service.serviceType || service.category || name,
    description: service.description || service.excerpt,
    url,
    provider: {
      "@type": "Person",
      "@id": `${seoConfig.site.baseUrl}/#person`,
      name: seoConfig.author.name,
      url: seoConfig.site.baseUrl,
    },
    areaServed: service.areaServed || "Worldwide",
    audience: service.audience,
    offers: service.offers,
  };
};

export default serviceSchema;
