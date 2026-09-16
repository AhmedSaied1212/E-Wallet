const AppError = require("../../utils/appError");
const { encodeCursor, decodeCursor } = require("../../utils/cursor");
const { fetchWalletById } = require("../wallet/wallet.repository");
const repository = require("./transaction.repository");
const validation = require("./transaction.validation");
const idempotencyService = require("../idempotency/idempotency.service");
const { validateIdempotencyKey } = require("../idempotency/idempotency.validation");

const deposit = async ({ userId, walletId, amount, idempotencyKey }) => {
    const required = validation.requireFields(
        [userId, walletId],
        "Wallet id and user id are required",
    );

    if (required) throw new AppError(required, 400);

    validation.checkAmount(amount);
    const normalizedKey = validateIdempotencyKey(idempotencyKey);

    return repository.runTransaction(async (client) => {
        const idempotencyResult = await idempotencyService.checkIdempotency({
            client,
            idKey: normalizedKey,
            userId,
            body: { walletId, amount },
        });

        if (!idempotencyResult.isNew) {
            const existing = idempotencyResult.data;

            if (existing.status === "COMPLETED") {
                return {
                    statusCode: existing.response_code,
                    body: existing.response_body,
                };
            }

            if (existing.status === "FAILED") {
                return {
                    statusCode: existing.response_code,
                    body: existing.response_body,
                };
            }

            if (existing.status === "PENDING") {
                const error = new AppError("This request is already being processed", 409);
                throw error;
            }
        }

        const wallet = await repository.getWalletForDepositLock({
            walletId,
            client,
        });

        if (wallet.length === 0) {
            const body = { success: false, message: "Wallet not found." };
            await idempotencyService.failIdempotency({ client, idKey: normalizedKey, userId, responseCode: 404, responseBody: body });
            return { statusCode: 404, body };
        }

        if (wallet[0].user_id !== userId) {
            const body = { success: false, message: "You can't deposit a wallet that is not belonging to you." };
            await idempotencyService.failIdempotency({ client, idKey: normalizedKey, userId, responseCode: 403, responseBody: body });
            return { statusCode: 403, body };
        }

        if (wallet[0].status === "CLOSED") {
            const body = { success: false, message: "You can't deposit to a closed wallet." };
            await idempotencyService.failIdempotency({ client, idKey: normalizedKey, userId, responseCode: 400, responseBody: body });
            return { statusCode: 400, body };
        }

        const depositedTransaction = await repository.deposit({
            walletId,
            amount,
            client,
        });

        const responseBody = {
            success: true,
            message: "Wallet deposited successfully.",
            data: depositedTransaction,
        };

        await idempotencyService.completeIdempotency({
            client,
            idKey: normalizedKey,
            userId,
            responseCode: 201,
            responseBody,
        });

        return {
            statusCode: 201,
            body: responseBody,
        };
    });
};

const withdraw = async ({ userId, walletId, amount, idempotencyKey }) => {
    const required = validation.requireFields(
        [userId, walletId],
        "Wallet id and user id are required",
    );

    if (required) throw new AppError(required, 400);

    validation.checkAmount(amount);
    const normalizedKey = validateIdempotencyKey(idempotencyKey);

    return repository.runTransaction(async (client) => {
        const idempotencyResult = await idempotencyService.checkIdempotency({
            client,
            idKey: normalizedKey,
            userId,
            body: { walletId, amount },
        });

        if (!idempotencyResult.isNew) {
            const existing = idempotencyResult.data;

            if (existing.status === "COMPLETED") {
                return {
                    statusCode: existing.response_code,
                    body: existing.response_body,
                };
            }

            if (existing.status === "FAILED") {
                return {
                    statusCode: existing.response_code,
                    body: existing.response_body,
                };
            }

            if (existing.status === "PENDING") {
                const error = new AppError("This request is already being processed", 409);
                throw error;
            }
        }

        const wallet = await repository.getWalletForWithdrawLock({
            walletId,
            client,
        });

        if (wallet.length === 0) {
            const body = { success: false, message: "Wallet not found." };
            await idempotencyService.failIdempotency({ client, idKey: normalizedKey, userId, responseCode: 404, responseBody: body });
            return { statusCode: 404, body };
        }

        if (wallet[0].user_id !== userId) {
            const body = { success: false, message: "You can't withdraw from a wallet that is not belonging to you." };
            await idempotencyService.failIdempotency({ client, idKey: normalizedKey, userId, responseCode: 403, responseBody: body });
            return { statusCode: 403, body };
        }

        if (wallet[0].status === "CLOSED") {
            const body = { success: false, message: "You can't withdraw from a closed wallet." };
            await idempotencyService.failIdempotency({ client, idKey: normalizedKey, userId, responseCode: 400, responseBody: body });
            return { statusCode: 400, body };
        }

        if (wallet[0].balance < amount) {
            const body = { success: false, message: "Insufficient balance." };
            await idempotencyService.failIdempotency({ client, idKey: normalizedKey, userId, responseCode: 400, responseBody: body });
            return { statusCode: 400, body };
        }

        const withdrawTransaction = await repository.withdraw({
            walletId,
            amount,
            client,
        });

        const responseBody = {
            success: true,
            message: "Wallet withdrawal successfully.",
            data: withdrawTransaction,
        };

        await idempotencyService.completeIdempotency({
            client,
            idKey: normalizedKey,
            userId,
            responseCode: 201,
            responseBody,
        });

        return {
            statusCode: 201,
            body: responseBody,
        };
    });
};

