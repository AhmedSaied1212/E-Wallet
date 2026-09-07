const { rateLimit } = require("express-rate-limit");

const createLimiter = ({ windowMs, max, error }) => {
    return rateLimit({
        windowMs,
        limit: max,
        standardHeaders: "draft-8",
        legacyHeaders: false,
        handler: (req, res) => {
            res.status(429).json({
                success: false,
                error,
            });
        },
    });
};

module.exports = createLimiter;