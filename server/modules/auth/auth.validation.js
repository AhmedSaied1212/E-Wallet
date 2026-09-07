const { validateEmail } = require("./vlaidators/emailValidation");
const { validatePassword } = require("./vlaidators/passwordValidation");
const { validateUsername } = require("./vlaidators/usernameValidation");

const requireFields = (values, message) => {
  if (values.some((value) => !value)) {
    return message;
  }
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
  requireFields,
};