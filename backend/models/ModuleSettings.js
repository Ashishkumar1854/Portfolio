import mongoose from 'mongoose';

const moduleSettingsSchema = new mongoose.Schema({
  key: {
    type: String,
    default: 'global',
    unique: true,
    index: true,
  },
  resourcesEnabled: {
    type: Boolean,
    default: true,
  },
  caseStudiesEnabled: {
    type: Boolean,
    default: true,
  },
  lockedResourceIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
  }],
  lockedCaseStudyIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CaseStudy',
  }],
}, {
  timestamps: true,
});

const ModuleSettings = mongoose.model('ModuleSettings', moduleSettingsSchema);
export default ModuleSettings;
