const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;
    if (!usernameRegex.test(username)) {
        return {
            success: false,
            error: "Please provide a valid username"
        };
    }
    return null; 
};

module.exports = { validateUsername };