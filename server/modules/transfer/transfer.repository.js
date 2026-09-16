const db = require("../../config/db");
const transactionRepository = require("../transaction/transaction.repository");

const getWalletsForTransferLock = async ({ senderWallet, receiverWallet, client }) => {
    const query = client ? client.query.bind(client) : db.query.bind(db);

    const { rows } = await query(`
        SELECT id, user_id, balance, status FROM wallets
        WHERE id IN ($1, $2)
        ORDER BY id FOR UPDATE;
    `, [senderWallet, receiverWallet]);

    return rows;
};

const transfer = async ({ senderWallet, receiverWallet, amount, client }) => {
    const query = client ? client.query.bind(client) : db.query.bind(db);

    await query(`
        UPDATE wallets
        SET balance = balance - $2
        WHERE id = $1;
    `, [senderWallet, amount]);

    await query(`
        UPDATE wallets
        SET balance = balance + $2
        WHERE id = $1;
    `, [receiverWallet, amount]);

    const transferData = await query(`
        INSERT INTO transfers (sender_wallet_id, receiver_wallet_id, amount, status)
        VALUES ($1, $2, $3, 'SUCCEEDED')
        RETURNING *;
    `, [senderWallet, receiverWallet, amount]);

    const transferId = transferData.rows[0].id;

    const senderTransaction = await query(`
        INSERT INTO transactions (wallet_id, transfer_id, type, amount, status, reference)
        VALUES ($1, $2, 'TRANSFER_OUT', $3, 'SUCCEEDED', 'Transfer out')
        RETURNING *;
    `, [senderWallet, transferId, amount]);

    const receiverTransaction = await query(`
        INSERT INTO transactions (wallet_id, transfer_id, type, amount, status, reference)
        VALUES ($1, $2, 'TRANSFER_IN', $3, 'SUCCEEDED', 'Transfer in')
        RETURNING *;
    `, [receiverWallet, transferId, amount]);

    return {
        transfer: transferData.rows[0],
        senderTransaction: senderTransaction.rows[0],
        receiverTransaction: receiverTransaction.rows[0],
    };
};

const getTransfers = async ({ walletId, status = "all", cursor, limit = 10, search = "", filters = {} }) => {
    const values = [walletId];

    let statusFilter = "";
    let cursorFilter = "";
    let searchFilter = "";

    if (status !== "all") {
        values.push(status);
        statusFilter = `AND tr.status = $${values.length}`;
    }

    if (search && search.trim()) {
        values.push(`%${search.trim()}%`);
        searchFilter = `AND (
            sender.username ILIKE $${values.length}
            OR sender.name ILIKE $${values.length}
            OR receiver.username ILIKE $${values.length}
            OR receiver.name ILIKE $${values.length}
            OR tr.failure_reason ILIKE $${values.length}
            OR tr.amount::text ILIKE $${values.length}
        )`;
    }

    if (cursor) {
        const { createdAt, id: transferId } = cursor;

        values.push(createdAt, transferId);

        const createdAtParam = values.length - 1;
        const idParam = values.length;

        cursorFilter = `
            AND (tr.created_at, tr.id)
            < ($${createdAtParam}, $${idParam})
        `;
    }

    values.push(limit + 1);
    const limitParam = values.length;

    const { rows } = await db.query(`
        SELECT
            tr.id,
            tr.amount,
            tr.status,
            tr.failure_reason,
            tr.created_at,
            json_build_object(
                'id', sender.id,
                'name', sender.name,
                'username', sender.username,
                'avatar_url', sender.avatar_url
            ) AS sender,
            json_build_object(
                'id', receiver.id,
                'name', receiver.name,
                'username', receiver.username,
                'avatar_url', receiver.avatar_url
            ) AS receiver
        FROM transfers tr
        JOIN wallets sender_wallet ON tr.sender_wallet_id = sender_wallet.id
        JOIN users sender ON sender_wallet.user_id = sender.id
        JOIN wallets receiver_wallet ON tr.receiver_wallet_id = receiver_wallet.id
        JOIN users receiver ON receiver_wallet.user_id = receiver.id
        WHERE (
            tr.sender_wallet_id = $1
            OR tr.receiver_wallet_id = $1
        )
        ${statusFilter}
        ${searchFilter}
        ${cursorFilter}
        ORDER BY tr.created_at DESC, tr.id DESC
        LIMIT $${limitParam};
    `, values);

    return rows;
};

const getTransferById = async ({ walletId, transferId }) => {
    const { rows } = await db.query(`
        SELECT
            tr.id,
            tr.amount,
            tr.status,
            tr.failure_reason,
            tr.created_at,
            json_build_object(
                'id', sender.id,
                'name', sender.name,
                'username', sender.username,
                'avatar_url', sender.avatar_url
            ) AS sender,
            json_build_object(
                'id', receiver.id,
                'name', receiver.name,
                'username', receiver.username,
                'avatar_url', receiver.avatar_url
            ) AS receiver
        FROM transfers tr
        JOIN wallets sender_wallet ON tr.sender_wallet_id = sender_wallet.id
        JOIN users sender ON sender_wallet.user_id = sender.id
        JOIN wallets receiver_wallet ON tr.receiver_wallet_id = receiver_wallet.id
        JOIN users receiver ON receiver_wallet.user_id = receiver.id
        WHERE (
            tr.sender_wallet_id = $1
            OR tr.receiver_wallet_id = $1
        )
        AND tr.id = $2
        ORDER BY tr.created_at DESC, tr.id DESC;
    `, [walletId, transferId]);

    return rows[0];
};

module.exports = {
    runTransaction: transactionRepository.runTransaction,
    getWalletsForTransferLock,
    transfer,
    getTransfers,
    getTransferById,
};