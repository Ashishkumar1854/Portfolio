import Campaign from '../models/Campaign.js';
import User from '../models/User.js';
import DeliveryLog from '../models/DeliveryLog.js';
import { processScheduledCampaigns } from '../utils/emailQueueProcessor.js';

// @desc    Create a new broadcast campaign
// @route   POST /api/broadcasts
// @access  Private/Admin
export const createCampaign = async (req, res) => {
  try {
    const { title, subject, content, bannerImage, targetAudience, customFilters, scheduledAt, sendImmediately } = req.body;

    const campaign = await Campaign.create({
      title,
      subject,
      content,
      bannerImage: bannerImage || '',
      targetAudience: targetAudience || 'All Users',
      customFilters: customFilters || {},
      scheduledAt: sendImmediately ? new Date() : new Date(scheduledAt || Date.now()),
      status: sendImmediately ? 'scheduled' : 'draft',
    });

    if (sendImmediately || (campaign.scheduledAt && campaign.scheduledAt <= new Date())) {
      campaign.status = 'scheduled';
      await campaign.save();
      // Run processor asynchronously to queue immediately
      processScheduledCampaigns();
    }

    res.status(201).json(campaign);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all campaigns (Admin only)
// @route   GET /api/broadcasts
// @access  Private/Admin
export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({}).sort('-createdAt');
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get broadcast subscriber stats and campaign metrics
// @route   GET /api/broadcasts/stats
// @access  Private/Admin
export const getBroadcastStats = async (req, res) => {
  try {
    const totalSubscribers = await User.countDocuments({ 
      emailNotifications: true, 
      newsletterSubscribed: true 
    });

    const blogSubscribers = await User.countDocuments({
      emailNotifications: true,
      newsletterSubscribed: true,
      'notificationPreferences.blogs': true
    });

    const resourceSubscribers = await User.countDocuments({
      emailNotifications: true,
      newsletterSubscribed: true,
      'notificationPreferences.resources': true
    });

    const caseStudySubscribers = await User.countDocuments({
      emailNotifications: true,
      newsletterSubscribed: true,
      'notificationPreferences.caseStudies': true
    });

    // Compute aggregated open/click metrics
    const totalSentLogs = await DeliveryLog.countDocuments({ status: 'sent' });
    const totalOpenedLogs = await DeliveryLog.countDocuments({ status: 'sent', opened: true });
    const totalClickedLogs = await DeliveryLog.countDocuments({ status: 'sent', clicked: true });

    const openRate = totalSentLogs > 0 ? ((totalOpenedLogs / totalSentLogs) * 100).toFixed(1) : 0;
    const clickRate = totalSentLogs > 0 ? ((totalClickedLogs / totalSentLogs) * 100).toFixed(1) : 0;

    res.json({
      totalSubscribers,
      blogSubscribers,
      resourceSubscribers,
      caseStudySubscribers,
      openRate: parseFloat(openRate),
      clickRate: parseFloat(clickRate),
      totalSentEmails: totalSentLogs
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Track Email Open (Returns 1x1 transparent tracking GIF)
// @route   GET /api/broadcasts/track/open/:logId
// @access  Public
export const trackOpen = async (req, res) => {
  try {
    const { logId } = req.params;
    const log = await DeliveryLog.findById(logId);

    if (log && !log.opened) {
      log.opened = true;
      await log.save();

      if (log.campaignId) {
        await Campaign.findByIdAndUpdate(log.campaignId, {
          $inc: { openCount: 1 }
        });
      }
    }

    // Return 1x1 transparent tracking GIF buffer
    const buf = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': buf.length,
      'Cache-Control': 'no-store, no-cache, must-revalidate, private'
    });
    res.end(buf);
  } catch (error) {
    console.error('Error tracking open:', error);
    res.status(500).end();
  }
};

// @desc    Track Email Link Click (Logs and redirects to target URL)
// @route   GET /api/broadcasts/track/click/:logId
// @access  Public
export const trackClick = async (req, res) => {
  try {
    const { logId } = req.params;
    const { url } = req.query;

    if (!url) {
      return res.status(400).send('Redirection URL query parameter is required');
    }

    const log = await DeliveryLog.findById(logId);

    if (log && !log.clicked) {
      log.clicked = true;
      await log.save();

      if (log.campaignId) {
        await Campaign.findByIdAndUpdate(log.campaignId, {
          $inc: { clickCount: 1 }
        });
      }
    }

    // Redirect to the original target URL
    res.redirect(url);
  } catch (error) {
    console.error('Error tracking click:', error);
    res.status(500).send('Tracking error occurred');
  }
};
