import crypto from 'crypto';

// Enforce a 32-byte key by deriving it from environment variable or fallback
const secret = process.env.PATIENT_DATA_KEY || 'emergencycare360_default_phi_encryption_key_2026';
const key = crypto.scryptSync(secret, 'emergencycare_salt', 32);

const ALGORITHM = 'aes-256-gcm';

/**
 * Encrypt plain text using AES-256-GCM
 * @param {string} text - Plain text to encrypt
 * @returns {string} - Encrypted string in format iv:authTag:ciphertext
 */
export const encrypt = (text) => {
  if (!text) return text;
  
  try {
    const iv = crypto.randomBytes(12); // GCM standard IV size is 12 bytes
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    // Return formatted string
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    return text; // Fallback to plain text in case of error (or rethrow, but fallback prevents crashes)
  }
};

/**
 * Decrypt cipher text using AES-256-GCM
 * @param {string} encryptedText - Encrypted string in format iv:authTag:ciphertext
 * @returns {string} - Decrypted plain text
 */
export const decrypt = (encryptedText) => {
  if (!encryptedText) return encryptedText;
  
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      // Not in encrypted format, return as-is (e.g. legacy plain text data)
      return encryptedText;
    }
    
    const [ivHex, authTagHex, ciphertextHex] = parts;
    
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(ciphertextHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error (might be plain text or corrupt key):', error.message);
    return encryptedText; // Return original value if decryption fails (e.g. if field is already plain text)
  }
};
