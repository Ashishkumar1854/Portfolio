import seoConfig from "../config/seoConfig";
import { absoluteUrl } from "../utils/seoUtils";

const personSchema = {
  "@context": "https://schema.org",

  "@type": "Person",

  "@id": `${seoConfig.site.baseUrl}/#person`,

  name: seoConfig.author.name,

  url: seoConfig.site.baseUrl,

  image: absoluteUrl(seoConfig.branding.ogImage),

  email: seoConfig.author.email,

  jobTitle: "AI Automation Engineer",

  description: seoConfig.site.description,

  worksFor: {
    "@type": "Organization",
    "@id": `${seoConfig.site.baseUrl}/#organization`,
    name: seoConfig.site.name,
  },

  knowsAbout: [
    "AI Automation",
    "AI Agents",
    "Agentic AI",
    "LLM",
    "Prompt Engineering",
    "RAG",
    "n8n Automation",
    "Workflow Automation",
    "WhatsApp Automation",
    "React",
    "Next.js",
    "Node.js",
    "Express.js",
    "MongoDB",
    "PostgreSQL",
    "Docker",
    "Nginx",
    "AWS",
    "DevOps",
    "SaaS Development",
    "Full Stack Development",
  ],

  sameAs: [seoConfig.author.github, seoConfig.author.linkedin],
};

export default personSchema;
