const db = require("../../config/db");

const newWallet = async ({ name, currency, bankName, userId }) => {
    const { rows } = await db.query(`
        INSERT 
        INTO wallets (name, currency, bank_name, user_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `, [name, currency, bankName, userId]);

    return rows[0];
};

const fetchMyWallets = async (userId) => {
    const { rows } = await db.query(`
        SELECT *   
        FROM wallets
        WHERE user_id = $1
    `, [userId]);

    return rows;
}

const fetchWalletById = async (id) => {
    const { rows } = await db.query(`
        SELECT * 
        FROM wallets
        WHERE id = $1
    `, [id]);

    return rows[0];
};

const editWalletName = async (id, name) => {
    const { rows } = await db.query(`
        UPDATE wallets 
        SET
            name = $1
        WHERE id = $2
        RETURNING *
    `, [name, id]);

    return rows[0];
};

const editWalletStatus = async (id, status) => {
    const { rows } = await db.query(`
        UPDATE wallets
        SET 
            status = $1
        WHERE id = $2
        RETURNING *;
    `, [status, id]);

    return rows[0];
}

module.exports = {
    newWallet,
    fetchMyWallets,
    fetchWalletById,
    editWalletName,
    editWalletStatus
};