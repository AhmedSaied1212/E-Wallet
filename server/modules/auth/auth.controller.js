const appHandler = require("../../utils/appHandler");
const AppError = require("../../utils/appError");
const authService = require("./auth.service");

const getAuthenticatedUserId = (req) => {
  if (!req.user?.id) throw new AppError("Authentication required", 401);
  return req.user.id;
};

const register = appHandler( async (req, res) => {
  const { name, email, password, username } = req.body;

  const data = await authService.register({ name, email, password, username });

  res.status(201).json({
    success: true,
    message: "Registration successful. Please verify your email.",
    data 
 });
});

const verifyEmail = appHandler(async (req, res) => {
  const result = await authService.verifyEmail(req.query.token);

  res.status(200).json(
    result.alreadyVerified
    ? {
        success: true,
        alreadyVerified: true,
        message: "Your email is already verified. You can log in." 
    }
    : {
        success: true,
        message: "You have verified your account successfully." 
    });
});

const login = appHandler(async (req, res) => {
  const { email, password } = req.body;
  const { token, user } = await authService.login({ email, password });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie(
    "token",
    token, 
    { 
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction, maxAge: 7 * 24 * 60 * 60 * 1000
    });

  res.status(200).json({
    success: true,
    message: "you have logged in successfully",
    user 
  });
});

const resendVerification = appHandler(async (req, res) => {
  const { email } = req.body;

  await authService.resendVerification(email);

  res.status(201).json({
    success: true,
    message: "We have resend email verificarion successfully. Please verify your email." 
 });
});

const profile = appHandler(async (req, res) => {
  const data = await authService.getProfile(getAuthenticatedUserId(req));

  res.status(200).json({
    success: true,
    message: "user fetched successfully",
    data });
});

const editMyProfile = appHandler(async (req, res) => {
  const { name, username } = req.body;

  const data = await authService.updateProfile(getAuthenticatedUserId(req), {
    name,
    username 
 });
  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    data 
 });
});

const logout = appHandler(async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie(
    "token", {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction 
 });
  res.status(200).json({
    success: true,
    message: "logout successfull" 
 });
});

const changePassword = appHandler(async (req, res) => {
  const { password, newPassword } = req.body;

  await authService.changePassword(getAuthenticatedUserId(req), password, newPassword);

  res.status(200).json({
    success: true,
    message: "password changed successfully" 
 });
});

const forgotPassword = appHandler(async (req, res) => {
  const { email } = req.body;

  await authService.requestPasswordReset(email);

  res.status(200).json({ 
    success: true,
    message: "We have sent reset password link to your email, go check your inbox." 
 });
});

const resendForgetPassword = appHandler(async (req, res) => {
  const { email } = req.body;

  await authService.requestPasswordReset(email, true);

  res.status(201).json({
    success: true,
    message: "We have resend reset password link successfully. Please check your email." 
 });
});

const resetPassword = appHandler(async (req, res) => {
  const { newPassword } = req.body;

  await authService.resetPassword(req.query.token, newPassword);

  res.status(200).json({
    success: true,
    message: "You have reset your password successfully." 
 });
});

const uploadProfilePhoto = appHandler(async (req, res) => {
  const imageUrl = await authService.uploadProfilePhoto(getAuthenticatedUserId(req), req.file);

  res.status(200).json({ success: true, message: "Profile photo updated succeessfully.", image_url: imageUrl });
});

module.exports = {
  register, verifyEmail, login, resendVerification, profile, editMyProfile,
  logout, changePassword, forgotPassword, resendForgetPassword, resetPassword,
  uploadProfilePhoto,
};