import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { validateToken } from '../middleware/oauthClient.js';

dotenv.config();

const authRouter = express.Router();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Middleware to verify Google OAuth token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.session.accessToken;
  
  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  try {
    const userData = await validateToken(token);
    req.user = userData; // Store user data in the request for later use
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Google OAuth POST route
authRouter.post('/google', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
    // Verify the Google token and get user data
    const userData = await validateToken(token);

    // Create JWT token including user_id
    const jwtToken = jwt.sign(
      {
        userId: userData.sub, // Store user_id from Google
        email: userData.email,
        name: userData.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // JWT expiration time set to 24 hours
    );

    // Store tokens and user data in session
    req.session.accessToken = jwtToken;
    req.session.googleToken = token;
    req.session.user = userData;

    // Send response with tokens and user data
    res.json({
      message: 'Authentication successful',
      token: jwtToken,
      user: {
        id: userData.sub, // Include user_id in the response
        email: userData.email,
        name: userData.name,
        picture: userData.picture
      },
      redirectUrl: '/dashboard'
    });

  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
});

// Get current user profile
authRouter.get('/profile', verifyToken, (req, res) => {
  // Send user data from session or token
  res.json({
    user: req.user, // Send user data stored in the request
    isAuthenticated: true
  });
});

// Check authentication status
authRouter.get('/check', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1] || req.session.accessToken;
  
  if (!token) {
    return res.json({ isAuthenticated: false });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ isAuthenticated: true });
  } catch (error) {
    res.json({ isAuthenticated: false });
  }
});

// Logout route
authRouter.post('/logout', (req, res) => {
  try {
    // Clear session data
    req.session.destroy((err) => {
      if (err) {
        throw new Error('Failed to destroy session');
      }
      // Clear session cookie
      res.clearCookie('sessionId');
      res.json({ message: 'Logged out successfully' });
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Failed to log out', error: error.message });
  }
});

export default authRouter;
