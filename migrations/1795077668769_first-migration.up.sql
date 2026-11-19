-- Migration: first-migration
-- Created: 2026-11-19T08:41:08.769Z

-- Write your migration SQL here
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category_id INT NOT NULL
);