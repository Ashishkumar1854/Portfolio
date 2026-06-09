import HomeConfig from '../models/HomeConfig.js';

export const getHomeConfig = async (req, res) => {
  try {
    let config = await HomeConfig.findOne();
    if (!config) {
      config = await HomeConfig.create({}); // Mongoose handles defaults
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateHomeConfig = async (req, res) => {
  try {
    let config = await HomeConfig.findOne();
    if (!config) {
      config = new HomeConfig();
    }

    const {
      heroBadge,
      heroTitle,
      heroSubtitle,
      heroCtaText,
      heroCtaLink,
      heroSecondaryText,
      heroSecondaryLink,
      heroTechBadges,
      ctaTitle,
      ctaSubtitle,
      ctaBtnText,
      ctaBtnLink,
    } = req.body;

    if (heroBadge !== undefined) config.heroBadge = heroBadge;
    if (heroTitle !== undefined) config.heroTitle = heroTitle;
    if (heroSubtitle !== undefined) config.heroSubtitle = heroSubtitle;
    if (heroCtaText !== undefined) config.heroCtaText = heroCtaText;
    if (heroCtaLink !== undefined) config.heroCtaLink = heroCtaLink;
    if (heroSecondaryText !== undefined) config.heroSecondaryText = heroSecondaryText;
    if (heroSecondaryLink !== undefined) config.heroSecondaryLink = heroSecondaryLink;
    if (heroTechBadges !== undefined) config.heroTechBadges = heroTechBadges;
    if (ctaTitle !== undefined) config.ctaTitle = ctaTitle;
    if (ctaSubtitle !== undefined) config.ctaSubtitle = ctaSubtitle;
    if (ctaBtnText !== undefined) config.ctaBtnText = ctaBtnText;
    if (ctaBtnLink !== undefined) config.ctaBtnLink = ctaBtnLink;

    const updatedConfig = await config.save();
    res.json(updatedConfig);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
