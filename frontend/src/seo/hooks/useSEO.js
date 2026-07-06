import seoConfig from "../config/seoConfig";
import pageSEO from "../config/pageSEO";

const useSEO = (page) => {
  // Get page-specific SEO
  const pageMeta = pageSEO[page];

  // Fallback to default SEO if page is missing
  if (!pageMeta) {
    console.warn(
      `[SEO] Metadata not found for page "${page}". Using default configuration.`,
    );

    return {
      title: seoConfig.site.defaultTitle,
      description: seoConfig.defaults.description,
      keywords: seoConfig.defaults.keywords,
      canonical: seoConfig.site.baseUrl,
      ogImage: seoConfig.branding.ogImage,
      index: true,
      follow: true,
    };
  }

  // Merge defaults with page metadata
  return {
    title: pageMeta.title || seoConfig.site.defaultTitle,

    description: pageMeta.description || seoConfig.defaults.description,

    keywords: pageMeta.keywords || seoConfig.defaults.keywords,

    canonical: pageMeta.canonical || seoConfig.site.baseUrl,

    ogImage: pageMeta.ogImage || seoConfig.branding.ogImage,

    index: pageMeta.index ?? true,

    follow: pageMeta.follow ?? true,
  };
};

export default useSEO;
