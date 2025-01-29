import crypto from 'crypto';

// Generate a random 64-byte secret key for JWT
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('Generated JWT_SECRET:', jwtSecret);

// Generate a random 32-byte secret key for session management
const sessionSecret = crypto.randomBytes(32).toString('hex');
console.log('Generated SESSION_SECRET:', sessionSecret);
