/**
 * Generates a unique token string by combining a random sequence and the current timestamp.
 * 
 * @returns {string} A unique token.
 */

export function generateToken() {
  return Math.random().toString(36).substring(2, 15) + (new Date()).getTime().toString(36);
}
