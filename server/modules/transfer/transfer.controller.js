const appHandler = require("../../utils/appHandler");
const service = require("./transfer.service");

const transfer = appHandler(async (req, res) => {
    const { senderWallet, receiverWallet, amount } = req.body;
    const idempotencyKey = req.headers["idempotency-key"];

    const result = await service.transfer({
        userId: req.user.id,
        senderWallet,
        receiverWallet,
        amount,
        idempotencyKey,
    });

    if (result && result.statusCode) return res.status(result.statusCode).json(result.body);

    return res.status(201).json({
        success: true,
        message: "Operation completed successfully.",
        data: result,
    });
});

const getTransfers = appHandler(async (req, res) => {
    const { cursor, limit = 10, status = "all", search = "", filters = {} } = req.query;
    const data = await service.getTransfers({
        userId: req.user.id,
        walletId: req.params.walletId,
        status,
        cursor,
        limit,
        search,
        filters,
    });

    return res.status(200).json({
        success: true,
        message: "Transfers fetched successfully.",
        data: data.transfers,
        pagination: data.pagination,
    });
});

const getTransfer = appHandler(async (req, res) => {
    const transferData = await service.getTransfer({
        userId: req.user.id,
        walletId: req.params.walletId,
        transferId: req.params.transferId,
    });

    return res.status(200).json({
        success: true,
        message: "Transfer fetched successfully.",
        data: transferData,
    });
});

module.exports = {
    transfer,
    getTransfers,
    getTransfer,
};