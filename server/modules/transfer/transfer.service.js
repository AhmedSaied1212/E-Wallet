const AppError = require("../../utils/appError");
const { encodeCursor, decodeCursor } = require("../../utils/cursor");
const { fetchWalletById } = require("../wallet/wallet.repository");
const repository = require("./transfer.repository");
const validation = require("./transfer.validation");
const idempotencyService = require("../idempotency/idempotency.service");
const { validateIdempotencyKey } = require("../idempotency/idempotency.validation");

const transfer = async ({ userId, senderWallet, receiverWallet, amount, idempotencyKey }) => {
    const required = validation.requireFields(
        [userId, senderWallet, receiverWallet],
        "User id, Sender wallet id and Receiver wallet id are required",
    );

    if (required) throw new AppError(required, 400);

    validation.checkAmount(amount);
    const normalizedKey = validateIdempotencyKey(idempotencyKey);

    return repository.runTransaction(async (client) => {
        const idempotencyResult = await idempotencyService.checkIdempotency({
            client,
            idKey: normalizedKey,
            userId,
            body: { senderWallet, receiverWallet, amount },
        });

        if (!idempotencyResult.isNew) {
            const existing = idempotencyResult.data;

            if (existing.status === "COMPLETED" || existing.status === "FAILED") {
                return {
                    statusCode: existing.response_code,
                    body: existing.response_body,
                };
            }

            if (existing.status === "PENDING") {
                throw new AppError("This request is already being processed", 409);
            }
        }

        const wallets = await repository.getWalletsForTransferLock({
            senderWallet,
            receiverWallet,
            client,
        });

        const sender = wallets.find((wallet) => wallet.id === senderWallet);
        const receiver = wallets.find((wallet) => wallet.id === receiverWallet);

        if (!sender || !receiver) {
            const body = { success: false, message: "One or more wallets were not found" };
            await idempotencyService.failIdempotency({ client, idKey: normalizedKey, userId, responseCode: 404, responseBody: body });
            return { statusCode: 404, body };
        }

        if (sender.user_id !== userId) {
            const body = { success: false, message: "You can't transfer money from a wallet that is not belonging to you." };
            await idempotencyService.failIdempotency({ client, idKey: normalizedKey, userId, responseCode: 403, responseBody: body });
            return { statusCode: 403, body };
        }

        if (sender.status === "CLOSED" || receiver.status === "CLOSED") {
            const body = { success: false, message: "One or more wallets are closed." };
            await idempotencyService.failIdempotency({ client, idKey: normalizedKey, userId, responseCode: 400, responseBody: body });
            return { statusCode: 400, body };
        }

        if (Number(sender.balance) < Number(amount)) {
            const body = { success: false, message: "Insufficient balance." };
            await idempotencyService.failIdempotency({ client, idKey: normalizedKey, userId, responseCode: 400, responseBody: body });
            return { statusCode: 400, body };
        }

        const transferData = await repository.transfer({ senderWallet, receiverWallet, amount, client });
        const responseBody = {
            success: true,
            message: "Money transferd successfully.",
            data: transferData,
        };

        await idempotencyService.completeIdempotency({
            client,
            idKey: normalizedKey,
            userId,
            responseCode: 201,
            responseBody,
        });

        return { statusCode: 201, body: responseBody };
    });
};

const getTransfers = async ({ userId, walletId, status = "all", cursor, limit = 10, search = "", filters = {} }) => {
    const required = validation.requireFields(
        [userId, walletId],
        "Wallet id, status and user id are required",
    );

    if (required) throw new AppError(required, 400);

    validation.checkSearch(search);
    validation.checkStatus(status);
    validation.checkCursor(cursor);
    const decodedCursor = decodeCursor(cursor, "transfers");
    const parsedLimit = validation.checkLimit(limit);
    const wallet = await fetchWalletById(walletId);

    if (!wallet) throw new AppError("Wallet not found.", 404);
    if (wallet.user_id !== userId) throw new AppError("This wallet is not belonging to you", 403);

    const transfers = await repository.getTransfers({
        walletId,
        status,
        cursor: decodedCursor,
        limit: parsedLimit,
        search,
        filters,
    });

    const hasMore = transfers.length > parsedLimit;
    if (hasMore) transfers.pop();

    const lastTransfer = transfers[transfers.length - 1];
    const nextCursor = hasMore && lastTransfer
        ? encodeCursor("transfers", {
            createdAt: new Date(lastTransfer.created_at).toISOString(),
            id: lastTransfer.id,
        })
        : null;

    return {
        transfers,
        pagination: { limit: parsedLimit, nextCursor, hasMore },
    };
};

const getTransfer = async ({ userId, walletId, transferId }) => {
    const required = validation.requireFields(
        [userId, walletId, transferId],
        "Wallet id, transfer id and user id are required",
    );

    if (required) throw new AppError(required, 400);

    const wallet = await fetchWalletById(walletId);
    if (!wallet) throw new AppError("Wallet not found.", 404);
    if (wallet.user_id !== userId) throw new AppError("This wallet is not belonging to you", 403);

    const transferData = await repository.getTransferById({ walletId, transferId });
    if (!transferData) throw new AppError("Transfer not found.", 404);

    return transferData;
};

module.exports = {
    transfer,
    getTransfers,
    getTransfer,
};