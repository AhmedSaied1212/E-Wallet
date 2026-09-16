const crypto = require("node:crypto");
const AppError = require("./appError");

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const VERSION = 1;

const getKey = () => {
    const secret = process.env.CURSOR_SECRET || process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("CURSOR_SECRET or JWT_SECRET must be configured.");
    }

    return crypto.createHash("sha256").update(secret).digest();
};

const encodeCursor = (type, value) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
    const payload = Buffer.from(JSON.stringify({ version: VERSION, type, value }));
    const encrypted = Buffer.concat([cipher.update(payload), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return Buffer.concat([iv, authTag, encrypted]).toString("base64url");
};

const decodeCursor = (cursor, type) => {
    if (!cursor) return null;

    try {
        const encoded = Buffer.from(cursor, "base64url");
        const iv = encoded.subarray(0, IV_LENGTH);
        const authTag = encoded.subarray(IV_LENGTH, IV_LENGTH + 16);
        const encrypted = encoded.subarray(IV_LENGTH + 16);
        const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);

        decipher.setAuthTag(authTag);
        const payload = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        const decoded = JSON.parse(payload.toString("utf8"));

        if (decoded.version !== VERSION || decoded.type !== type || !decoded.value) {
            throw new Error("Invalid cursor payload");
        }

        return decoded.value;
    } catch (error) {
        throw new AppError("Cursor is invalid or expired.", 400);
    }
};

module.exports = {
    encodeCursor,
    decodeCursor,
};