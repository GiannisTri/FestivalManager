-- ==========================================================
-- Festival Manager Database Schema
-- PostgreSQL
-- ==========================================================



CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    username VARCHAR(50) NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    role VARCHAR(20) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,

    first_name VARCHAR(100) NOT NULL,

    last_name VARCHAR(100) NOT NULL,

    phone VARCHAR(20),

    email VARCHAR(255),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_vendors_name
ON vendors(last_name, first_name);

CREATE TABLE festivals (
    id SERIAL PRIMARY KEY,

    name VARCHAR(150) NOT NULL UNIQUE,

    start_date DATE NOT NULL,

    end_date DATE NOT NULL,

    CHECK (end_date >= start_date)
);

CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,

    vendor_id INTEGER NOT NULL,

    year SMALLINT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_registration_vendor
        FOREIGN KEY (vendor_id)
        REFERENCES vendors(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_vendor_year
        UNIQUE (vendor_id, year)
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,

    registration_id INTEGER NOT NULL,

    festival_id INTEGER NOT NULL,

    position VARCHAR(50) NOT NULL,

    meters INTEGER NOT NULL,

    amount NUMERIC(10,2) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_registration
        FOREIGN KEY (registration_id)
        REFERENCES registrations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_payment_festival
        FOREIGN KEY (festival_id)
        REFERENCES festivals(id),

    CONSTRAINT uq_registration_festival
        UNIQUE (registration_id, festival_id),

    CONSTRAINT chk_meters
        CHECK (meters > 0),

    CONSTRAINT chk_amount
        CHECK (amount >= 0)
);