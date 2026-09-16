const express = require("express");
const protect = require("../../middlewares/auth");
const controller = require("./transaction.controller");
const limiters = require("./transaction.limiter");
const { idempotencyLimiter } = require("../idempotency/idempotency.limiter");

const route = express.Router();

route.post("/wallets/:walletId/deposit", protect, idempotencyLimiter, limiters.depositLimiter, controller.deposit);
route.post("/wallets/:walletId/withdraw", protect, idempotencyLimiter, limiters.withdrawLimiter, controller.withdraw);
route.get("/wallets/:walletId/transactions", protect, limiters.getTransactionsLimiter, controller.getWalletTransactions);
route.get("/transactions/me", protect, limiters.getTransactionsLimiter, controller.getMyTransactions);
route.get("/wallets/:walletId/transactions/:transactionId", protect, limiters.getTransactionLimiter, controller.getTransaction);
module.exports = route;