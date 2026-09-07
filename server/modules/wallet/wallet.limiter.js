const createLimiter = require("../../utils/createLimiter");

const createWalletLimiter = createLimiter({
	windowMs: 60 * 60 * 1000,
	max: 20,
	error: "Too many wallet creation attempts. Please try again later.",
});

const getMyWalletsLimiter = createLimiter({
	windowMs: 15 * 60 * 1000,
	max: 120,
	error: "Too many wallet list requests. Please try again later.",
});

const getWalletByIdLimiter = createLimiter({
	windowMs: 15 * 60 * 1000,
	max: 120,
	error: "Too many wallet requests. Please try again later.",
});

const updateWalletNameLimiter = createLimiter({
	windowMs: 60 * 60 * 1000,
	max: 30,
	error: "Too many wallet name update attempts. Please try again later.",
});

const updateWalletStatusLimiter = createLimiter({
	windowMs: 60 * 60 * 1000,
	max: 30,
	error: "Too many wallet status update attempts. Please try again later.",
});

module.exports = {
	createWalletLimiter,
	getMyWalletsLimiter,
	getWalletByIdLimiter,
	updateWalletNameLimiter,
	updateWalletStatusLimiter,
};
