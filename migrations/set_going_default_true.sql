-- Migration: Set going column default to TRUE
-- Date: 2025-12-16
-- Description: Changes the default value of the going column from FALSE to TRUE
--              and updates all existing guests to going = TRUE

-- NOTE: You can also run this migration via the API endpoint:
-- POST /api/admin/set-going-default-true
-- This is the preferred method for production environments.

BEGIN;

-- Change the default value for the going column to TRUE
ALTER TABLE guests 
ALTER COLUMN going SET DEFAULT TRUE;

-- Update all existing guests who have going = FALSE to going = TRUE
UPDATE guests 
SET going = TRUE 
WHERE going = FALSE;

COMMIT;

-- Rollback script (if needed):
-- BEGIN;
-- ALTER TABLE guests ALTER COLUMN going SET DEFAULT FALSE;
-- UPDATE guests SET going = FALSE WHERE going = TRUE;
-- COMMIT;

