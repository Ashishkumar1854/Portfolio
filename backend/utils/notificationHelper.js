import User from '../models/User.js';
import Notification from '../models/Notification.js';
import EmailQueue from '../models/EmailQueue.js';

// Premium HTML Wrapper template for brand aesthetic
const wrapEmailTemplate = (title, bodyHtml) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: #0b0f19;
          color: #f0f0fa;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #111827;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          overflow: hidden;
          margin-top: 40px;
          margin-bottom: 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        .header {
          background-color: #00E5A8;
          padding: 24px;
          text-align: center;
        }
        .header h1 {
          color: #0b0f19;
          margin: 0;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .content {
          padding: 40px 32px;
          line-height: 1.6;
        }
        .content h2 {
          color: #ffffff;
          font-size: 20px;
          margin-top: 0;
          margin-bottom: 16px;
          font-weight: 700;
        }
        .content p {
          color: #9ca3af;
          font-size: 15px;
          margin-bottom: 24px;
        }
        .detail-box {
          background-color: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 28px;
        }
        .detail-title {
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 8px;
        }
        .detail-text {
          color: #9ca3af;
          font-size: 14px;
        }
        .btn {
          display: inline-block;
          background-color: #00E5A8;
          color: #0b0f19 !important;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          padding: 12px 28px;
          border-radius: 8px;
          text-align: center;
          transition: all 0.2s ease;
        }
        .footer {
          background-color: #090d16;
          padding: 20px 32px;
          text-align: center;
          border-t: 1px solid rgba(255, 255, 255, 0.05);
        }
        .footer p {
          color: #4b5563;
          font-size: 12px;
          margin: 0;
        }
        .footer a {
          color: #00E5A8;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div className="container">
        <div className="header">
          <h1>Ashish Portfolio Updates</h1>
        </div>
        <div className="content">
          ${bodyHtml}
        </div>
        <div className="footer">
          <p>You received this because you subscribed to updates on Ashish's platform.</p>
          <p><a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard">Manage Preferences</a> | <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard">Unsubscribe</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// 1. Trigger notifications for a New Blog
export const triggerNewBlogNotification = async (blog) => {
  try {
    // Target users who have preference for blogs
    const targetUsers = await User.find({
      'notificationPreferences.blogs': true
    });

    for (const user of targetUsers) {
      // Create In-App Notification
      await Notification.create({
        recipient: user._id,
        userId: user._id,
        sender: null, // System alert
        type: 'announcement',
        text: `New Blog Published: "${blog.title}"`,
        title: 'New Blog Post',
        message: `A new blog post has been published: "${blog.title}". Read it now!`,
        link: `/blog/${blog.slug || blog._id}`,
        blogId: blog._id.toString()
      });

      // Queue Email if subscribed
      if (user.emailNotifications && user.newsletterSubscribed) {
        const bodyHtml = `
          <h2>New Blog Published</h2>
          <p>Hi ${user.name}, a new article is live on the site.</p>
          <div class="detail-box">
            <div class="detail-title">${blog.title}</div>
            <div class="detail-text">${blog.excerpt || blog.subtitle || 'Read my latest thoughts and walkthrough.'}</div>
          </div>
          <p style="text-align: center;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/blog/${blog.slug || blog._id}" class="btn">Read Blog</a>
          </p>
        `;
        
        await EmailQueue.create({
          recipient: user._id,
          email: user.email,
          subject: `New Blog Published: ${blog.title}`,
          html: wrapEmailTemplate('New Blog Published', bodyHtml)
        });
      }
    }
  } catch (error) {
    console.error('Error in triggerNewBlogNotification:', error);
  }
};

// 2. Trigger notifications for a New Resource
export const triggerNewResourceNotification = async (resource) => {
  try {
    const targetUsers = await User.find({
      'notificationPreferences.resources': true
    });

    for (const user of targetUsers) {
      await Notification.create({
        recipient: user._id,
        userId: user._id,
        type: 'announcement',
        text: `New Resource Available: "${resource.title}"`,
        title: 'New Template Available',
        message: `A new template resource has been published: "${resource.title}". Download it now!`,
        link: `/resources/${resource.slug}`
      });

      if (user.emailNotifications && user.newsletterSubscribed) {
        const bodyHtml = `
          <h2>New Resource Available</h2>
          <p>Hi ${user.name}, a new downloadable workflow template is ready for you.</p>
          <div class="detail-box">
            <div class="detail-title">${resource.title} (${resource.category})</div>
            <div class="detail-text">${resource.description || 'Get this ready-to-import blueprint.'}</div>
          </div>
          <p style="text-align: center;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/resources/${resource.slug}" class="btn">Download Resource</a>
          </p>
        `;

        await EmailQueue.create({
          recipient: user._id,
          email: user.email,
          subject: `New Resource Available: ${resource.title}`,
          html: wrapEmailTemplate('New Resource Available', bodyHtml)
        });
      }
    }
  } catch (error) {
    console.error('Error in triggerNewResourceNotification:', error);
  }
};

// 3. Trigger notifications for a New Case Study
export const triggerNewCaseStudyNotification = async (caseStudy) => {
  try {
    const targetUsers = await User.find({
      'notificationPreferences.caseStudies': true
    });

    for (const user of targetUsers) {
      await Notification.create({
        recipient: user._id,
        userId: user._id,
        type: 'announcement',
        text: `New Case Study: "${caseStudy.title}"`,
        title: 'New Case Study Published',
        message: `Read our latest case study: "${caseStudy.title}". Check out the technical insights!`,
        link: `/case-studies/${caseStudy._id}`
      });

      if (user.emailNotifications && user.newsletterSubscribed) {
        const bodyHtml = `
          <h2>New Case Study Published</h2>
          <p>Hi ${user.name}, we just published a detailed system case study.</p>
          <div class="detail-box">
            <div class="detail-title">${caseStudy.title}</div>
            <p><strong>Problem:</strong> ${caseStudy.problem || 'System scaling bottleneck'}</p>
            <p><strong>Solution:</strong> ${caseStudy.overview || 'AI & automation engineering workflow'}</p>
            <p><strong>Results:</strong> ${caseStudy.results || 'Production live success'}</p>
          </div>
          <p style="text-align: center;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/case-studies/${caseStudy._id}" class="btn">View Case Study</a>
          </p>
        `;

        await EmailQueue.create({
          recipient: user._id,
          email: user.email,
          subject: `New Case Study Published: ${caseStudy.title}`,
          html: wrapEmailTemplate('New Case Study Published', bodyHtml)
        });
      }
    }
  } catch (error) {
    console.error('Error in triggerNewCaseStudyNotification:', error);
  }
};

// 4. Trigger notifications for a Community Announcement (broadcasting alert text)
export const triggerAnnouncementNotification = async (announcementText, campaignId = null) => {
  try {
    const targetUsers = await User.find({
      'notificationPreferences.announcements': true
    });

    for (const user of targetUsers) {
      await Notification.create({
        recipient: user._id,
        userId: user._id,
        type: 'announcement',
        text: `Announcement: ${announcementText.substring(0, 50)}...`,
        title: 'Community Update',
        message: announcementText,
        link: '/dashboard'
      });

      if (user.emailNotifications && user.newsletterSubscribed) {
        const bodyHtml = `
          <h2>Community Announcement</h2>
          <p>Hi ${user.name}, here is the latest update from the community board.</p>
          <div class="detail-box">
            <div class="detail-text">${announcementText}</div>
          </div>
          <p style="text-align: center;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard" class="btn">Visit Dashboard</a>
          </p>
        `;

        await EmailQueue.create({
          campaignId: campaignId,
          recipient: user._id,
          email: user.email,
          subject: 'Community Update',
          html: wrapEmailTemplate('Community Update', bodyHtml)
        });
      }
    }
  } catch (error) {
    console.error('Error in triggerAnnouncementNotification:', error);
  }
};
