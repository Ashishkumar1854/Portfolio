import Blog from '../models/Blog.js';
import Resource from '../models/Resource.js';
import CaseStudy from '../models/CaseStudy.js';

// @desc    Global Search across blogs, community posts, and resources
// @route   GET /api/search
// @access  Public
export const searchAll = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json({ blogs: [], resources: [], caseStudies: [] });
    }

    const regex = new RegExp(q, 'i');

    const [blogs, resources, caseStudies] = await Promise.all([
      Blog.find({
        published: { $ne: false },
        status: 'Published',
        noIndex: { $ne: true },
        $or: [
          { title: regex },
          { excerpt: regex },
          { subtitle: regex },
          { content: regex },
          { tags: regex }
        ]
      }).limit(5),

      Resource.find({
        $or: [
          { title: regex },
          { description: regex }
        ]
      }).limit(5),

      CaseStudy.find({
        published: { $ne: false },
        status: 'Published',
        noIndex: { $ne: true },
        $or: [
          { title: regex },
          { excerpt: regex },
          { subtitle: regex },
          { clientName: regex },
          { industry: regex },
          { category: regex },
          { techStack: regex },
          { content: regex },
          { overview: regex }
        ]
      }).limit(5)
    ]);

    res.json({
      blogs,
      resources,
      caseStudies
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
