const crypto = require('crypto');
const QRCode = require('qrcode');

/**
 * Generates a secure, unique token for QR code identification.
 * @param {string} prefix - Optional prefix for the token (e.g., 'TRASH-', 'HH-')
 * @returns {string} A secure random token string.
 */
const generateSecureToken = (prefix = '') => {
  const randomBytes = crypto.randomBytes(24).toString('hex');
  const timestamp = Date.now().toString(36);
  return `${prefix}${timestamp}-${randomBytes}`;
};

/**
 * Generates a QR Code as a Data URL (Base64 PNG image).
 * @param {string} text - The content/token to encode in the QR code.
 * @param {object} options - Optional QRCode options (e.g. errorCorrectionLevel, margin, color)
 * @returns {Promise<string>} A promise that resolves to the Data URL string.
 */
const generateQrDataUrl = async (text, options = {}) => {
  const defaultOptions = {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 300,
    color: {
      dark: '#1e293b',  // Slate 800
      light: '#ffffff'  // White background
    }
  };

  const qrOptions = { ...defaultOptions, ...options };
  
  try {
    return await QRCode.toDataURL(text, qrOptions);
  } catch (error) {
    console.error('Error generating QR code Data URL:', error);
    throw new Error('Failed to generate QR code image');
  }
};

/**
 * Combines token and QR code generation in a single call.
 * @param {string} prefix - Optional prefix for the token.
 * @returns {Promise<{token: string, qrCodeDataUrl: string}>} Object containing the token and its QR Data URI.
 */
const generateQrToken = async (prefix = '') => {
  const token = generateSecureToken(prefix);
  const qrCodeDataUrl = await generateQrDataUrl(token);
  return {
    token,
    qrCodeDataUrl
  };
};

module.exports = {
  generateSecureToken,
  generateQrDataUrl,
  generateQrToken
};
