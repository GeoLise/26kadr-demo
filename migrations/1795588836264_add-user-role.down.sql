-- Rollback: add-user-role
-- Created: 2026-11-25T06:40:36.272Z

-- Write your rollback SQL here
ALTER TABLE user 
DROP COLUMN "role";