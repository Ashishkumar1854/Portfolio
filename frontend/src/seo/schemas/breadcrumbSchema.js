import seoConfig from "../config/seoConfig";

const breadcrumbSchema = (pageName, path) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",

  itemListElement: [
    {
      "@type": "ListItem",

      position: 1,

      name: "Home",

      item: seoConfig.site.baseUrl,
    },

    {
      "@type": "ListItem",

      position: 2,

      name: pageName,

      item: `${seoConfig.site.baseUrl}${path}`,
    },
  ],
});

export default breadcrumbSchema;
