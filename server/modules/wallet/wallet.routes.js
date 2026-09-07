const express = require("express");
const protect = require("../../middlewares/auth");
const controller = require("./wallet.controller");
const limiters = require("./wallet.limiter");

const route = express.Router();

route.post("/", protect, limiters.createWalletLimiter, controller.createWallet);
route.get("/me", protect, limiters.getMyWalletsLimiter, controller.getMywallets);
route.get("/:id", protect, limiters.getWalletByIdLimiter, controller.getWalletById);
route.patch("/:id/name", protect, limiters.updateWalletNameLimiter, controller.updateWalletName);
route.patch("/:id/status", protect, limiters.updateWalletStatusLimiter, controller.updateWalletStatus);

module.exports = route;