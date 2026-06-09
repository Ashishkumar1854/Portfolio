import Journey from '../models/Journey.js';

export const getJourneys = async (req, res) => {
  try {
    const journeys = await Journey.find().sort('order');
    res.json(journeys);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createJourney = async (req, res) => {
  try {
    const { year, title, description, order } = req.body;
    
    const journey = await Journey.create({
      year,
      title,
      description,
      order: order || 0,
    });

    res.status(201).json(journey);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateJourney = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id);

    if (!journey) {
      return res.status(404).json({ message: 'Journey not found' });
    }

    const { year, title, description, order } = req.body;

    journey.year = year || journey.year;
    journey.title = title || journey.title;
    journey.description = description || journey.description;
    if (order !== undefined) journey.order = order;

    const updatedJourney = await journey.save();
    res.json(updatedJourney);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteJourney = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id);

    if (!journey) {
      return res.status(404).json({ message: 'Journey not found' });
    }

    await journey.deleteOne();
    res.json({ message: 'Journey removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
