const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[A-Za-z\d!@#$%^&*]{8,}$/;

module.exports = {
  emailRegex,
  passwordRegex,
};
