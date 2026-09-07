const AppError = require("../../utils/appError");
const repository = require("./wallet.repository");
const validation = require("./wallet.validation");

const createWallet = async ({ name, currency, bankName, userId }) => {
    const required = validation.requireFields(
        [name, currency, bankName, userId],
        "Name, currency, bank name and user id are required",
    );

    if (required) throw new AppError(required, 400);

    const wallet = await repository.newWallet({
        name,
        currency,
        bankName,
        userId
    });

    return wallet;

};

const getMywallets = async (userId) => {
    const required = validation.requireFields(
    [userId],
        "User id are required",
    );

    if (required) throw new AppError(required, 400);

    const wallets = await repository.fetchMyWallets(userId);

    return wallets;
};

const getWalletById = async (id, userId) => {
    const wallet = await repository.fetchWalletById(id);

    if (wallet.user_id !== userId) throw new AppError("You can't see a wallet belong to another user", 403);

    return wallet;
};

const updateWalletName = async ({ id, name, userId }) => {
    const required = validation.requireFields(
    [id, name, userId],
        "Wallet id, new name and user id are required",
    );

    if (required) throw new AppError(required, 400);

    const wallet = await repository.fetchWalletById(id);

    if (!wallet) throw new AppError("Wallet not found.", 404);

    if (wallet.user_id !== userId) throw new AppError("You can't update a wallet belong to another user.", 404);

    const updatedWallet = await repository.editWalletName(id, name);

    return updatedWallet;
};

const updateWalletStatus = async ({ id, status, userId }) => {
    const required = validation.requireFields(
    [id, status, userId],
        "Wallet id, status and user id are required",
    );

    validation.validateWalletStatus(status);

    if (required) throw new AppError(required, 400);
    
    const wallet = await repository.fetchWalletById(id);

    if (!wallet) throw new AppError("Wallet not found.", 404);

    if (wallet.user_id !== userId) throw new AppError("You can't update a wallet status belong to another user.", 403);

    const updatedWallet = await repository.editWalletStatus(id, status);

    return updatedWallet;
};

module.exports = {
    createWallet,
    getMywallets,
    getWalletById,
    updateWalletName,
    updateWalletStatus
};
