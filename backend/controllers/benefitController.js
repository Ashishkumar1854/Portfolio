import Benefit from '../models/Benefit.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import EmailQueue from '../models/EmailQueue.js';

// @desc    Get all community benefits
// @route   GET /api/benefits
// @access  Public
export const getBenefits = async (req, res) => {
  try {
    const benefits = await Benefit.find({}).sort('order');
    res.json(benefits);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new community benefit (Admin only)
// @route   POST /api/benefits
// @access  Private/Admin
export const createBenefit = async (req, res) => {
  try {
    const { title, description, icon, order } = req.body;

    const benefit = await Benefit.create({
      title,
      description,
      icon: icon || 'Check',
      order: order || 0,
    });

    // Notify all active users of the new community benefit
    const users = await User.find({ emailNotifications: true });
    
    for (const user of users) {
      // Create in-app notification
      await Notification.create({
        recipient: user._id,
        userId: user._id,
        type: 'announcement',
        text: `New Community Benefit: "${title}"`,
        title: 'New Community Benefit',
        message: `A new benefit has been added to our Community: "${title}". ${description}`,
        link: '/dashboard'
      });

      // Send email if opted into announcements/newsletters
      if (user.newsletterSubscribed && user.notificationPreferences.announcements) {
        await EmailQueue.create({
          recipient: user._id,
          email: user.email,
          subject: `New Community Benefit: ${title}`,
          html: `
            <div style="font-family: sans-serif; background-color: #0b0f19; color: #f0f0fa; padding: 30px; border-radius: 12px;">
              <h2 style="color: #00E5A8; margin-top: 0;">New Community Benefit Added!</h2>
              <p>Hi ${user.name}, we have added a new benefit to our community circle:</p>
              <div style="background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #ffffff; margin-top: 0; margin-bottom: 8px;">${title}</h3>
                <p style="color: #9ca3af; font-size: 14px; margin: 0;">${description}</p>
              </div>
              <p style="text-align: center; margin-top: 25px;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard" style="background-color: #00E5A8; color: #0b0f19; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 6px; display: inline-block;">Explore the Dashboard</a>
              </p>
            </div>
          `
        });
      }
    }

    res.status(201).json(benefit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a community benefit (Admin only)
// @route   PUT /api/benefits/:id
// @access  Private/Admin
export const updateBenefit = async (req, res) => {
  try {
    const benefit = await Benefit.findById(req.params.id);

    if (!benefit) {
      return res.status(404).json({ message: 'Benefit not found' });
    }

    benefit.title = req.body.title || benefit.title;
    benefit.description = req.body.description || benefit.description;
    benefit.icon = req.body.icon || benefit.icon;
    benefit.order = req.body.order !== undefined ? req.body.order : benefit.order;

    const updated = await benefit.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a community benefit (Admin only)
// @route   DELETE /api/benefits/:id
// @access  Private/Admin
export const deleteBenefit = async (req, res) => {
  try {
    const benefit = await Benefit.findById(req.params.id);

    if (!benefit) {
      return res.status(404).json({ message: 'Benefit not found' });
    }

    await benefit.deleteOne();
    res.json({ message: 'Benefit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
