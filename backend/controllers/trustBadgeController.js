import TrustBadge from '../models/TrustBadge.js';

export const getTrustBadges = async (req, res) => {
  try {
    const badges = await TrustBadge.find().sort('order createdAt');
    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createTrustBadge = async (req, res) => {
  try {
    const { icon, text, order } = req.body;
    
    const badge = await TrustBadge.create({
      icon,
      text,
      order: order !== undefined ? Number(order) : 0,
    });

    res.status(201).json(badge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTrustBadge = async (req, res) => {
  try {
    const badge = await TrustBadge.findById(req.params.id);

    if (!badge) {
      return res.status(404).json({ message: 'Trust badge not found' });
    }

    const { icon, text, order } = req.body;

    badge.icon = icon !== undefined ? icon : badge.icon;
    badge.text = text !== undefined ? text : badge.text;
    badge.order = order !== undefined ? Number(order) : badge.order;

    const updatedBadge = await badge.save();
    res.json(updatedBadge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTrustBadge = async (req, res) => {
  try {
    const badge = await TrustBadge.findById(req.params.id);

    if (!badge) {
      return res.status(404).json({ message: 'Trust badge not found' });
    }

    await badge.deleteOne();
    res.json({ message: 'Trust badge removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
