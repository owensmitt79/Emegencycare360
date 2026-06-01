import crypto from 'crypto';

const secret = process.env.PATIENT_DATA_KEY || 'emergencycare360_default_phi_encryption_key_2026';
const key = crypto.scryptSync(secret, 'emergencycare_salt', 32);

const ALGORITHM = 'aes-256-gcm';

export const encrypt = (text) => {
  if (!text) return text;
  
  try {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    return text;
  }
};

export const decrypt = (encryptedText) => {
  if (!encryptedText) return encryptedText;
  
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
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
    return encryptedText;
  }
};
