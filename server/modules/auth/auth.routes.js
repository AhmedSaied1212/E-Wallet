const express = require("express");
const protect = require("../../middlewares/auth");
const upload = require("../../config/upload");
const controller = require("./auth.controller");
const limiters = require("./auth.limiter");

const route = express.Router();

route.post("/register", limiters.registerLimiter, controller.register);
route.post("/login", limiters.loginLimiter, controller.login);
route.get("/me", limiters.profileLimiter, protect, controller.profile);
route.post("/logout", limiters.logoutLimiter, protect, controller.logout);
route.patch("/password", limiters.passwordLimiter, protect, controller.changePassword);
route.get("/verify-email", limiters.verifyEmailLimiter, controller.verifyEmail);
route.post("/forgot-password", limiters.forgotPasswordLimiter, controller.forgotPassword);
route.patch("/reset-password", limiters.resetPasswordLimiter, controller.resetPassword);
route.post("/resend-verification", limiters.resendVerificationLimiter, controller.resendVerification);
route.post("/resend-forgot", limiters.resendForgotPasswordLimiter, controller.resendForgetPassword);
route.post("/upload-avatar", limiters.uploadPhotoLimiter, protect, upload.single("image"), controller.uploadProfilePhoto);
route.put("/profile", limiters.updateProfileLimiter, protect, controller.editMyProfile);

module.exports = route;