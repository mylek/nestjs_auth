import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';

function getKey(key: string): Buffer {
    // Hashuje dowolny klucz do 32 bajtów (AES-256)
    return crypto.createHash('sha256').update(key).digest();
}

export function encrypt(text: string, key: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(key), iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return iv.toString('base64') + ':' + encrypted;
}

export function decrypt(encrypted: string, key: string): string {
    const [ivBase64, encryptedText] = encrypted.split(':');
    const iv = Buffer.from(ivBase64, 'base64');
    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(key), iv);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}