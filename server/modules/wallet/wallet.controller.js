const appHandler = require("../../utils/appHandler");
const walletService = require("./wallet.service");

const createWallet = appHandler( async (req, res) => {
    const userId = req.user.id;

    const { name, currency, bankName } = req.body;

    const createdWallet = await walletService.createWallet({
        name,
        currency,
        bankName,
        userId
    });

    res.status(201).json({
        success: true,
        message: "Wallet created successfully",
        data: createdWallet
    });
});

const getMywallets = appHandler( async (req, res) => {
    const userId = req.user.id;

    const wallets = await walletService.getMywallets(userId);

    res.status(200).json({
        success: true,
        message: "Your wallets fetched successfully.",
        data: wallets
    });
});

const getWalletById = appHandler( async (req, res) => {
    const userId = req.user.id;

    const { id } = req.params;

    const wallet = await walletService.getWalletById(id, userId);

    res.status(200).json({
        success: true,
        message: "Wallet fetched successfully.",
        data: wallet
    })
});

const updateWalletName = appHandler( async (req, res) => {
    const userId = req.user.id;

    const { name } = req.body;

    const { id } = req.params;

    const updatedWallet = await walletService.updateWalletName({
        id,
        name,
        userId
    });

    res.status(200).json({
        success: true,
        message: "Wallet name updated successfully",
        data: updatedWallet
    })
});

const updateWalletStatus = appHandler( async (req, res) => {
    const userId = req.user.id;

    const { status } = req.body;

    const { id } = req.params;

    const updatedWallet = await walletService.updateWalletStatus({
        id,
        status,
        userId
    });

    res.status(200).json({
        success: true,
        message: "Wallet status updated successfully",
        data: updatedWallet
    });
});

module.exports = {
    createWallet,
    getMywallets,
    getWalletById,
    updateWalletName,
    updateWalletStatus
};