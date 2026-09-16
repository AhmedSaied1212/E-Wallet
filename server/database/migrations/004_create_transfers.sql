DROP TABLE transfers;

CREATE TABLE transfers (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),

    sender_wallet_id UUID NOT NULL 
        REFERENCES wallets(id),
    
    receiver_wallet_id UUID NOT NULL
        REFERENCES wallets(id),

    amount NUMERIC(19, 4) NOT NULL
        CHECK (amount > 0),

    status VARCHAR(50) NOT NULL 
        CHECK (status IN ('SUCCEEDED', 'FAILED')),
    
    failure_reason VARCHAR(150)
        CHECK (failure_reason IN ('INSUFFICIENT_BALANCE', 'INTERNAL_ERROR')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)