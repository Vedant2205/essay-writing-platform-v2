import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const authRouter = express.Router();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Middleware to verify Google OAuth token
const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send('Token is required');
  }

  try {
    const ticket = await oauth2Client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    req.user = ticket.getPayload(); // Attach user info to request
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).send('Invalid or expired token');
  }
};

// Google OAuth callback route
authRouter.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.redirect('/profile'); // Redirect to profile page after successful login
  } catch (error) {
    console.error('Error in OAuth2 callback:', error);
    res.status(500).send('Failed to authenticate');
  }
});

// Protected route to fetch user profile info (requires valid token)
authRouter.get('/profile', verifyToken, (req, res) => {
  res.json(req.user); // Send user info if token is valid
});

export default authRouter;
