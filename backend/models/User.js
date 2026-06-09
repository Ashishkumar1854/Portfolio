import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  bio: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: '',
  },
  github: {
    type: String,
    default: '',
  },
  linkedin: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
  skills: {
    type: [String],
    default: [],
  },
  emailNotifications: {
    type: Boolean,
    default: true,
  },
  newsletterSubscribed: {
    type: Boolean,
    default: true,
  },
  followingAuthor: {
    type: Boolean,
    default: true,
  },
  notificationPreferences: {
    blogs: { type: Boolean, default: true },
    resources: { type: Boolean, default: true },
    caseStudies: { type: Boolean, default: true },
    announcements: { type: Boolean, default: true },
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true,
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
