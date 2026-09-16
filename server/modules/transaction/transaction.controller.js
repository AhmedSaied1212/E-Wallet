const appHandler = require("../../utils/appHandler");
const service = require("./transaction.service");

const writeResponse = (res, result) => {
    if (result && result.statusCode) {
        return res.status(result.statusCode).json(result.body);
    }

    return res.status(201).json({
        success: true,
        message: "Operation completed successfully.",
        data: result,
    });
};

const deposit = appHandler(async (req, res) => {
    const userId = req.user.id;
    const { walletId } = req.params;
    const { amount } = req.body;
    const idempotencyKey = req.headers["idempotency-key"];

    const result = await service.deposit({
        userId,
        walletId,
        amount,
        idempotencyKey,
    });

    return writeResponse(res, result);
});

const withdraw = appHandler(async (req, res) => {
    const userId = req.user.id;
    const { walletId } = req.params;
    const { amount } = req.body;
    const idempotencyKey = req.headers["idempotency-key"];

    const result = await service.withdraw({
        userId,
        walletId,
        amount,
        idempotencyKey,
    });

    return writeResponse(res, result);
});

const getWalletTransactions = appHandler(async (req, res) => {
    const { cursor, limit = 10, type = "all", status = "all", search = "", filters = {} } = req.query;
    const { walletId } = req.params;
    const userId = req.user.id;

    const data = await service.getWalletTransactions({
        userId,
        walletId,
        type,
        status,
        cursor,
        limit,
        search,
        filters,
    });

    return res.status(200).json({
        success: true,
        message: "Transactions fetched successfully.",
        data: data.transactions,
        pagination: data.pagination,
    });
});

const getMyTransactions = appHandler(async (req, res) => {
    const { cursor, limit = 10, type = "all", status = "all", search = ""} = req.query;
    const userId = req.user.id;

    const data = await service.getMyTransactions({
        userId,
        type,
        status,
        cursor,
        limit,
        search,
    });

    return res.status(200).json({
        success: true,
        message: "Transactions fetched successfully.",
        data: data.transactions,
        pagination: data.pagination,
    });
});

const getTransaction = appHandler(async (req, res) => {
    const { walletId, transactionId } = req.params;
    const userId = req.user.id;

    const transaction = await service.getTransaction({
        userId,
        walletId,
        transactionId,
    });

    return res.status(200).json({
        success: true,
        message: "Transaction fetched successfully.",
        data: transaction,
    });
});

module.exports = {
    deposit,
    withdraw,
    getWalletTransactions,
    getMyTransactions,
    getTransaction,
};