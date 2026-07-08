import seoConfig from "../config/seoConfig";
import { absoluteUrl } from "../utils/seoUtils";

const breadcrumbSchema = (pageName, path, items) => {
  const itemListElement = items?.length
    ? items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.url || "/"),
      }))
    : [
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
          item: absoluteUrl(path || "/"),
        },
      ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
};

export default breadcrumbSchema;
