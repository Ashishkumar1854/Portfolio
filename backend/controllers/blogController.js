import Blog from '../models/Blog.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryHelper.js';
import { triggerNewBlogNotification } from '../utils/notificationHelper.js';

// @desc    Get all blogs (with optional search)
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;
    const search = req.query.search ? req.query.search.trim() : '';

    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { subtitle: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
        ]
      };
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single blog by ID
// @route   GET /api/blogs/:id
// @access  Public
export const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = async (req, res) => {
  try {
    const { title, subtitle, content, category } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.path, 'blogs');
    }

    const blog = await Blog.create({
      title,
      subtitle,
      content,
      imageUrl,
      category: category || '',
      author: req.user._id,
    });

    // Send notifications to subscribers
    triggerNewBlogNotification(blog);

    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const { title, subtitle, content, category } = req.body;

    blog.title = title || blog.title;
    blog.subtitle = subtitle || blog.subtitle;
    blog.content = content || blog.content;
    blog.category = category !== undefined ? category : blog.category;

    if (req.file) {
      if (blog.imageUrl) {
        try { await deleteFromCloudinary(blog.imageUrl); } catch (e) { /* ignore */ }
      }
      blog.imageUrl = await uploadToCloudinary(req.file.path, 'blogs');
    }

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (blog.imageUrl) {
      try { await deleteFromCloudinary(blog.imageUrl); } catch (e) { /* ignore */ }
    }
    await blog.deleteOne();
    res.json({ message: 'Blog removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like / Unlike a blog post
// @route   POST /api/blogs/:id/like
// @access  Private
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const userId = req.user._id;
    const alreadyLiked = blog.likes.some(id => id.toString() === userId.toString());

    if (alreadyLiked) {
      blog.likes = blog.likes.filter(id => id.toString() !== userId.toString());
    } else {
      blog.likes.push(userId);
    }

    await blog.save();
    res.json({ likes: blog.likes, liked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Rate a blog post (1-5 stars)
// @route   POST /api/blogs/:id/rate
// @access  Private
export const rateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const { value } = req.body;
    const ratingValue = parseInt(value, 10);
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const userId = req.user._id;
    const existingIndex = blog.ratings.findIndex(r => r.userId.toString() === userId.toString());

    if (existingIndex !== -1) {
      blog.ratings[existingIndex].value = ratingValue;
    } else {
      blog.ratings.push({ userId, value: ratingValue });
    }

    await blog.save();
    res.json({ ratings: blog.ratings, avgRating: blog.avgRating, userRating: ratingValue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
