const express = require("express");
const protect = require("../../middlewares/auth");
const controller = require("./transfer.controller");
const limiters = require("./transfer.limiter");
const { idempotencyLimiter } = require("../idempotency/idempotency.limiter");

const route = express.Router();

route.post("/transfers", protect, idempotencyLimiter, limiters.transferLimiter, controller.transfer);
route.get("/wallets/:walletId/transfers", protect, limiters.getTransfersLimiter, controller.getTransfers);
route.get("/wallets/:walletId/transfers/:transferId", protect, limiters.getTransferLimiter, controller.getTransfer);

module.exports = route;