// JWT Token Generator for Testing
// Run with: node generate-token.cjs

const crypto = require('crypto');

// Your JWT configuration from .env.docker
const SECRET = 'DLCGnQGYlH4Xfe53aOXP8F6V32eo25gw';
const ALGORITHM = 'HS256';

// Token claims - customize as needed
const payload = {
  sub: "3",  // User ID (the admin user from seed data)
  email: "admin",
  name: "admin",
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Admin",
  exp: Math.floor(Date.now() / 1000) + (60 * 6000),  // Expires in 100 hour
  iat: Math.floor(Date.now() / 1000),
  nbf: Math.floor(Date.now() / 1000)
};

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function generateJWT() {
  // Create header
  const header = {
    alg: ALGORITHM,
    typ: 'JWT'
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  // Create signature
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(signatureInput)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  // Combine all parts
  const token = `${encodedHeader}.${encodedPayload}.${signature}`;
  
  return token;
}

// Generate token
const token = generateJWT();

console.log('\n=================================');
console.log('JWT TOKEN GENERATED FOR TESTING');
console.log('=================================\n');
console.log('Token:');
console.log(token);
console.log('\n');
console.log('User Details:');
console.log('- User ID:', payload.sub);
console.log('- Email:', payload.email);
console.log('- Name:', payload.name);
console.log('- Role:', payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
console.log('- Expires:', new Date(payload.exp * 1000).toLocaleString());
console.log('\n');
console.log('Usage:');
console.log('1. Copy the token above');
console.log('2. Open http://localhost:5105/scalar/v1');
console.log('3. Click the 🔒 Authorize button');
console.log('4. Paste the token');
console.log('5. Test your API!');
console.log('\n=================================\n');

// Also save to file
const fs = require('fs');
fs.writeFileSync('jwt-token.txt', token);
console.log('Token also saved to: jwt-token.txt\n');
