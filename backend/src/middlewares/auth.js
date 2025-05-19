import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import BlacklistedToken from '../models/BlacklistedToken.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Check if token is blacklisted
      const blacklisted = await BlacklistedToken.findOne({ token });
      if (blacklisted) {
        return res
          .status(401)
          .json({ error: 'Token is blacklisted. Please login again.' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ error: 'Not authorized, no token' });
  }
};

// Function to blacklist a token
export const blacklistToken = async (req, token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const expiresAt = new Date(decoded.exp * 1000); // Convert exp to Date

    await BlacklistedToken.create({
      token,
      userId: req.user._id,
      ipAddress: req.ip || req.connection.remoteAddress,
      expiresAt
    });
  } catch (error) {
    console.error('Error blacklisting token:', error);
  }
};

// Aliases
export const authenticate = protect;

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Not authorized as admin' });
  }
};

export const isUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    res.status(403).json({ error: 'Not authorized as user' });
  }
};
export const isModerator = (req, res, next) => {
  if (req.user && req.user.role === 'moderator') {
    next();
  } else {
    res.status(403).json({ error: 'Not authorized as moderator' });
  }
};
export const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ error: 'Not authorized as superadmin' });
  }
};
export const isGuest = (req, res, next) => {
  if (!req.user) {
    next();
  } else {
    res.status(403).json({ error: 'Not authorized as guest' });
  }
};
/* 
export const logoutUser = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Add token to Redis blacklist
    await redisClient.set(`bl_${token}`, 'blacklisted', {
      EX: 60 * 60 * 24, // Token expiration time (1 day)
    });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; */
