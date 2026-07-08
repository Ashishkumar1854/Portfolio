import seoConfig from "../config/seoConfig";
import { absoluteUrl } from "../utils/seoUtils";

const projectSchema = (project) => {
  if (!project) return null;

  const url = `${seoConfig.site.baseUrl}/projects/${project.slug}`;
  const image = absoluteUrl(project.ogImage || project.thumbnail || project.imageUrl);
  const techStack = project.techStack?.length ? project.techStack : project.tech || [];
  const schemaType =
    project.projectType === "Open Source"
      ? "SoftwareSourceCode"
      : project.projectType === "Portfolio Showcase"
        ? "CreativeWork"
        : "SoftwareApplication";
  const keywords = [
    project.category,
    ...techStack,
    ...(project.tags || []),
  ].filter(Boolean);

  const baseSchema = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "@id": `${url}#project`,
    name: project.title,
    headline: project.seo?.custom && project.seo?.title ? project.seo.title : project.title,
    description:
      (project.seo?.custom && project.seo?.description) ||
      project.shortDescription ||
      project.overview,
    url,
    image,
    inLanguage: seoConfig.site.language,
    keywords: keywords.join(", "),
    datePublished: project.publishedAt || project.createdAt,
    dateModified: project.updatedAt,
    creator: {
      "@type": "Person",
      "@id": `${seoConfig.site.baseUrl}/#person`,
      name: seoConfig.author.name,
      url: seoConfig.site.baseUrl,
    },
    about: project.category,
    genre: "Developer Portfolio Project",
    sameAs: [project.liveUrl, project.githubUrl].filter(Boolean),
  };

  if (schemaType === "SoftwareApplication") {
    return {
      ...baseSchema,
      applicationCategory: project.category,
      operatingSystem: "Web",
      softwareVersion: project.updatedAt,
      featureList: project.features || [],
      programmingLanguage: techStack,
    };
  }

  if (schemaType === "SoftwareSourceCode") {
    return {
      ...baseSchema,
      codeRepository: project.githubUrl,
      programmingLanguage: techStack,
      runtimePlatform: "Web",
    };
  }

  return {
    ...baseSchema,
    programmingLanguage: techStack,
  };
};

export default projectSchema;
