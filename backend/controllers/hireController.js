import HireRequest from '../models/HireRequest.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import { sendEmail } from '../utils/sendEmail.js';

// @desc    Submit a hire request (with optional attachment)
// @route   POST /api/hire
// @access  Public
export const submitHireRequest = async (req, res) => {
  try {
    const { name, email, serviceType, scope, budget, message } = req.body;

    let attachmentUrl = '';

    // Handle optional attachment upload to Cloudinary
    if (req.file) {
      const filePath = req.file.path;
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          resource_type: 'auto', // handles PDF, DOC, images
          folder: 'hire-attachments',
        });
        attachmentUrl = result.secure_url;
      } catch (uploadErr) {
        console.error('Cloudinary attachment upload failed:', uploadErr);
      } finally {
        // remove temp file
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    }

    const hireRequest = await HireRequest.create({
      name,
      email,
      serviceType,
      scope: scope || '',
      budget,
      message,
      attachmentUrl,
    });

    // Send confirmation to client
    try {
      await sendEmail({
        to: email,
        subject: 'Hire Request Received – Ashish Portfolio',
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto">
            <h2 style="color:#4f8eff">Hello ${name} 👋</h2>
            <p>Thank you for reaching out! I've received your request for <b>${serviceType}</b>.</p>
            <p>I'll review your details and get back to you within <b>24 hours</b>.</p>
            ${scope ? `<p><b>Project Scope:</b> ${scope}</p>` : ''}
            ${attachmentUrl ? `<p>Your attachment was received successfully.</p>` : ''}
            <p style="color:#888;margin-top:24px;">— Ashish Kumar | AI Automation Engineer</p>
          </div>
        `,
      });
    } catch (err) {
      console.error('Failed to send client email:', err.message);
    }

    // Send notification to admin
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
    if (adminEmails.length > 0) {
      try {
        await sendEmail({
          to: adminEmails[0],
          subject: `🔔 New Hire Request from ${name}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:auto">
              <h2>New Hire Request</h2>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px;font-weight:bold;color:#555">Name</td><td style="padding:8px">${name}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;color:#555">Email</td><td style="padding:8px">${email}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;color:#555">Service</td><td style="padding:8px">${serviceType}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;color:#555">Budget</td><td style="padding:8px">${budget}</td></tr>
                ${scope ? `<tr><td style="padding:8px;font-weight:bold;color:#555">Scope</td><td style="padding:8px">${scope}</td></tr>` : ''}
                <tr><td style="padding:8px;font-weight:bold;color:#555">Message</td><td style="padding:8px">${message}</td></tr>
                ${attachmentUrl ? `<tr><td style="padding:8px;font-weight:bold;color:#555">Attachment</td><td style="padding:8px"><a href="${attachmentUrl}">View File</a></td></tr>` : ''}
              </table>
            </div>
          `,
        });
      } catch (err) {
        console.error('Failed to send admin email:', err.message);
      }
    }

    res.status(201).json({ message: 'Request submitted successfully', hireRequest });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all hire requests
// @route   GET /api/hire
// @access  Private/Admin
export const getHireRequests = async (req, res) => {
  try {
    const requests = await HireRequest.find().sort('-createdAt');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a hire request (budget, date, trackingLink, status)
// @route   PUT /api/hire/:id
// @access  Private/Admin
export const updateHireRequest = async (req, res) => {
  try {
    const { budget, date, trackingLink, status } = req.body;
    const request = await HireRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    request.budget = budget !== undefined ? budget : request.budget;
    request.date = date !== undefined ? date : request.date;
    request.trackingLink = trackingLink !== undefined ? trackingLink : request.trackingLink;
    request.status = status !== undefined ? status : request.status;
    
    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Confirm a hire request and send confirmation email to client
// @route   POST /api/hire/:id/confirm
// @access  Private/Admin
export const confirmHireRequest = async (req, res) => {
  try {
    const request = await HireRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    request.status = 'confirmed';
    const updatedRequest = await request.save();
    
    // Send detailed confirmation email
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid rgba(0,0,0,0.05); padding: 24px; border-radius: 12px;">
        <h2 style="color: #00E5A8; margin-bottom: 20px;">Project Confirmed 🎉</h2>
        <p>Hello <strong>${request.name}</strong>,</p>
        <p>I am pleased to inform you that your request for <strong>${request.serviceType}</strong> has been officially confirmed!</p>
        
        <div style="background-color: #f7f9fc; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Confirmed Project Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #666; width: 150px;"><strong>Confirmed Budget:</strong></td>
              <td style="padding: 6px 0; color: #333;">${request.budget}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #666;"><strong>Timeline / Date:</strong></td>
              <td style="padding: 6px 0; color: #333;">${request.date || 'TBD (To Be Scheduled)'}</td>
            </tr>
            ${request.trackingLink ? `
            <tr>
              <td style="padding: 6px 0; color: #666;"><strong>Project Link:</strong></td>
              <td style="padding: 6px 0; color: #333;"><a href="${request.trackingLink}" target="_blank" style="color: #4f8eff;">${request.trackingLink}</a></td>
            </tr>` : ''}
          </table>
        </div>
        
        <p>I will set up the resources and kick off the workflow as scheduled. You can track updates and source material using the links provided above.</p>
        <p>If you have any questions or additional references to share, feel free to reply directly to this email.</p>
        
        <hr style="border: 0; border-top: 1px solid rgba(0,0,0,0.05); margin: 24px 0;" />
        <p style="color: #888; font-size: 13px;">Best regards,<br/><strong>Ashish Kumar</strong><br/>AI Automation Engineer & SaaS Builder</p>
      </div>
    `;
    
    try {
      await sendEmail({
        to: request.email,
        subject: `Project Confirmed – ${request.serviceType} – Ashish Portfolio`,
        html: emailHtml,
      });
    } catch (emailErr) {
      console.error('Failed to send confirmation email:', emailErr.message);
    }
    
    res.json({ message: 'Request confirmed and email sent successfully', request: updatedRequest });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a hire request
// @route   DELETE /api/hire/:id
// @access  Private/Admin
export const deleteHireRequest = async (req, res) => {
  try {
    const request = await HireRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    await request.deleteOne();
    res.json({ message: 'Request deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
