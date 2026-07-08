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

const pageOwnedSEORoutes = [
  "/projects/",
  "/resources/",
  "/blog/",
  "/case-studies/",
];

const SEOManager = () => {
  const { pathname } = useLocation();

  // Exact route
  if (routeSEOMap[pathname]) {
    return <SEO page={routeSEOMap[pathname]} />;
  }

  // Dynamic pages render their own item/category SEO.
  if (pageOwnedSEORoutes.some((route) => pathname.startsWith(route))) {
    return null;
  }

  // Default
  return <SEO page="home" />;
};

export default SEOManager;
