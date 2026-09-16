const createKey = async ({
    client,
    idKey,
    userId,
    requestHash,
}) => {
    const result = await client.query(
        `
        INSERT INTO idempotency_keys
        (
            id_key,
            user_id,
            request_hash,
            status
        )
        VALUES ($1, $2, $3, 'PENDING')
        ON CONFLICT (user_id, id_key)
        DO NOTHING
        RETURNING *
        `,
        [idKey, userId, requestHash]
    );

    return result.rows[0] || null;
};

const getKey = async ({
    client,
    idKey,
    userId,
}) => {
    const result = await client.query(
        `
        SELECT *
        FROM idempotency_keys
        WHERE id_key = $1
        AND user_id = $2
        FOR UPDATE
        `,
        [idKey, userId]
    );

    return result.rows[0] || null;
};

const updateKey = async ({
    client,
    idKey,
    userId,
    status,
    responseCode,
    responseBody,
}) => {
    const result = await client.query(
        `
        UPDATE idempotency_keys
        SET
            status = $1,
            response_code = $2,
            response_body = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE id_key = $4
        AND user_id = $5
        RETURNING *
        `,
        [status, responseCode, responseBody, idKey, userId]
    );

    return result.rows[0] || null;
};

module.exports = {
    createKey,
    getKey,
    updateKey,
};
