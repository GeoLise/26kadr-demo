-- Migration: add-user-role
-- Created: 2026-11-25T06:40:36.264Z

-- Write your migration SQL here
ALTER TABLE "user"
ADD COLUMN "role" TEXT NOT NULL DEFAULT 'USER';