const AppError = require("../../utils/appError");
const idempotencyRepository = require("./idempotency.repository");
const generateRequestHash = require("../../utils/generateRequestHash");

const checkIdempotency = async ({
    client,
    idKey,
    userId,
    body,
}) => {
    const requestHash = generateRequestHash(body);

    const existingKey = await idempotencyRepository.getKey({
        client,
        idKey,
        userId,
    });

    if (existingKey) {
        if (existingKey.request_hash !== requestHash) {
            throw new AppError(
                "Idempotency-Key was already used with a different request",
                409,
            );
        }

        return {
            isNew: false,
            data: existingKey,
        };
    }

    const newKey = await idempotencyRepository.createKey({
        client,
        idKey,
        userId,
        requestHash,
    });

    if (newKey) {
        return {
            isNew: true,
            data: newKey,
        };
    }

    const key = await idempotencyRepository.getKey({
        client,
        idKey,
        userId,
    });

    if (!key) {
        throw new AppError("Unable to process idempotency key", 500);
    }

    if (key.request_hash !== requestHash) {
        throw new AppError(
            "Idempotency-Key was already used with a different request",
            409,
        );
    }

    return {
        isNew: false,
        data: key,
    };
};

const completeIdempotency = async ({
    client,
    idKey,
    userId,
    responseCode,
    responseBody,
}) => {
    return idempotencyRepository.updateKey({
        client,
        idKey,
        userId,
        status: "COMPLETED",
        responseCode,
        responseBody,
    });
};

const failIdempotency = async ({
    client,
    idKey,
    userId,
    responseCode,
    responseBody,
}) => {
    return idempotencyRepository.updateKey({
        client,
        idKey,
        userId,
        status: "FAILED",
        responseCode,
        responseBody,
    });
};

module.exports = {
    checkIdempotency,
    completeIdempotency,
    failIdempotency,
};
