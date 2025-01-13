import crypto from 'crypto';

// Generate a random 64-byte secret key and convert it to a hexadecimal string
const secret = crypto.randomBytes(64).toString('hex');

console.log('Generated JWT Secret Key:', secret);

