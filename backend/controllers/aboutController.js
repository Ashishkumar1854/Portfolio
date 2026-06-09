import About from '../models/About.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

const DEFAULT_ABOUT = {
  bioTitle: 'AI Automation Engineer & SaaS Product Builder',
  bioSubtitle: 'Who I Am',
  bioParagraphs: [
    "I'm Ashish Kumar — an AI Automation Engineer, SaaS Product Builder, and Full Stack Developer. I help startups and businesses automate their operations using AI Agents, n8n workflows, WhatsApp automation, and scalable software solutions.",
    "I founded Phoneo, a SaaS platform built from scratch. I've been a finalist at national-level hackathons including NCIIPC–AICTE Pentathon and CIH 2.0, competing against hundreds of teams.",
    "My philosophy: technology should serve real business outcomes. Whether it's an AI agent that saves 20 hours a week or a WhatsApp bot that handles 300 support tickets automatically — I build things that actually move the needle."
  ],
  avatarUrl: '',
  resumeUrl: '',
  whyChooseMe: [
    { title: 'Business-First Thinking', desc: 'I build for business outcomes, not just technical correctness. Every feature has a purpose.' },
    { title: 'Full-Stack Ownership', desc: 'One engineer who handles frontend, backend, AI, DevOps — no coordination overhead.' },
    { title: 'Automation-First Mindset', desc: 'I look for opportunities to automate before building manual solutions.' },
    { title: 'Clear Communication', desc: 'Regular updates, transparent timelines, and technical explanations in plain language.' },
    { title: 'Production-Ready Code', desc: 'Security, performance, and scalability are built-in — not afterthoughts.' }
  ],
  contactEmail: 'ashish@example.com',
  contactPhone: '+91 98765 43210',
  contactAddress: 'New Delhi, India',
  followUrl: 'https://linkedin.com',
};

// @desc    Get About info (seeds if empty)
// @route   GET /api/about
// @access  Public
export const getAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      console.log('Seeding default about profile info...');
      about = await About.create(DEFAULT_ABOUT);
    }
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update About info
// @route   PUT /api/about
// @access  Private/Admin
export const updateAbout = async (req, res) => {
  try {
    const { bioTitle, bioSubtitle, bioParagraphs, whyChooseMe, contactEmail, contactPhone, contactAddress, followUrl } = req.body;
    let about = await About.findOne();
    
    if (!about) {
      about = new About(DEFAULT_ABOUT);
    }
    
    about.bioTitle = bioTitle || about.bioTitle;
    about.bioSubtitle = bioSubtitle || about.bioSubtitle;
    about.contactEmail = contactEmail !== undefined ? contactEmail : about.contactEmail;
    about.contactPhone = contactPhone !== undefined ? contactPhone : about.contactPhone;
    about.contactAddress = contactAddress !== undefined ? contactAddress : about.contactAddress;
    about.followUrl = followUrl !== undefined ? followUrl : about.followUrl;
    if (bioParagraphs) {
      about.bioParagraphs = Array.isArray(bioParagraphs) 
        ? bioParagraphs 
        : JSON.parse(bioParagraphs);
    }
    if (whyChooseMe) {
      about.whyChooseMe = Array.isArray(whyChooseMe) 
        ? whyChooseMe 
        : JSON.parse(whyChooseMe);
    }
    
    // Handle file uploads
    if (req.files) {
      // 1. Avatar upload
      if (req.files['avatar'] && req.files['avatar'][0]) {
        const avatarFile = req.files['avatar'][0];
        try {
          const result = await cloudinary.uploader.upload(avatarFile.path, {
            resource_type: 'image',
            folder: 'about-avatar',
          });
          about.avatarUrl = result.secure_url;
        } catch (uploadErr) {
          console.error('Avatar upload failed:', uploadErr);
        } finally {
          if (fs.existsSync(avatarFile.path)) fs.unlinkSync(avatarFile.path);
        }
      }
      
      // 2. Resume upload
      if (req.files['resume'] && req.files['resume'][0]) {
        const resumeFile = req.files['resume'][0];
        try {
          const result = await cloudinary.uploader.upload(resumeFile.path, {
            resource_type: 'auto',
            folder: 'about-resume',
          });
          about.resumeUrl = result.secure_url;
        } catch (uploadErr) {
          console.error('Resume upload failed:', uploadErr);
        } finally {
          if (fs.existsSync(resumeFile.path)) fs.unlinkSync(resumeFile.path);
        }
      }
    }
    
    const updatedAbout = await about.save();
    res.json(updatedAbout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
