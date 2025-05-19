import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
import BlacklistedToken from '../models/BlacklistedToken.js';
import bcrypt from 'bcryptjs';
import { blacklistToken } from '../middlewares/auth.js';
import crypto from 'crypto';
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
    const { name, username, email, mobile, address, password } = req.body;
    const profile_pic = req.file ? req.file.filename : null;

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already in use' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Create new user
    const user = await User.create({
      name,
      username,
      email,
      mobile,
      address,
      profile_pic,
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        mobile: user.mobile,
        address: user.address,
        profile_pic: profile_pic
          ? `${req.protocol}://${req.get('host')}/uploads/${profile_pic}`
          : null,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful',
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
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Authenticated User
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    //res.json(user);


    res.status(200).json({
      message: 'Login successful',
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
      },
    });


  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    //res.json(user);


    res.status(200).json({
      user: {
        profile_pic: user.profile_pic
          ? `${req.protocol}://${req.get('host')}/uploads/${user.profile_pic}`
          : null,
      },
    });
     const { profile_pic } = user;
     const filePath = path.join(__dirname, 'uploads', profile_pic);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.sendFile(filePath);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};  

// ✅ Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
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

    // Blacklist the reset token
    //await blacklistToken(req, token);

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
