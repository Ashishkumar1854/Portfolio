import ProcessStep from '../models/ProcessStep.js';

export const getProcessSteps = async (req, res) => {
  try {
    const steps = await ProcessStep.find().sort('order createdAt');
    res.json(steps);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createProcessStep = async (req, res) => {
  try {
    const { title, desc, order } = req.body;
    
    const step = await ProcessStep.create({
      title,
      desc,
      order: order !== undefined ? Number(order) : 0,
    });

    res.status(201).json(step);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProcessStep = async (req, res) => {
  try {
    const step = await ProcessStep.findById(req.params.id);

    if (!step) {
      return res.status(404).json({ message: 'Process step not found' });
    }

    const { title, desc, order } = req.body;

    step.title = title !== undefined ? title : step.title;
    step.desc = desc !== undefined ? desc : step.desc;
    step.order = order !== undefined ? Number(order) : step.order;

    const updatedStep = await step.save();
    res.json(updatedStep);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProcessStep = async (req, res) => {
  try {
    const step = await ProcessStep.findById(req.params.id);

    if (!step) {
      return res.status(404).json({ message: 'Process step not found' });
    }

    await step.deleteOne();
    res.json({ message: 'Process step removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
