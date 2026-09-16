DROP TABLE transactions;
CREATE TABLE transactions (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),

    wallet_id UUID NOT NULL 
        REFERENCES wallets(id) 
        ON DELETE CASCADE,

    transfer_id UUID 
        REFERENCES transfers(id),

    type VARCHAR(50) NOT NULL 
        CHECK (type IN ('DEPOSIT', 'WITHDRAW', 'TRANSFER_IN', 'TRANSFER_OUT')),

    amount NUMERIC(19, 4) NOT NULL 
        CHECK (amount > 0),

    status VARCHAR(50) NOT NULL
        CHECK (status IN ('SUCCEEDED', 'FAILED')),

    reference VARCHAR(100) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)