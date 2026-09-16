const AppError = require("../../utils/appError");

const checkCursor = (cursor) => {
    if (!cursor) return;

    if (typeof cursor !== "string" || cursor.trim() === "") {
        throw new AppError("Cursor must be a non-empty string.", 400);
    }

};

const checkLimit = (limit = 10) => {
    const parsed = Number(limit);

    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 50) {
        throw new AppError("Limit must be an integer between 1 and 50.", 400);
    }

    return parsed;
};

module.exports = {
    checkCursor,
    checkLimit,
};
