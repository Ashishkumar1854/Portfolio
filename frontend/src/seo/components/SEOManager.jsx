import { useLocation } from "react-router-dom";

import SEO from "./SEO";

const routeSEOMap = {
  "/": "home",

  "/services": "services",

  "/projects": "projects",

  "/skills": "skills",

  "/resources": "resources",

  "/blog": "blog",

  "/case-studies": "caseStudies",

  "/about": "about",

  "/journey": "journey",

  "/hire": "hire",
};

const SEOManager = () => {
  const { pathname } = useLocation();

  // Exact route
  if (routeSEOMap[pathname]) {
    return <SEO page={routeSEOMap[pathname]} />;
  }

  // Dynamic Blog
  if (pathname.startsWith("/blog/")) {
    return <SEO page="blog" />;
  }

  // Dynamic Resources
  if (pathname.startsWith("/resources/")) {
    return <SEO page="resources" />;
  }

  // Dynamic Case Studies
  if (pathname.startsWith("/case-studies/")) {
    return <SEO page="caseStudies" />;
  }

  // Default
  return <SEO page="home" />;
};

export default SEOManager;