const getWalletTransactions = async ({ userId, walletId, type = "all", status = "all", cursor, limit = 10, search = "", filters = {} }) => {
    const required = validation.requireFields(
        [userId, walletId],
        "Wallet id, type, status and user id are required",
    );

    if (required) throw new AppError(required, 400);

    validation.checkSearch(search);
    validation.checkType(type);
    validation.checkStatus(status);
    validation.checkCursor(cursor);
    const decodedCursor = decodeCursor(cursor, "transactions");

    const parsedLimit = validation.checkLimit(limit);

    const wallet = await fetchWalletById(walletId);

    if (!wallet) {
        throw new AppError("Wallet not found.", 404)
    };

    if (wallet.user_id !== userId) {
        throw new AppError("This wallet is not belong to you", 403)
    };

    const transactions = await repository.getWalletTransactions({
        walletId,
        limit: parsedLimit,
        cursor: decodedCursor,
        type,
        status,
        search,
        filters,
    });

    const hasMore = transactions.length > parsedLimit;

    if (hasMore) {
        transactions.pop();
    }

    const lastTransaction = transactions[transactions.length - 1];

    const nextCursor = hasMore && lastTransaction
        ? encodeCursor("transactions", {
            createdAt: new Date(lastTransaction.created_at).toISOString(),
            id: lastTransaction.id,
        })
        : null;

    const pagination = {
        limit: parsedLimit,
        nextCursor,
        hasMore,
    };

    return {
        transactions,
        pagination,
    };
};

const getMyTransactions = async ({ userId, type = "all", status = "all", cursor, limit = 10, search = ""}) => {
    const required = validation.requireFields(
        [userId],
        "User id, type, status and user id are required",
    );

    if (required) throw new AppError(required, 400);

    validation.checkSearch(search);
    validation.checkType(type);
    validation.checkStatus(status);
    validation.checkCursor(cursor);

    const decodedCursor = decodeCursor(cursor, "transactions");

    const parsedLimit = validation.checkLimit(limit);

    const transactions = await repository.getMyTransactions({
        userId,
        limit: parsedLimit,
        cursor: decodedCursor,
        type,
        status,
        search,
    });

    const hasMore = transactions.length > parsedLimit;

    if (hasMore) {
        transactions.pop();
    }

    const lastTransaction = transactions[transactions.length - 1];

    const nextCursor = hasMore && lastTransaction
        ? encodeCursor("transactions", {
            createdAt: new Date(lastTransaction.created_at).toISOString(),
            id: lastTransaction.id,
        })
        : null;

    const pagination = {
        limit: parsedLimit,
        nextCursor,
        hasMore,
    };

    return {
        transactions,
        pagination,
    };
};

const getTransaction = async ({ userId, walletId, transactionId }) => {
    const required = validation.requireFields(
        [userId, walletId, transactionId],
        "Wallet id, transaction id and user id are required",
    );

    if (required) throw new AppError(required, 400);

    const wallet = await fetchWalletById(walletId);

    if (!wallet) {
        throw new AppError("Wallet not found.", 404)
    };

    if (wallet.user_id !== userId) {
        throw new AppError("This wallet is not belonging to you", 403)
    };

    const transaction = await repository.getTransactionById({
        walletId,
        transactionId
    });

    if (!transaction) {
        throw new AppError("Transaction not found.", 404);
    }

    return transaction;
};

module.exports = {
    deposit,
    withdraw,
    getWalletTransactions,
    getMyTransactions,
    getTransaction,
};
