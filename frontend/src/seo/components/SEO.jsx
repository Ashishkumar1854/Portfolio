import { Helmet } from "react-helmet-async";

import seoConfig from "../config/seoConfig";
import useSEO from "../hooks/useSEO";

import websiteSchema from "../schemas/websiteSchema";
import personSchema from "../schemas/personSchema";
import breadcrumbSchema from "../schemas/breadcrumbSchema";

const SEO = ({ page }) => {
  const meta = useSEO(page);

  const breadcrumbs = breadcrumbSchema(meta.breadcrumb || page, meta.path);

  return (
    <Helmet>
      {/* ======================================================
          Basic SEO
      ====================================================== */}
      <title>{meta.title}</title>

      <meta name="description" content={meta.description} />

      <meta name="keywords" content={meta.keywords.join(", ")} />

      <meta
        name="robots"
        content={`${meta.index ? "index" : "noindex"}, ${
          meta.follow ? "follow" : "nofollow"
        }`}
      />

      {/* ======================================================
          Canonical URL
      ====================================================== */}
      <link rel="canonical" href={meta.canonical} />

      {/* ======================================================
          Open Graph
      ====================================================== */}
      <meta property="og:type" content="website" />

      <meta property="og:site_name" content={seoConfig.site.name} />

      <meta property="og:locale" content={seoConfig.site.locale} />

      <meta property="og:title" content={meta.title} />

      <meta property="og:description" content={meta.description} />

      <meta property="og:url" content={meta.canonical} />

      <meta
        property="og:image"
        content={`${seoConfig.site.baseUrl}${meta.ogImage}`}
      />

      {/* ======================================================
          Twitter / X
      ====================================================== */}
      <meta name="twitter:card" content={seoConfig.technical.twitterCard} />

      <meta name="twitter:title" content={meta.title} />

      <meta name="twitter:description" content={meta.description} />

      <meta
        name="twitter:image"
        content={`${seoConfig.site.baseUrl}${meta.ogImage}`}
      />

      {/* ======================================================
          Theme Color
      ====================================================== */}
      <meta name="theme-color" content={seoConfig.branding.themeColor} />

      {/* ======================================================
          Structured Data
      ====================================================== */}

      {/* Website */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>

      {/* Person */}
      <script type="application/ld+json">{JSON.stringify(personSchema)}</script>

      {/* Breadcrumb */}
      <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
    </Helmet>
  );
};

export default SEO;
