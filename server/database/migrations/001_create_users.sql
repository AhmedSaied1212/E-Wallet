-- Active: 1760530288762@@127.0.0.1@5432@e_wallet@public
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL, 
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    verification_token TEXT,
    reset_password_token TEXT,
    last_verification_email_sent_at TIMESTAMP,
    last_forgot_password_sent_at   TIMESTAMP,
    avatar_url TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);