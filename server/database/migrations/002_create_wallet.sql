DROP TABLE wallets;

CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,

    currency CHAR(3) NOT NULL,

    balance NUMERIC(19, 4) NOT NULL DEFAULT 0,

    bank_name VARCHAR(100),

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT wallets_balance_non_negative
        CHECK (balance >= 0),

    CONSTRAINT wallets_status_check
        CHECK (status IN ('ACTIVE', 'FROZEN', 'CLOSED'))
);