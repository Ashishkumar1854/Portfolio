import CaseStudy from '../models/CaseStudy.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import { triggerNewCaseStudyNotification } from '../utils/notificationHelper.js';

// Helper: upload a single file to Cloudinary and remove temp
const uploadToCloudinary = async (filePath, folder = 'case-studies') => {
  const result = await cloudinary.uploader.upload(filePath, { folder });
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  return result.secure_url;
};

// @desc    Get all case studies
// @route   GET /api/case-studies
// @access  Public
export const getCaseStudies = async (req, res) => {
  try {
    const caseStudies = await CaseStudy.find().sort('-createdAt');
    res.json(caseStudies);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single case study
// @route   GET /api/case-studies/:id
// @access  Public
export const getCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findById(req.params.id);
    if (!caseStudy) return res.status(404).json({ message: 'Case study not found' });
    res.json(caseStudy);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a case study
// @route   POST /api/case-studies
// @access  Private/Admin
export const createCaseStudy = async (req, res) => {
  try {
    const {
      title, subtitle, overview, problem, research, architecture,
      implementation, results, lessonsLearned, techStack, featured, category,
    } = req.body;

    let imageUrl = '';
    let screenshots = [];

    // Handle main image upload
    if (req.files && req.files.image && req.files.image[0]) {
      imageUrl = await uploadToCloudinary(req.files.image[0].path, 'case-studies/main');
    }

    // Handle multiple screenshots
    if (req.files && req.files.screenshots) {
      for (const file of req.files.screenshots) {
        const url = await uploadToCloudinary(file.path, 'case-studies/screenshots');
        screenshots.push(url);
      }
    }

    const parsedTech = typeof techStack === 'string'
      ? JSON.parse(techStack)
      : techStack || [];

    const caseStudy = await CaseStudy.create({
      title, subtitle, overview, problem, research, architecture,
      implementation, results, lessonsLearned,
      techStack: parsedTech,
      screenshots,
      imageUrl,
      featured: featured === 'true' || featured === true,
      category,
    });

    // Send notifications to subscribers
    triggerNewCaseStudyNotification(caseStudy);

    res.status(201).json(caseStudy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a case study
// @route   PUT /api/case-studies/:id
// @access  Private/Admin
export const updateCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findById(req.params.id);
    if (!caseStudy) return res.status(404).json({ message: 'Case study not found' });

    const {
      title, subtitle, overview, problem, research, architecture,
      implementation, results, lessonsLearned, techStack, featured, category,
    } = req.body;

    // Handle new main image
    if (req.files && req.files.image && req.files.image[0]) {
      caseStudy.imageUrl = await uploadToCloudinary(req.files.image[0].path, 'case-studies/main');
    }

    // Handle new screenshots (append to existing)
    if (req.files && req.files.screenshots) {
      for (const file of req.files.screenshots) {
        const url = await uploadToCloudinary(file.path, 'case-studies/screenshots');
        caseStudy.screenshots.push(url);
      }
    }

    const parsedTech = typeof techStack === 'string'
      ? JSON.parse(techStack)
      : techStack || caseStudy.techStack;

    caseStudy.title = title || caseStudy.title;
    caseStudy.subtitle = subtitle ?? caseStudy.subtitle;
    caseStudy.overview = overview ?? caseStudy.overview;
    caseStudy.problem = problem ?? caseStudy.problem;
    caseStudy.research = research ?? caseStudy.research;
    caseStudy.architecture = architecture ?? caseStudy.architecture;
    caseStudy.implementation = implementation ?? caseStudy.implementation;
    caseStudy.results = results ?? caseStudy.results;
    caseStudy.lessonsLearned = lessonsLearned ?? caseStudy.lessonsLearned;
    caseStudy.techStack = parsedTech;
    caseStudy.featured = featured !== undefined ? (featured === 'true' || featured === true) : caseStudy.featured;
    caseStudy.category = category || caseStudy.category;

    const updated = await caseStudy.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a case study
// @route   DELETE /api/case-studies/:id
// @access  Private/Admin
export const deleteCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findById(req.params.id);
    if (!caseStudy) return res.status(404).json({ message: 'Case study not found' });
    await caseStudy.deleteOne();
    res.json({ message: 'Case study deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Remove a screenshot from a case study
// @route   DELETE /api/case-studies/:id/screenshot
// @access  Private/Admin
export const removeScreenshot = async (req, res) => {
  try {
    const { url } = req.body;
    const caseStudy = await CaseStudy.findById(req.params.id);
    if (!caseStudy) return res.status(404).json({ message: 'Case study not found' });
    caseStudy.screenshots = caseStudy.screenshots.filter(s => s !== url);
    await caseStudy.save();
    res.json({ message: 'Screenshot removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
