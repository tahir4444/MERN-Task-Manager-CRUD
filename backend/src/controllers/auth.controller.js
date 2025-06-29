import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
import BlacklistedToken from '../models/BlacklistedToken.js';
import bcrypt from 'bcryptjs';
import { blacklistToken } from '../middlewares/auth.js';
import crypto from 'crypto';
import Role from '../models/Role.js';
dotenv.config();

// ✅ Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// ✅ Register User
export const register = async (req, res) => {
  try {
    const { name, username, email, password, mobile, address } = req.body;
    const profile_pic = req.file ? req.file.filename : null;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Get default user role
    const userRole = await Role.findOne({ name: 'user' });
    if (!userRole) {
      return res.status(500).json({ message: 'Default role not found' });
    }

    // Create new user with default role
    const user = new User({
      name,
      username,
      email,
      password,
      mobile,
      address,
      profile_pic,
      role: userRole._id,
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        profile_pic: user.profile_pic
          ? `${req.protocol}://${req.get('host')}/uploads/${user.profile_pic}`
          : null,
        role: userRole.name,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// ✅ Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and populate role
    const user = await User.findOne({ email }).populate({
      path: 'role',
      select: 'name description permissions'
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Ensure role is populated before accessing its properties
    if (!user.role) {
      console.error('User role not found for user:', {
        userId: user._id,
        email: user.email,
        roleId: user.role
      });
      return res.status(500).json({ message: 'User role not found' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        profile_pic: user.profile_pic
          ? `${req.protocol}://${req.get('host')}/uploads/${user.profile_pic}`
          : null,
        role: {
          name: user.role.name,
          description: user.role.description,
          permissions: user.role.permissions
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error logging in',
      error: error.message 
    });
  }
};

// ✅ Get Authenticated User
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('role');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        address: user.address,
        mobile: user.mobile,
        profile_pic: user.profile_pic
          ? `${req.protocol}://${req.get('host')}/uploads/${user.profile_pic}`
          : null,
        role: user.role.name,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate({
        path: 'role',
        select: 'name description permissions'
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.role) {
      console.error('User role not found:', {
        userId: user._id,
        email: user.email
      });
      return res.status(500).json({ message: 'User role not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        address: user.address,
        mobile: user.mobile,
        profile_pic: user.profile_pic
          ? `${req.protocol}://${req.get('host')}/uploads/${user.profile_pic}`
          : null,
        role: {
          name: user.role.name,
          description: user.role.description,
          permissions: user.role.permissions
        }
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
};

export const getProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.json({
      user: {
        profile_pic: user.profile_pic
          ? `${req.protocol}://${req.get('host')}/uploads/${user.profile_pic}`
          : null,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ error: 'Token and new password are required' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    res.status(500).json({ error: error.message });
  }
};

// ✅ Logout User
export const logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Blacklist the token
    await blacklistToken(req, token);

    res.status(200).json({ message: 'Logout successful and blacklisted' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
