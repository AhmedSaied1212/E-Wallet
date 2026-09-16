const AppError = require("../../utils/appError");
const repository = require("./users.repository");
const validation = require("./users.validation");
const { encodeCursor, decodeCursor } = require("../../utils/cursor");

const searchUsers = async ({ query, requesterId, cursor, limit = 10 }) => {
    if (!query || !query.trim()) {
        throw new AppError("Search query is required.", 400);
    }

    const normalized = query.trim();

    if (normalized.length < 2) {
        throw new AppError("Search query must be at least 2 characters.", 400);
    }

    validation.checkCursor(cursor);
    const decodedCursor = decodeCursor(cursor, "users");
    const parsedLimit = validation.checkLimit(limit);

    const result = await repository.searchUsers({
        query: normalized,
        requesterId,
        cursor: decodedCursor,
        limit: parsedLimit,
    });

    return {
        ...result,
        pagination: {
            ...result.pagination,
            nextCursor: result.pagination.nextCursor
                ? encodeCursor("users", result.pagination.nextCursor)
                : null,
        },
    };
};

module.exports = {
    searchUsers,
};
