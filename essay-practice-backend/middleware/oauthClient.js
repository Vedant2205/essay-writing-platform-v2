import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Function to validate the token and return user data
const validateToken = async (token) => {
  try {
    const ticket = await oauth2Client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    
    const userData = ticket.getPayload();
    
    if (!userData) {
      throw new Error('No user data found in token');
    }

    // Verify required fields exist
    if (!userData.sub || !userData.email) {
      throw new Error('Invalid token payload');
    }

    return userData;
  } catch (error) {
    console.error('Token validation error:', error);
    throw new Error('Invalid or expired token');
  }
};

// Function to refresh token if needed
const refreshToken = async (refreshToken) => {
  try {
    const { credentials } = await oauth2Client.refreshToken(refreshToken);
    return credentials;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw new Error('Failed to refresh token');
  }
};

// Function to verify session
const verifySession = async (session) => {
  if (!session?.accessToken) {
    throw new Error('No session token found');
  }

  try {
    return await validateToken(session.accessToken);
  } catch (error) {
    throw new Error('Invalid session');
  }
};

export { oauth2Client, validateToken, refreshToken, verifySession };