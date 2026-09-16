const crypto = require("crypto");

const generateRequestHash = (body) => {
    const normalizedBody = JSON.stringify(body, Object.keys(body).sort());

    return crypto
        .createHash("sha256")
        .update(normalizedBody)
        .digest("hex");
};

module.exports = generateRequestHash;
