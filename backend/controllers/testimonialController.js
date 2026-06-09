import Testimonial from '../models/Testimonial.js';

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort('-createdAt');
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createTestimonial = async (req, res) => {
  try {
    const { clientName, projectTitle, content, rating, approved } = req.body;
    
    const testimonial = await Testimonial.create({
      clientName,
      projectTitle,
      content,
      rating,
      approved: approved || false,
    });

    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    const { clientName, projectTitle, content, rating, approved } = req.body;

    testimonial.clientName = clientName || testimonial.clientName;
    testimonial.projectTitle = projectTitle || testimonial.projectTitle;
    testimonial.content = content || testimonial.content;
    if (rating !== undefined) testimonial.rating = rating;
    if (approved !== undefined) testimonial.approved = approved;

    const updatedTestimonial = await testimonial.save();
    res.json(updatedTestimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    await testimonial.deleteOne();
    res.json({ message: 'Testimonial removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
