-- Migration: Remove item_photo column from items table
-- Date: 2025-12-16
-- Description: Removes the item_photo column from the items table as it is no longer needed

-- NOTE: You can also run this migration via the API endpoint:
-- POST /api/admin/remove-item-photo
-- This is the preferred method for production environments.

BEGIN;

-- Drop the item_photo column from the items table
ALTER TABLE items DROP COLUMN IF EXISTS item_photo;

COMMIT;

-- Rollback script (if needed):
-- BEGIN;
-- ALTER TABLE items ADD COLUMN item_photo TEXT;
-- COMMIT;

