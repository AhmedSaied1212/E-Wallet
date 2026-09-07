const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const AppError = require("../../utils/appError");
const uploadPhoto = require("../../utils/uploadPhoto");
const verifyEmailTemplate = require("../../utils/emailTemplates/verifyEmailTemplate");
const resetPasswordTemplate = require("../../utils/emailTemplates/resetPasswordTemplate");
const repository = require("./auth.repository");
const validation = require("./auth.validation");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: true,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
});

const sendVerificationEmail = async (email, token, logName) => {
  const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-email?token=${token}`;
  try {
    await transporter.sendMail({
      from: `Social Network <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your Social Network account",
      text: `Welcome to Social Network! Verify your email by opening this link: ${verifyUrl}`,
      html: verifyEmailTemplate(verifyUrl),
    });
  } catch (error) {
    console.error(`[${logName}] Failed to send email:`, error.message);
  }
};

const sendResetEmail = async (email, token, logName) => {
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${token}`;
  try {
    await transporter.sendMail({
      from: `Social Network <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your password Social Network account",
      text: `Reset your password by visiting: ${resetUrl}`,
      html: resetPasswordTemplate(resetUrl),
    });
  } catch (error) {
    console.error(`[${logName}] Failed to send email:`, error.message);
  }
};

const tokenFor = (payload, expiresIn) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

const register = async ({ name, email, password, username }) => {

  const required = validation.requireFields(
    [name, email, password, username],
    "Name, email, password and username are required",
  );
  
  if (required) throw new AppError(required, 400);

  const usernameError = validation.validateUsername(username);
  if (usernameError) throw new AppError(usernameError.error, 400);

  const emailError = validation.validateEmail(email);
  if (emailError) throw new AppError(emailError.error, 400);

  const passwordError = validation.validatePassword(password);
  if (passwordError) throw new AppError(passwordError.error, 400);

  if (await repository.getUserByEmail(email)) {
    throw new AppError("Email may be in use, try another one !", 409);
  }
  if (await repository.getUserByUsername(username)) {
    throw new AppError("Username in use, try another one !", 409);
  }

  const user = await repository.createUser({
    name,
    email,
    username,
    password: await bcrypt.hash(password, 10),
  });

  const token = tokenFor({ id: user.id, purpose: "verify-email" }, "15m");

  await repository.updateVerificationToken({
    id: user.id,
    token,
    lastVerify: new Date(),
    isVerified: false,
  });

  await sendVerificationEmail(email, token, "Register");

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    isVerified: false,
  };
};

const verifyEmail = async (token) => {
  if (!token) throw new AppError("No token provided.", 400);

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError("This verification link has expired or is invalid. Please request a new one.", 400);
  }

  const user = await repository.getUserById(decoded.id);

  if (!user) throw new AppError("User not found", 404);

  if (user.is_verified) return { alreadyVerified: true };

  if (!user.verification_token || user.verification_token !== token) {
    throw new AppError("This verification link has expired or is invalid. Please request a new one.", 400);
  }
  await repository.updateVerificationToken({ id: user.id, token: null, isVerified: true });

  return { alreadyVerified: false };
};

const login = async ({ email, password }) => {
  const required = validation.requireFields([email, password], "Email and password are required");
  if (required) throw new AppError(required, 400);

  const emailError = validation.validateEmail(email);

  if (emailError) throw new AppError(emailError.error, 400);

  const user = await repository.getUserByEmail(email);

  if (!user || !user.is_verified || !(await bcrypt.compare(password, user.password))) {
    throw new AppError(user && !user.is_verified ? "Verify your account first." : "Invalid credentials", 401);
  }

  return {
    token: tokenFor({ id: user.id, email: user.email }, "7d"),

    user: {
        id: user.id,
        name: user.name,
        email: user.email, username: user.username,
        avatar: user.avatar_url,
        isVerified: user.is_verified,
    },
  };
};

