import mongoose from 'mongoose';
import ModuleSettings from '../models/ModuleSettings.js';

const getSettingsDocument = async () =>
  ModuleSettings.findOneAndUpdate(
    { key: 'global' },
    { $setOnInsert: { key: 'global' } },
    { new: true, upsert: true },
  );

const normalizeIdArray = (value) =>
  (Array.isArray(value) ? value : [])
    .map((item) => item?.toString?.() || String(item))
    .filter(Boolean);

const getValidObjectIds = (value) =>
  (Array.isArray(value) ? value : [])
    .map((item) => String(item))
    .filter((item) => mongoose.Types.ObjectId.isValid(item));

const normalizeSettings = (settings) => ({
  resourcesEnabled: settings?.resourcesEnabled !== false,
  caseStudiesEnabled: settings?.caseStudiesEnabled !== false,
  lockedResourceIds: normalizeIdArray(settings?.lockedResourceIds),
  lockedCaseStudyIds: normalizeIdArray(settings?.lockedCaseStudyIds),
});

export const getModuleSettings = async (req, res) => {
  try {
    const settings = await getSettingsDocument();
    res.json(normalizeSettings(settings));
  } catch (error) {
    res.status(500).json({ message: 'Unable to load module settings' });
  }
};

export const updateModuleSettings = async (req, res) => {
  try {
    const updates = {};
    if (req.body.resourcesEnabled !== undefined) {
      updates.resourcesEnabled = req.body.resourcesEnabled === true || req.body.resourcesEnabled === 'true';
    }
    if (req.body.caseStudiesEnabled !== undefined) {
      updates.caseStudiesEnabled = req.body.caseStudiesEnabled === true || req.body.caseStudiesEnabled === 'true';
    }
    if (Array.isArray(req.body.lockedResourceIds)) {
      updates.lockedResourceIds = getValidObjectIds(req.body.lockedResourceIds);
    }
    if (Array.isArray(req.body.lockedCaseStudyIds)) {
      updates.lockedCaseStudyIds = getValidObjectIds(req.body.lockedCaseStudyIds);
    }

    const settings = await ModuleSettings.findOneAndUpdate(
      { key: 'global' },
      { $set: updates, $setOnInsert: { key: 'global' } },
      { new: true, upsert: true },
    );

    res.json(normalizeSettings(settings));
  } catch (error) {
    res.status(400).json({ message: 'Unable to update module settings' });
  }
};
