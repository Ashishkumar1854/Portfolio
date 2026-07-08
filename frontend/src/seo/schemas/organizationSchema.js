import seoConfig from "../config/seoConfig";
import { absoluteUrl } from "../utils/seoUtils";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${seoConfig.site.baseUrl}/#organization`,
  name: seoConfig.site.name,
  alternateName: seoConfig.site.shortName,
  url: seoConfig.site.baseUrl,
  logo: absoluteUrl(seoConfig.branding.logo),
  image: absoluteUrl(seoConfig.branding.ogImage),
  email: seoConfig.author.email,
  founder: {
    "@type": "Person",
    "@id": `${seoConfig.site.baseUrl}/#person`,
    name: seoConfig.author.name,
  },
  sameAs: [seoConfig.social.github, seoConfig.social.linkedin].filter(Boolean),
};

export default organizationSchema;
