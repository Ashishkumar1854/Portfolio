/**
 * ==========================================================
 * SEO CONFIGURATION
 * ----------------------------------------------------------
 * Single Source of Truth for the entire website.
 * Every SEO-related file (meta tags, schema, sitemap,
 * Open Graph, robots, etc.) will use this configuration.
 * ==========================================================
 */

const siteName = "Ashish Portfolio";
const shortName = "Ashish";
const baseUrl = import.meta.env.VITE_SITE_URL || "http://localhost:3000";
const contactEmail = "ashishkyadav.dev@gmail.com";
const defaultTitle = "Ashish Kumar | AI Automation Engineer & SaaS Product Builder";
const defaultDescription =
  "AI Automation Engineer, SaaS Product Builder, Full Stack Developer, AI Agent Developer, React, Node.js, n8n, WhatsApp Automation, Docker, PostgreSQL and scalable web applications.";

export const seoConfig = {
  // -------------------------------------------------------
  // Website Information
  // -------------------------------------------------------
  site: {
    name: siteName,
    shortName,

    defaultTitle,

    tagline: "AI Automation Engineer & SaaS Product Builder",

    description:
      "Ashish Kumar is an AI Automation Engineer and SaaS Product Builder specializing in AI Agents, n8n workflows, React, Node.js, WhatsApp Automation, and scalable web applications. Explore projects, services, case studies, and practical developer resources.",

    language: "en",

    locale: "en_IN",

    baseUrl,

    contactEmail,
  },

  // -------------------------------------------------------
  // Author Information
  // -------------------------------------------------------
  author: {
    name: "Ashish Kumar",

    role: "AI Automation Engineer",

    email: contactEmail,

    github: "https://github.com/Ashishkumar1854",

    linkedin: "https://www.linkedin.com/in/ashishkumar1854/",
  },

  // -------------------------------------------------------
  // Branding
  // -------------------------------------------------------
  branding: {
    logo: "/logo.png",

    favicon: "/favicon.svg",

    ogImage: "/images/og-image.png",

    themeColor: "#4F46E5",
  },

  // -------------------------------------------------------
  // Default SEO
  // -------------------------------------------------------
  defaults: {
    title: defaultTitle,

    description: defaultDescription,

    keywords: [
      "Ashish Kumar",
      "AI Automation Engineer",
      "AI Agent Developer",
      "SaaS Developer",
      "Full Stack Developer",
      "React Developer",
      "Node.js",
      "MERN Stack",
      "n8n",
      "WhatsApp Automation",
      "Docker",
      "PostgreSQL",
      "AI",
      "Portfolio",
    ],

    robots: "index, follow",
  },

  // -------------------------------------------------------
  // Technical SEO
  // -------------------------------------------------------
  technical: {
    canonical: baseUrl,

    twitterCard: "summary_large_image",

    index: true,

    follow: true,
  },

  // -------------------------------------------------------
  // Social Links
  // -------------------------------------------------------
  social: {
    github: "https://github.com/Ashishkumar1854",

    linkedin: "https://www.linkedin.com/in/ashishkumar1854/",
  },
};

export default seoConfig;
