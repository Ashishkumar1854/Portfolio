import Blog from '../models/Blog.js';
import Resource from '../models/Resource.js';

// @desc    Global Search across blogs, community posts, and resources
// @route   GET /api/search
// @access  Public
export const searchAll = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json({ blogs: [], resources: [] });
    }

    const regex = new RegExp(q, 'i');

    const [blogs, resources] = await Promise.all([
      Blog.find({
        $or: [
          { title: regex },
          { subtitle: regex },
          { content: regex }
        ]
      }).limit(5),

      Resource.find({
        $or: [
          { title: regex },
          { description: regex }
        ]
      }).limit(5)
    ]);

    res.json({
      blogs,
      resources
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
