import FAQ from '../models/FAQ.js';

export const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort('order createdAt');
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createFAQ = async (req, res) => {
  try {
    const { question, answer, order } = req.body;
    
    const faq = await FAQ.create({
      question,
      answer,
      order: order !== undefined ? Number(order) : 0,
    });

    res.status(201).json(faq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    const { question, answer, order } = req.body;

    faq.question = question !== undefined ? question : faq.question;
    faq.answer = answer !== undefined ? answer : faq.answer;
    faq.order = order !== undefined ? Number(order) : faq.order;

    const updatedFAQ = await faq.save();
    res.json(updatedFAQ);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    await faq.deleteOne();
    res.json({ message: 'FAQ removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
