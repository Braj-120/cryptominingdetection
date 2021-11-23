CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE,
    password TEXT 
);

CREATE TABLE IF NOT EXISTS tokens (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    host VARCHAR(255) NOT NULL,
    secret VARCHAR(255) NOT NULL,
    token TEXT,
    generated_at DATETIME 
);

CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    hostname TEXT NOT NULL,
    host_ip TEXT NOT NULL,
    dest_address TEXT,
    fqdn TEXT,
    pool_name TEXT,
    crypto_url TEXT,
    port_number INT,
    crypto_name TEXT,
    abbreviation TEXT,
    protocol TEXT,
    datetime TEXT NOT NULL,
    generated_at TEXT NOT NULL
);