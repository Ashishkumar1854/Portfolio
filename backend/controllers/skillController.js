import Skill from '../models/Skill.js';

export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort('category name');
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createSkill = async (req, res) => {
  try {
    const { category, name, icon, proficiency, badge, showOnHome } = req.body;
    
    const skill = await Skill.create({
      category,
      name,
      icon,
      proficiency,
      badge,
      showOnHome: showOnHome !== undefined ? Boolean(showOnHome) : false,
    });

    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    const { category, name, icon, proficiency, badge, showOnHome } = req.body;

    skill.category = category || skill.category;
    skill.name = name || skill.name;
    skill.icon = icon || skill.icon;
    if (proficiency !== undefined) skill.proficiency = proficiency;
    skill.badge = badge || skill.badge;
    if (showOnHome !== undefined) skill.showOnHome = Boolean(showOnHome);

    const updatedSkill = await skill.save();
    res.json(updatedSkill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    await skill.deleteOne();
    res.json({ message: 'Skill removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
