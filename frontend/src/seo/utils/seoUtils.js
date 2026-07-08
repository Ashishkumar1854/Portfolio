import seoConfig from "../config/seoConfig";

const hasProtocol = (value = "") => /^https?:\/\//i.test(value);

export const absoluteUrl = (value, fallback = "") => {
  const resolvedValue = value || fallback;

  if (!resolvedValue) return undefined;
  if (hasProtocol(resolvedValue)) return resolvedValue;

  return `${seoConfig.site.baseUrl}${resolvedValue.startsWith("/") ? resolvedValue : `/${resolvedValue}`}`;
};

export const canonicalUrl = (value) => {
  if (!value) return seoConfig.technical.canonical || seoConfig.site.baseUrl;
  return absoluteUrl(value);
};

export const normalizeKeywords = (keywords = []) => {
  if (Array.isArray(keywords)) {
    return keywords.map((keyword) => String(keyword).trim()).filter(Boolean);
  }

  if (typeof keywords === "string") {
    return keywords
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean);
  }

  return [];
};

export const normalizeRobots = ({ robots, index, follow } = {}) => {
  const shouldIndex = index !== false;
  const shouldFollow = follow !== false;

  if (typeof index === "boolean" || typeof follow === "boolean") {
    return {
      robots: `${shouldIndex ? "index" : "noindex"}, ${shouldFollow ? "follow" : "nofollow"}`,
      index: shouldIndex,
      follow: shouldFollow,
    };
  }

  if (typeof robots === "string" && robots.trim()) {
    const normalized = robots.toLowerCase();

    return {
      robots,
      index: !normalized.includes("noindex"),
      follow: !normalized.includes("nofollow"),
    };
  }

  return {
    robots: `${shouldIndex ? "index" : "noindex"}, ${shouldFollow ? "follow" : "nofollow"}`,
    index: shouldIndex,
    follow: shouldFollow,
  };
};

export const mergeSEO = (base = {}, page = {}, overrides = {}) => {
  const merged = {
    ...base,
    ...page,
    ...overrides,
  };

  const robots = normalizeRobots(
    overrides.robots
      ? { robots: overrides.robots }
      : page.robots
        ? { robots: page.robots }
        : { robots: base.robots, index: merged.index, follow: merged.follow },
  );

  return {
    ...merged,
    ...robots,
    keywords: normalizeKeywords(merged.keywords),
    canonical: canonicalUrl(merged.canonical || merged.path),
    ogImage: absoluteUrl(merged.ogImage, seoConfig.branding.ogImage),
    themeColor: merged.themeColor || seoConfig.branding.themeColor,
    twitterCard: merged.twitterCard || seoConfig.technical.twitterCard,
    locale: merged.locale || seoConfig.site.locale,
  };
};
