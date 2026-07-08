import { Helmet } from "react-helmet-async";

import useSEO from "../hooks/useSEO";

import websiteSchema from "../schemas/websiteSchema";
import organizationSchema from "../schemas/organizationSchema";
import personSchema from "../schemas/personSchema";
import breadcrumbSchema from "../schemas/breadcrumbSchema";
import seoConfig from "../config/seoConfig";
import { absoluteUrl, normalizeKeywords, normalizeRobots } from "../utils/seoUtils";

const SEO = ({ page, meta: overrides = {}, schemas = [] }) => {
  const meta = useSEO(page, overrides);

  const breadcrumbs = breadcrumbSchema(meta.breadcrumb || page, meta.path, meta.breadcrumbItems);
  const ogImage = absoluteUrl(meta.ogImage);
  const keywords = normalizeKeywords(meta.keywords);
  const robots = normalizeRobots(meta).robots;
  const ogType = meta.ogType || "website";

  return (
    <Helmet>
      {/* ======================================================
          Basic SEO
      ====================================================== */}
      <title>{meta.title}</title>

      <meta name="description" content={meta.description} />

      <meta name="keywords" content={keywords.join(", ")} />

      <meta name="robots" content={robots} />
      <meta name="author" content={meta.author || seoConfig.author.name} />

      {/* ======================================================
          Canonical URL
      ====================================================== */}
      <link rel="canonical" href={meta.canonical} />

      {/* ======================================================
          Open Graph
      ====================================================== */}
      <meta property="og:type" content={ogType} />

      <meta property="og:site_name" content={seoConfig.site.name} />

      <meta property="og:locale" content={meta.locale || seoConfig.site.locale} />

      <meta property="og:title" content={meta.title} />

      <meta property="og:description" content={meta.description} />

      <meta property="og:url" content={meta.canonical} />

      <meta property="og:image" content={ogImage} />

      {meta.publishedTime && (
        <meta property="article:published_time" content={meta.publishedTime} />
      )}

      {meta.modifiedTime && (
        <meta property="article:modified_time" content={meta.modifiedTime} />
      )}

      {/* ======================================================
          Twitter / X
      ====================================================== */}
      <meta name="twitter:card" content={meta.twitterCard || seoConfig.technical.twitterCard} />

      <meta name="twitter:title" content={meta.title} />

      <meta name="twitter:description" content={meta.description} />

      <meta name="twitter:image" content={ogImage} />

      {/* ======================================================
          Theme Color
      ====================================================== */}
      <meta name="theme-color" content={meta.themeColor || seoConfig.branding.themeColor} />

      {/* ======================================================
          Structured Data
      ====================================================== */}

      {/* Website */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>

      {/* Organization */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      {/* Person */}
      <script type="application/ld+json">{JSON.stringify(personSchema)}</script>

      {/* Breadcrumb */}
      <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>

      {schemas.filter(Boolean).map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
