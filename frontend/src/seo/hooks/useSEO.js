import seoConfig from "../config/seoConfig";
import pageSEO from "../config/pageSEO";
import { mergeSEO } from "../utils/seoUtils";

const useSEO = (page, overrides = {}) => {
  const pageMeta = pageSEO[page] || {};

  if (!pageSEO[page]) {
    console.warn(
      `[SEO] Metadata not found for page "${page}". Using default configuration.`,
    );
  }

  const defaults = {
    title: seoConfig.site.defaultTitle || seoConfig.defaults.title,
    description: seoConfig.defaults.description,
    keywords: seoConfig.defaults.keywords,
    canonical: seoConfig.technical.canonical || seoConfig.site.baseUrl,
    ogImage: seoConfig.branding.ogImage,
    index: seoConfig.technical.index,
    follow: seoConfig.technical.follow,
    robots: seoConfig.defaults.robots,
    themeColor: seoConfig.branding.themeColor,
    twitterCard: seoConfig.technical.twitterCard,
    locale: seoConfig.site.locale,
    author: seoConfig.author.name,
  };

  return mergeSEO(defaults, pageMeta, overrides);
};

export default useSEO;
