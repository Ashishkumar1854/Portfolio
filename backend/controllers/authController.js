import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import { validationResult } from 'express-validator';
import crypto from 'crypto';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { 
    name, 
    email, 
    password, 
    emailNotifications, 
    newsletterSubscribed, 
    followingAuthor, 
    notificationPreferences 
  } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Admin detection
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim()) : [];
    const role = adminEmails.includes(email) ? 'admin' : 'user';

    const user = await User.create({
      name,
      email,
      password,
      role,
      emailNotifications: emailNotifications !== undefined ? emailNotifications : true,
      newsletterSubscribed: newsletterSubscribed !== undefined ? newsletterSubscribed : true,
      followingAuthor: followingAuthor !== undefined ? followingAuthor : true,
      notificationPreferences: notificationPreferences || {
        blogs: true,
        resources: true,
        caseStudies: true,
        announcements: true
      }
    });

    if (user) {
      generateToken(res, user._id);

      // Send welcome email
      try {
        await sendEmail({
          to: user.email,
          subject: 'Welcome to Ashish Portfolio',
          html: `<h1>Welcome ${user.name}!</h1><p>Thank you for registering on our platform.</p>`
        });
      } catch (emailError) {
        console.error('Welcome email failed to send:', emailError);
      }

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailNotifications: user.emailNotifications,
        newsletterSubscribed: user.newsletterSubscribed,
        followingAuthor: user.followingAuthor,
        notificationPreferences: user.notificationPreferences
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      // Check if admin emails changed and update role if necessary
      const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim()) : [];
      const expectedRole = adminEmails.includes(user.email) ? 'admin' : 'user';
      
      if (user.role !== expectedRole) {
        user.role = expectedRole;
        await user.save();
      }

      generateToken(res, user._id);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        github: user.github,
        linkedin: user.linkedin,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        username: user.username,
        bio: user.bio,
        avatar: user.avatar,
        github: user.github,
        linkedin: user.linkedin,
        website: user.website,
        skills: user.skills,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Forgot password - request reset email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      // Return 200/success anyway to avoid user enumeration
      return res.status(200).json({ message: 'If that email exists in our system, we have sent a password reset link to it.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire (15 minutes)
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    // Reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const message = `
      <h1>Password Reset Request</h1>
      <p>You are receiving this email because you (or someone else) have requested the reset of a password for your account.</p>
      <p>Please click on the link below, or paste it into your browser to complete the process within 15 minutes:</p>
      <p><a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #00E5A8; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a></p>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        html: message,
      });

      res.status(200).json({ message: 'Password reset link sent to email' });
    } catch (err) {
      console.error(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    // Hash token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { 
      name, 
      username, 
      bio, 
      avatar, 
      github, 
      linkedin, 
      website, 
      skills, 
      password,
      emailNotifications,
      newsletterSubscribed,
      followingAuthor,
      notificationPreferences
    } = req.body;

    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
      user.username = username;
    }

    user.name = name || user.name;
    user.bio = bio !== undefined ? bio : user.bio;
    user.avatar = avatar !== undefined ? avatar : user.avatar;
    user.github = github !== undefined ? github : user.github;
    user.linkedin = linkedin !== undefined ? linkedin : user.linkedin;
    user.website = website !== undefined ? website : user.website;
    user.skills = skills !== undefined ? skills : user.skills;
    user.emailNotifications = emailNotifications !== undefined ? emailNotifications : user.emailNotifications;
    user.newsletterSubscribed = newsletterSubscribed !== undefined ? newsletterSubscribed : user.newsletterSubscribed;
    user.followingAuthor = followingAuthor !== undefined ? followingAuthor : user.followingAuthor;
    
    if (notificationPreferences) {
      user.notificationPreferences = {
        ...user.notificationPreferences,
        ...notificationPreferences
      };
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      user.password = password;
    }

    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      username: updatedUser.username,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
      github: updatedUser.github,
      linkedin: updatedUser.linkedin,
      website: updatedUser.website,
      skills: updatedUser.skills,
      emailNotifications: updatedUser.emailNotifications,
      newsletterSubscribed: updatedUser.newsletterSubscribed,
      followingAuthor: updatedUser.followingAuthor,
      notificationPreferences: updatedUser.notificationPreferences
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/auth/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort('-createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user role (Admin)
// @route   PUT /api/auth/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.role = req.body.role || user.role;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

