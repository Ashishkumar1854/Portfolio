import Achievement from '../models/Achievement.js';

export const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort('createdAt');
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createAchievement = async (req, res) => {
  try {
    const { label, value, icon } = req.body;
    
    const achievement = await Achievement.create({
      label,
      value,
      icon,
    });

    res.status(201).json(achievement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    const { label, value, icon } = req.body;

    achievement.label = label || achievement.label;
    achievement.value = value || achievement.value;
    achievement.icon = icon || achievement.icon;

    const updatedAchievement = await achievement.save();
    res.json(updatedAchievement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    await achievement.deleteOne();
    res.json({ message: 'Achievement removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
