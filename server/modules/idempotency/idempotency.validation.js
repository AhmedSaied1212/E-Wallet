const AppError = require("../../utils/appError");

const validateIdempotencyKey = (idKey) => {
    if (!idKey) {
        throw new AppError("Idempotency-Key header is required", 400);
    }

    if (typeof idKey !== "string") {
        throw new AppError("Idempotency-Key must be a string", 400);
    }

    const trimmedKey = idKey.trim();

    if (!trimmedKey) {
        throw new AppError("Idempotency-Key cannot be empty", 400);
    }

    if (trimmedKey.length > 255) {
        throw new AppError("Idempotency-Key must not exceed 255 characters", 400);
    }

    return trimmedKey;
};

module.exports = {
    validateIdempotencyKey,
};
