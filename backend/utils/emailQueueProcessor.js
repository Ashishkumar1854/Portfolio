import Campaign from '../models/Campaign.js';
import EmailQueue from '../models/EmailQueue.js';
import DeliveryLog from '../models/DeliveryLog.js';
import User from '../models/User.js';
import { sendEmail } from './sendEmail.js';

// Inject tracking pixels and click-through redirects
const injectTracking = (html, logId) => {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
  
  // Open tracking pixel
  let tracked = html + `<img src="${backendUrl}/api/broadcasts/track/open/${logId}" width="1" height="1" style="display:none;" />`;
  
  // Click-through redirection
  tracked = tracked.replace(/href="((https?:\/\/[^"]+))"/g, (match, p1) => {
    // Skip unsubscribe and profile dashboard preferences link
    if (p1.includes('/dashboard') || p1.includes('/unsubscribe')) {
      return match;
    }
    return `href="${backendUrl}/api/broadcasts/track/click/${logId}?url=${encodeURIComponent(p1)}"`;
  });
  
  return tracked;
};

// 1. Process Scheduled Campaigns
export const processScheduledCampaigns = async () => {
  try {
    const now = new Date();
    // Fetch campaigns scheduled for now or in the past that are in 'scheduled' status
    const pendingCampaigns = await Campaign.find({
      status: 'scheduled',
      scheduledAt: { $lte: now }
    });

    for (const campaign of pendingCampaigns) {
      campaign.status = 'processing';
      await campaign.save();

      // Resolve audience criteria
      let userQuery = { emailNotifications: true };

      if (campaign.targetAudience === 'Blog Subscribers') {
        userQuery.newsletterSubscribed = true;
        userQuery['notificationPreferences.blogs'] = true;
      } else if (campaign.targetAudience === 'Resource Subscribers') {
        userQuery.newsletterSubscribed = true;
        userQuery['notificationPreferences.resources'] = true;
      } else if (campaign.targetAudience === 'Case Study Subscribers') {
        userQuery.newsletterSubscribed = true;
        userQuery['notificationPreferences.caseStudies'] = true;
      } else if (campaign.targetAudience === 'Custom Segment' && campaign.customFilters) {
        userQuery.newsletterSubscribed = true;
        const filters = campaign.customFilters;
        
        // Joined date filter
        if (filters.joinedAfter) {
          userQuery.createdAt = { $gte: new Date(filters.joinedAfter) };
        }
        // Role filter
        if (filters.role) {
          userQuery.role = filters.role;
        }
        // Individual preferences filters
        if (filters.preferences) {
          Object.keys(filters.preferences).forEach(pref => {
            if (filters.preferences[pref] !== undefined) {
              userQuery[`notificationPreferences.${pref}`] = filters.preferences[pref];
            }
          });
        }
      }

      const matchedUsers = await User.find(userQuery);
      campaign.totalCount = matchedUsers.length;
      await campaign.save();

      if (matchedUsers.length === 0) {
        campaign.status = 'completed';
        await campaign.save();
        continue;
      }

      // Add jobs to EmailQueue
      const queueItems = matchedUsers.map(user => ({
        campaignId: campaign._id,
        recipient: user._id,
        email: user.email,
        subject: campaign.subject,
        html: campaign.content
      }));

      await EmailQueue.insertMany(queueItems);
      
      campaign.status = 'completed';
      await campaign.save();
      console.log(`Campaign "${campaign.title}" processed: queued ${matchedUsers.length} emails.`);
    }
  } catch (error) {
    console.error('Error in processScheduledCampaigns:', error);
  }
};

// 2. Process Email Queue (delivers in batches)
export const processEmailQueue = async () => {
  try {
    // Process a batch of 20 emails to avoid rate limit spikes and thread blocks
    const batch = await EmailQueue.find({ status: 'pending' }).limit(20);

    for (const item of batch) {
      item.status = 'processing';
      item.lastAttempt = new Date();
      item.attempts += 1;
      await item.save();

      // Pre-create Delivery Log to generate a unique tracking ID
      const log = await DeliveryLog.create({
        campaignId: item.campaignId,
        recipient: item.recipient,
        email: item.email,
        status: 'sent'
      });

      // Inject open-tracking pixel and click redirects
      const trackedHtml = injectTracking(item.html, log._id);

      try {
        await sendEmail({
          to: item.email,
          subject: item.subject,
          html: trackedHtml
        });

        // Delete from queue upon successful dispatch
        await item.deleteOne();

        // Increment campaign sent counters
        if (item.campaignId) {
          await Campaign.findByIdAndUpdate(item.campaignId, {
            $inc: { sentCount: 1 }
          });
        }
      } catch (sendError) {
        console.error(`Resend dispatch error for ${item.email}:`, sendError);

        // Update Delivery Log status to failed
        log.status = 'failed';
        log.error = sendError.message || 'Resend API connection failure';
        await log.save();

        if (item.attempts >= 3) {
          // Permanently fail and clear from active dispatch queue
          item.status = 'failed';
          item.error = sendError.message || 'Failed after 3 attempts';
          await item.save();
        } else {
          // Re-queue for next execution retry
          item.status = 'pending';
          item.error = sendError.message || 'Retrying';
          await item.save();
        }
      }
    }
  } catch (error) {
    console.error('Error in processEmailQueue:', error);
  }
};

// 3. Start Background Workers
export const startEmailWorker = () => {
  console.log('Background Email System Initialized.');
  
  // Check for scheduled campaigns every 30 seconds
  setInterval(processScheduledCampaigns, 30000);
  
  // Deliver pending emails from queue every 10 seconds
  setInterval(processEmailQueue, 10000);
};
