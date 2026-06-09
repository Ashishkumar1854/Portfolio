import Bookmark from '../models/Bookmark.js';
import Blog from '../models/Blog.js';
import Resource from '../models/Resource.js';

// @desc    Toggle a bookmark (bookmark / unbookmark)
// @route   POST /api/bookmarks/toggle
// @access  Private
export const toggleBookmark = async (req, res) => {
  try {
    const { itemType, itemId } = req.body;
    const userId = req.user._id;

    if (!['Blog', 'Resource'].includes(itemType)) {
      return res.status(400).json({ message: 'Invalid bookmark item type' });
    }

    const existing = await Bookmark.findOne({ userId, itemType, itemId });

    if (existing) {
      await existing.deleteOne();
      return res.json({ bookmarked: false, message: 'Bookmark removed' });
    }

    await Bookmark.create({
      userId,
      itemType,
      itemId,
    });

    res.status(201).json({ bookmarked: true, message: 'Bookmark saved' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Check if a specific item is bookmarked by user
// @route   GET /api/bookmarks/check
// @access  Private
export const checkBookmarkStatus = async (req, res) => {
  try {
    const { itemType, itemId } = req.query;
    const userId = req.user._id;

    const existing = await Bookmark.findOne({ userId, itemType, itemId });
    res.json({ bookmarked: !!existing });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all bookmarks for logged-in user
// @route   GET /api/bookmarks
// @access  Private
export const getUserBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id }).sort('-createdAt');

    const populatedBookmarks = [];

    for (const b of bookmarks) {
      let itemDetails = null;
      try {
        if (b.itemType === 'Blog') {
          itemDetails = await Blog.findById(b.itemId);
        } else if (b.itemType === 'Resource') {
          itemDetails = await Resource.findById(b.itemId);
        }
      } catch (err) {
        console.error(`Error populating bookmark item ${b.itemId}:`, err);
      }

      // If document still exists, include in output
      if (itemDetails) {
        populatedBookmarks.push({
          _id: b._id,
          itemType: b.itemType,
          itemId: b.itemId,
          createdAt: b.createdAt,
          itemDetails,
        });
      }
    }

    res.json(populatedBookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
