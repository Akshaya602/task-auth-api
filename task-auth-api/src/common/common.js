const bcrypt = require('bcryptjs');
const { emailRegex, passwordRegex } = require('./validation');

//function to validate email format
function validateEmail(email) {
  return emailRegex.test(email);
}

//function to validate password format
function validatePassword(password) {
  return passwordRegex.test(password);
}

//function to hash a password
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

//function to compare passwords
async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

module.exports = {
  validateEmail,
  validatePassword,
  hashPassword,
  comparePassword,
};