const resendVerification = async (email) => {
  if (!email) throw new AppError("Email are required", 400);

  const emailError = validation.validateEmail(email);

  if (emailError) throw new AppError(emailError.error, 400);

  const user = await repository.getUserByEmail(email);

  if (!user) throw new AppError("User not found.", 401);

  if (user.is_verified) throw new AppError("You have already verified you account.", 400);

  if (user.last_verification_email_sent_at && Date.now() - user.last_verification_email_sent_at < 60000) {
    throw new AppError("Please wait 1 minuate and try again", 400);
  }
  const token = tokenFor({ id: user.id, purpose: "verify-email" }, "15m");

  await repository.updateVerificationToken({ 
    id: user.id,
    token,
    isVerified: false,
    lastVerify: new Date()
 });

  await sendVerificationEmail(email, token, "ResendVerification");
};

const getProfile = async (id) => {
  const user = await repository.getUserById(id);

  if (!user) throw new AppError("User not found", 404);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    avatar: user.avatar_url,
  };
};

const updateProfile = async (id, { name, username }) => {
  if (!name || !username) throw new AppError("Name and username are required.", 400);

  return repository.updateProfile({
    id,
    name,
    username,
  });
};

const changePassword = async (id, password, newPassword) => {
  if (!password || !newPassword) throw new AppError("All fields are required", 400);

  const passwordError = validation.validatePassword(newPassword);

  if (passwordError) throw new AppError(passwordError.error, 400);

  const user = await repository.getUserById(id);

  if (!user) throw new AppError("User not found", 404);

  if (!(await bcrypt.compare(password, user.password))) throw new AppError("Invalid credentials", 401);

  if (await bcrypt.compare(newPassword, user.password)) throw new AppError("New password must be different from the current password.", 400);

  await repository.updatePassword(await bcrypt.hash(newPassword, 10), id);
};

const requestPasswordReset = async (email, resend = false) => {
  if (!email) throw new AppError("Email are required", 400);

  const emailError = validation.validateEmail(email);

  if (emailError) throw new AppError(emailError.error, 400);

  const user = await repository.getUserByEmail(email);

  if (!user) throw new AppError("User not found.", resend ? 401 : 404);

  if (resend && user.last_forgot_password_sent_at && Date.now() - user.last_forgot_password_sent_at < 60000) {
    throw new AppError("Please wait 1 minuate and try again", 400);
  }
  const token = tokenFor({ id: user.id, purpose: "reset-password" }, resend ? "15m" : "10m");

  await repository.updateResetToken({ id: user.id, token, lastReset: new Date() });

  await sendResetEmail(email, token, resend ? "ResendResetPassword" : "ForgotPassword");
};

const resetPassword = async (token, newPassword) => {
  if (!token) throw new AppError("No token provided.", 400);

  if (!newPassword) throw new AppError("New Password are required.", 400);

  const passwordError = validation.validatePassword(newPassword);

  if (passwordError) throw new AppError(passwordError.error, 400);

  let decoded;

  try { 
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
     throw new AppError("Invalid token", 400);
    }
  const user = await repository.getUserById(decoded.id);

  if (!user) throw new AppError("User not found", 404);

  if (!user.reset_password_token || user.reset_password_token !== token) throw new AppError("This verification link has already been used or is expired.", 400);

  if (await bcrypt.compare(newPassword, user.password)) throw new AppError("New password must be different from the current password.", 400);

  await repository.updateResetToken({ token: null, lastReset: null, id: user.id });

  await repository.updatePassword(await bcrypt.hash(newPassword, 10), user.id);
};

const uploadProfilePhoto = async (id, file) => {
  if (!file) throw new AppError("No file uploaded.", 400);

  if (!(await repository.getUserById(id))) throw new AppError("User not found.", 404);

  const imageUrl = await uploadPhoto(file, "avatars", [{ width: 400, height: 400, crop: "fill", gravity: "face" }]);

  await repository.updateAvatarUrl(imageUrl, id);

  return imageUrl;
};


module.exports = {
  register, verifyEmail, login, resendVerification, getProfile, updateProfile,
  changePassword, requestPasswordReset, resetPassword, uploadProfilePhoto,
};