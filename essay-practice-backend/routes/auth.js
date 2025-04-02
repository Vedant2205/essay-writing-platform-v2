import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import session from 'express-session';

dotenv.config();

const authRouter = express.Router();
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET;

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Middleware to verify Google OAuth token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.session.accessToken;
  
  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  try {
    // Verify the Google ID Token
    const ticket = await oauth2Client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    req.user = payload; // Store user data in request
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Google OAuth Login
authRouter.post('/google', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
    // Verify the Google token
    const ticket = await oauth2Client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const userData = ticket.getPayload();

    // Generate JWT token
    const jwtToken = jwt.sign(
      {
        userId: userData.sub,
        email: userData.email,
        name: userData.name,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Store tokens and user session
    req.session.accessToken = jwtToken;
    req.session.user = userData;

    // Send response with JWT and user info
    res.json({
      message: 'Authentication successful',
      token: jwtToken,
      user: {
        id: userData.sub,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
      },
      redirectUrl: '/dashboard',
    });

  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
});

// Get current user profile
authRouter.get('/profile', verifyToken, (req, res) => {
  res.json({
    user: req.user,
    isAuthenticated: true,
  });
});

// Check authentication status
authRouter.get('/check', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1] || req.session.accessToken;

  if (!token) {
    return res.json({ isAuthenticated: false });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    res.json({ isAuthenticated: true });
  } catch (error) {
    res.json({ isAuthenticated: false });
  }
});

// Logout Route
authRouter.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed', error: err.message });
    }
    res.clearCookie('connect.sid'); // Clear session cookie
    res.json({ message: 'Logged out successfully' });
  });
});

export default authRouter;
