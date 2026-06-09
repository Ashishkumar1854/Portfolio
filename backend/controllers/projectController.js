import Project from '../models/Project.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryHelper.js';

export const getProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20; // Default limit 20 to accommodate most portfolio views without paginating unnecessarily, but ready for it.
    const skip = (page - 1) * limit;

    const projects = await Project.find().sort('-createdAt').skip(skip).limit(limit);
    const total = await Project.countDocuments();

    res.json({
      data: projects,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createProject = async (req, res) => {
  try {
    const { title, problem, tech, githubUrl, liveUrl, category, featured } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.path, 'projects');
    }

    if (!imageUrl) {
      return res.status(400).json({ message: 'Project image is required' });
    }

    const project = await Project.create({
      title,
      problem,
      tech: Array.isArray(tech) ? tech : JSON.parse(tech || '[]'),
      githubUrl,
      liveUrl,
      imageUrl,
      category,
      featured: featured === 'true' || featured === true,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { title, problem, tech, githubUrl, liveUrl, category, featured } = req.body;

    project.title = title || project.title;
    project.problem = problem || project.problem;
    if (tech) project.tech = Array.isArray(tech) ? tech : JSON.parse(tech);
    project.githubUrl = githubUrl || project.githubUrl;
    if (liveUrl !== undefined) project.liveUrl = liveUrl;
    project.category = category || project.category;
    if (featured !== undefined) project.featured = featured === 'true' || featured === true;

    if (req.file) {
      await deleteFromCloudinary(project.imageUrl);
      project.imageUrl = await uploadToCloudinary(req.file.path, 'projects');
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await deleteFromCloudinary(project.imageUrl);
    await project.deleteOne();

    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
