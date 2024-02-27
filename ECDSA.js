const { ec } = require('elliptic');

// Create an elliptic curve object using the secp256k1 curve (used in Bitcoin)
const ecCurve = new ec('secp256k1');

// Generate a key pair
const keyPair = ecCurve.genKeyPair();

// Get the private and public keys
const privateKey = keyPair.getPrivate('hex');
const publicKey = keyPair.getPublic('hex');

// Message to be signed
const message = 'Hello, World!';

// Sign the message using the private key
const signature = keyPair.sign(message);

// Verify the signature using the public key
const isValidSignature = keyPair.verify(message, signature);

console.log('Private Key:', privateKey);
console.log('Public Key:', publicKey);
console.log('Message:', message);
console.log('Signature:', signature);
console.log('Is Valid Signature:', isValidSignature);
