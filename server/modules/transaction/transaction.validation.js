const AppError = require("../../utils/appError")

const requireFields = (values, message) => {
    if (values.some((value) => !value)) {
        return message;
    }
};

const checkAmount = (amount) => {
    if (!amount || amount < 0 || amount === 0 || typeof amount === 'string') {
        throw new AppError("Invalid amount.", 400)
    };
};

const checkType = (type) => {
    const types = ["all", "DEPOSIT", "WITHDRAW", "TRANSFER_OUT", "TRANSFER_IN"];

    if (!types.includes(type)) {
        throw new AppError("Invalid transaction type", 400)
    };
};

const checkStatus = (status) => {
    const statuses = ["all", "SUCCEEDED", "FAILED"];

    if (!statuses.includes(status)) {
        throw new AppError("Invalid status", 400)
    };
};

const checkSearch = (search) => {
    if (search !== undefined && typeof search !== "string") {
        throw new AppError("Invalid search query.", 400);
    }
};

const checkLimit = (limit) => {
    const parsed = Number(limit);

    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 50) {
        throw new AppError("Limit must be between 1 and 50.", 400);
    }

    return parsed;
};

const checkCursor = (cursor) => {
    if (cursor && typeof cursor !== "string") {
        throw new AppError("Invalid cursor.", 400);
    }
};

module.exports = {
    requireFields,
    checkAmount,
    checkType,
    checkStatus,
    checkSearch,
    checkLimit,
    checkCursor,
}