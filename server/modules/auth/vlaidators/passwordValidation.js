const validatePassword = (password) => {
    if (!password || password.length < 6) {
        return {
            success: false,
            error: "Password must be at least 6 characters long."
        };
    }
    return null;
};

module.exports = { validatePassword };