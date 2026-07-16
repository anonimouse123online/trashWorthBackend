const crypto = require('crypto');

/**
 * Generates a cryptographically secure random password.
 * @param {number} length - Length of the password to generate (minimum 8, default 12)
 * @returns {string} The generated password containing letters, numbers, and special characters.
 */
const generatePassword = (length = 12) => {
  const pwdLength = Math.max(8, length);
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
  const allChars = uppercase + lowercase + numbers + specialChars;

  let password = '';
  // Ensure we get at least one of each category first to guarantee complexity
  password += uppercase[crypto.randomInt(uppercase.length)];
  password += lowercase[crypto.randomInt(lowercase.length)];
  password += numbers[crypto.randomInt(numbers.length)];
  password += specialChars[crypto.randomInt(specialChars.length)];

  // Fill the remaining length with random characters from the set
  for (let i = password.length; i < pwdLength; i++) {
    password += allChars[crypto.randomInt(allChars.length)];
  }

  // Shuffle the password characters to avoid predictable patterns
  return password
    .split('')
    .sort(() => crypto.randomBytes(1)[0] - 128)
    .join('');
};

module.exports = generatePassword;
