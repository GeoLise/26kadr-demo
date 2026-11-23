-- Rollback: auth-tables
-- Created: 2026-11-23T10:40:39.873Z

-- Write your rollback SQL here
DROP TABLE user;
DROP TABLE session;
DROP TABLE account;
DROP TABLE verification;