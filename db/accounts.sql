CREATE TABLE IF NOT EXISTS accounts (
    email VARCHAR(255) NOT NULL,
    balance INT DEFAULT 0,
    apple INT DEFAULT 0,
    banana INT DEFAULT 0,
    orange INT DEFAULT 0,
    pineapple INT DEFAULT 0,
    pear INT DEFAULT 0,
    UNIQUE(email)
);
