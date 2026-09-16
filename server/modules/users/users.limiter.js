const createLimiter = require("../../utils/createLimiter");

const searchUsersLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
    error: "Too many user search requests. Please try again later.",
});

module.exports = {
    searchUsersLimiter,
};
