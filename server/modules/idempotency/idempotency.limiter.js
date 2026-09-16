const rateLimit = require("express-rate-limit");

const idempotencyLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 30,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many financial requests. Please try again later.",
    },
});

module.exports = {
    idempotencyLimiter,
};
