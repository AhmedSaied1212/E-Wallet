const createLimiter = require("../../utils/createLimiter");

const registerLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  error: "Too many registration attempts. Please try again later.",
});

const loginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  error: "Too many login attempts. Please try again later.",
});

const profileLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 120,
  error: "Too many profile requests. Please try again later.",
});

const logoutLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  error: "Too many logout attempts. Please try again later.",
});

const passwordLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  error: "Too many password change attempts. Please try again later.",
});

const verifyEmailLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  error: "Too many email verification attempts. Please try again later.",
});

const updateProfileLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 20,
  error: "Too many profile update attempts. Please try again later.",
});

const forgotPasswordLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  error: "Too many password reset requests. Please try again later.",
});

const resendForgotPasswordLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 3,
  error: "Too many password reset resend attempts. Please try again later.",
});

const resetPasswordLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  error: "Too many password reset attempts. Please try again later.",
});

const resendVerificationLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 3,
  error: "Too many verification email resend attempts. Please try again later.",
});

const uploadPhotoLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  error: "Too many profile photo uploads. Please try again later.",
});

module.exports = {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
  verifyEmailLimiter,
  resendVerificationLimiter,
  resetPasswordLimiter,
  uploadPhotoLimiter,
  profileLimiter,
  logoutLimiter,
  passwordLimiter,
  updateProfileLimiter,
  resendForgotPasswordLimiter,
};