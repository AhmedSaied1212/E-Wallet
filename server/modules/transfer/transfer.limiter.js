const createLimiter = require("../../utils/createLimiter");

const transferLimiter = createLimiter({
    windowMs: 60 * 60 * 1000,
    max: 30,
    error: "Too many transfer attempts. Please try again later.",
});

const getTransfersLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: 120,
    error: "Too many transfer list requests. Please try again later.",
});

const getTransferLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: 120,
    error: "Too many transfer detail requests. Please try again later.",
});

module.exports = {
    transferLimiter,
    getTransfersLimiter,
    getTransferLimiter,
};