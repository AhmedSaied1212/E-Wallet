const AppError = require("../../utils/appError");

const requireFields = (values, message) => {
    if (values.some((value) => !value)) {
        return message;
    }
};

const validateWalletStatus = (status) => {
    const allowedStatuses = ["ACTIVE", "CLOSED"];

    if (!allowedStatuses.includes(status)) {
            throw new AppError("Invalid wallet status.", 400);
    };
};

module.exports = {
    requireFields,
    validateWalletStatus
};