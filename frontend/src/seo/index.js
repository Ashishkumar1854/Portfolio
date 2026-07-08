export { default as SEO } from "./components/SEO";
export { default as SEOManager } from "./components/SEOManager";
export { default as useSEO } from "./hooks/useSEO";

export { default as seoConfig } from "./config/seoConfig";
export { default as pageSEO } from "./config/pageSEO";

export { default as websiteSchema } from "./schemas/websiteSchema";
export { default as organizationSchema } from "./schemas/organizationSchema";
export { default as personSchema } from "./schemas/personSchema";
export { default as breadcrumbSchema } from "./schemas/breadcrumbSchema";
export { default as projectSchema } from "./schemas/projectSchema";
export { default as resourceSchema } from "./schemas/resourceSchema";
export { default as articleSchema } from "./schemas/articleSchema";
export { default as serviceSchema } from "./schemas/serviceSchema";
export { default as faqSchema } from "./schemas/faqSchema";

export {
  absoluteUrl,
  canonicalUrl,
  mergeSEO,
  normalizeKeywords,
  normalizeRobots,
} from "./utils/seoUtils";
