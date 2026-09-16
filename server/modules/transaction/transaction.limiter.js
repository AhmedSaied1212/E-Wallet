const createLimiter = require("../../utils/createLimiter");

const depositLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 50,
  error: "Too many deposit attempts. Please try again later.",
});

const withdrawLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 50,
  error: "Too many withdrawal attempts. Please try again later.",
});

const getTransactionsLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 120,
  error: "Too many transaction list requests. Please try again later.",
});

const getTransactionLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 120,
  error: "Too many transaction detail requests. Please try again later.",
});

module.exports = {
  depositLimiter,
  withdrawLimiter,
  getTransactionsLimiter,
  getTransactionLimiter,
};
