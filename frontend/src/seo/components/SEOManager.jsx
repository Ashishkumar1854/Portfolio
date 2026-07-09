import { useLocation } from "react-router-dom";

import SEO from "./SEO";
import serviceSchema from "../schemas/serviceSchema";

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
  "/services/",
  "/resources/",
  "/blog/",
  "/case-studies/",
];

const SEOManager = () => {
  const { pathname } = useLocation();

  if (pathname === "/hire") {
    return (
      <SEO
        page="hire"
        schemas={[
          serviceSchema({
            name: "Hire Ashish Kumar for AI Automation and Full-Stack Development",
            path: "/hire",
            serviceType: "AI Automation, SaaS Development, Full-Stack Development",
            description:
              "Project inquiry page for AI automation, n8n workflows, SaaS products, full-stack applications, API integrations, and technical consulting.",
            audience: "Founders, startups, and teams hiring a product engineer",
          }),
        ]}
      />
    );
  }

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
