const express = require("express");
const protect = require("../../middlewares/auth");
const controller = require("./wallet.controller");
const limiters = require("./wallet.limiter");

const route = express.Router();

route.post("/wallets", protect, limiters.createWalletLimiter, controller.createWallet);
route.get("/users/:userId/wallets", protect, limiters.getUserwalletsLimiter, controller.getUserwallets);
route.get("/wallets/me", protect, limiters.getMyWalletsLimiter, controller.getMywallets);
route.get("/wallets/:id", protect, limiters.getWalletByIdLimiter, controller.getWalletById);
route.patch("wallets/:id/name", protect, limiters.updateWalletNameLimiter, controller.updateWalletName);
route.patch("wallets/:id/status", protect, limiters.updateWalletStatusLimiter, controller.updateWalletStatus);

module.exports = route;