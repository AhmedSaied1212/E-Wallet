const validatePhone = (phone) => {
    const phoneRegex = /^\+?(\d{1,3})?[-. ]?\(?\d{1,4}\)?[-. ]?\d{1,4}[-. ]?\d{1,9}$/;
    
    if (!phoneRegex.test(phone)) {
        return {
            success: false,
            error: "Please provide a valid phone number (e.g., +1234567890 or 123-456-7890)"
        };
    }
    return null;
};

module.exports = { validatePhone };