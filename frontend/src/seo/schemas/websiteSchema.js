import seoConfig from "../config/seoConfig";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",

  name: seoConfig.site.name,

  alternateName: seoConfig.site.shortName,

  url: seoConfig.site.baseUrl,

  description: seoConfig.site.description,

  inLanguage: seoConfig.site.language,

  publisher: {
    "@type": "Organization",
    "@id": `${seoConfig.site.baseUrl}/#organization`,
    name: seoConfig.site.name,
  },

  potentialAction: {
    "@type": "SearchAction",

    target: `${seoConfig.site.baseUrl}/search?q={search_term_string}`,

    "query-input": "required name=search_term_string",
  },
};

export default websiteSchema;
