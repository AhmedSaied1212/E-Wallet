const db = require("../../config/db");

const runTransaction = async (callback) => {
    const client = await db.connect();

    try {
        await client.query("BEGIN");
        const result = await callback(client);
        await client.query("COMMIT");
        return result;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const getWalletForDepositLock = async ({ walletId, client }) => {
    const query = client ? client.query.bind(client) : db.query.bind(db);

    const { rows } = await query(`
        SELECT user_id, status FROM wallets WHERE id = $1 FOR UPDATE;
    `, [walletId]);

    return rows;
};

const getWalletForWithdrawLock = async ({ walletId, client }) => {
    const query = client ? client.query.bind(client) : db.query.bind(db);

    const { rows } = await query(`
        SELECT user_id, status, balance FROM wallets WHERE id = $1 FOR UPDATE;
    `, [walletId]);

    return rows;
};

const deposit = async ({ walletId, amount, client }) => {
    const query = client ? client.query.bind(client) : db.query.bind(db);

    await query(`
        UPDATE wallets
        SET balance = balance + $2
        WHERE id = $1;
    `, [walletId, amount]);

    const transaction = await query(`
        INSERT INTO transactions (wallet_id, type, amount, status, reference)
        VALUES ($1, 'DEPOSIT', $2, 'SUCCEEDED', 'Cash deposit')
        RETURNING *;
    `, [walletId, amount]);

    return transaction.rows[0];
};

const withdraw = async ({ walletId, amount, client }) => {
    const query = client ? client.query.bind(client) : db.query.bind(db);

    await query(`
        UPDATE wallets
        SET balance = balance - $2
        WHERE id = $1;
    `, [walletId, amount]);

    const transaction = await query(`
        INSERT INTO transactions (wallet_id, type, amount, status, reference)
        VALUES ($1, 'WITHDRAW', $2, 'SUCCEEDED', 'ATM withdrawal')
        RETURNING *;
    `, [walletId, amount]);

    return transaction.rows[0];
};

const getWalletTransactions = async ({ walletId, limit, cursor, type = "all", status = "all", search = "", filters = {} }) => {
    const values = [walletId];

    let typeFilter = "";
    let statusFilter = "";
    let cursorFilter = "";
    let searchFilter = "";

    if (type !== "all") {
        values.push(type);
        typeFilter = `AND type = $${values.length}`;
    }

    if (status !== "all") {
        values.push(status);
        statusFilter = `AND status = $${values.length}`;
    }

    if (search && search.trim()) {
        values.push(`%${search.trim()}%`);
        searchFilter = `AND (reference ILIKE $${values.length} OR type ILIKE $${values.length} OR status ILIKE $${values.length})`;
    }

    if (cursor) {
        const { createdAt, id: transactionId } = cursor;

        values.push(createdAt, transactionId);

        const createdAtParam = values.length - 1;
        const idParam = values.length;

        cursorFilter = `
            AND (created_at, id)
            < ($${createdAtParam}, $${idParam})
        `;
    }

    values.push(limit + 1);

    const limitParam = values.length;

    const { rows } = await db.query(`
        SELECT *
        FROM transactions
        WHERE wallet_id = $1
        ${typeFilter}
        ${statusFilter}
        ${searchFilter}
        ${cursorFilter}
        ORDER BY created_at DESC, id DESC
        LIMIT $${limitParam}
    `, values);

    return rows;
};

const getMyTransactions = async ({ userId, limit, cursor, type = "all", status = "all", search = ""}) => {
    const values = [userId];

    let typeFilter = "";
    let statusFilter = "";
    let cursorFilter = "";
    let searchFilter = "";

    if (type !== "all") {
        values.push(type);
        typeFilter = `AND t.type = $${values.length}`;
    }

    if (status !== "all") {
        values.push(status);
        statusFilter = `AND t.status = $${values.length}`;
    }

    if (search && search.trim()) {
        values.push(`%${search.trim()}%`);
        searchFilter = `AND (t.reference ILIKE $${values.length} OR t.type ILIKE $${values.length} OR t.status ILIKE $${values.length})`;
    }

    if (cursor) {
        const { createdAt, id: transactionId } = cursor;

        values.push(createdAt, transactionId);

        const createdAtParam = values.length - 1;
        const idParam = values.length;

        cursorFilter = `
            AND (t.created_at, t.id)
            < ($${createdAtParam}, $${idParam})
        `;
    }

    values.push(limit + 1);

    const limitParam = values.length;

    const { rows } = await db.query(`
        SELECT
            t.id,
            t.wallet_id,
            t.type,
            t.amount,
            t.status,
            t.reference,
            t.created_at,
            w.name AS wallet_name,
            w.currency
        FROM transactions t
        JOIN wallets w
            ON t.wallet_id = w.id
        WHERE w.user_id = $1
        ${typeFilter}
        ${statusFilter}
        ${searchFilter}
        ${cursorFilter}
        ORDER BY t.created_at DESC, t.id DESC
        LIMIT $${limitParam}
    `, values);

    return rows;
};

const getTransactionById = async ({ walletId, transactionId }) => {
    const { rows } = await db.query(`
        SELECT *
        FROM transactions 
        WHERE wallet_id = $1
        AND id = $2
    `, [walletId, transactionId]);

    return rows[0];
}

module.exports = {
    runTransaction,
    getWalletForDepositLock,
    getWalletForWithdrawLock,
    deposit,
    withdraw,
    getWalletTransactions,
    getMyTransactions,
    getTransactionById,
};