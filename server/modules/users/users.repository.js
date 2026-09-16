const db = require("../../config/db");

const searchUsers = async ({ query, requesterId, cursor, limit = 10 }) => {
    const like = `%${query}%`;
    const values = [requesterId, like];
    let cursorFilter = "";

    if (cursor) {
        const { username, id } = cursor;

        values.push(username, id);
        cursorFilter = `
            AND (
                users.username > $3
                OR (users.username = $3 AND users.id > $4)
            )
        `;
    }

    values.push(limit + 1);
    const limitParam = values.length;

    const { rows } = await db.query(
        `
        SELECT
            id,
            name,
            username,
            email,
            avatar_url,
            is_verified,
            created_at
        FROM users
        WHERE id != $1
        AND (
            username ILIKE $2
            OR email ILIKE $2
        )
        ${cursorFilter}
        ORDER BY username ASC, id ASC
        LIMIT $${limitParam};
        `,
        values
    );

    const hasMore = rows.length > limit;

    if (hasMore) {
        rows.pop();
    }

    const lastUser = rows[rows.length - 1];
    const nextCursor = hasMore && lastUser
        ? { username: lastUser.username, id: lastUser.id }
        : null;

    return {
        users: rows,
        pagination: {
            limit,
            nextCursor,
            hasMore,
        },
    };
};

module.exports = {
    searchUsers,
};
