const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            success: false,
            error: "Please provide a valid email address"
        };
    }
    return null; 
};

module.exports = { validateEmail };