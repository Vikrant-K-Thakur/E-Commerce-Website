-- SQL Database Schema for Customers Table
CREATE TABLE customers (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    coinBalance INT DEFAULT 0,
    loginBonusGiven BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Index for faster email lookups
CREATE INDEX idx_customers_email ON customers(email);

-- SQL Database Schema for Transactions Table (for coin tracking)
CREATE TABLE transactions (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    type ENUM('credit', 'debit') NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) DEFAULT 0,
    coins INT DEFAULT 0,
    paymentMethod VARCHAR(100),
    status VARCHAR(50) DEFAULT 'completed',
    expires_at TIMESTAMP NULL,
    expired_processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date DATE,
    time TIME
);

-- Indexes for transactions
CREATE INDEX idx_transactions_email ON transactions(email);
CREATE INDEX idx_transactions_expires_at ON transactions(expires_at);
CREATE INDEX idx_transactions_type ON transactions(type);

-- SQL Database Schema for Rewards Table (for notifications)
CREATE TABLE rewards (
    id VARCHAR(255) PRIMARY KEY,
    customerEmail VARCHAR(255) NOT NULL,
    type ENUM('coins', 'discount', 'gift') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    value INT NOT NULL,
    expires_at TIMESTAMP NULL,
    isRead BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for rewards
CREATE INDEX idx_rewards_customer_email ON rewards(customerEmail);
CREATE INDEX idx_rewards_created_at ON rewards(created_at DESC);
CREATE INDEX idx_rewards_is_read ON rewards(isRead);

-- SQL Database Schema for Reviews Table
CREATE TABLE reviews (
    id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    is_new BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes for faster lookups
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_reviews_is_new ON reviews(is_new);