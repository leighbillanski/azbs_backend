# Schema Migration Guide

## Overview

This migration restructures the database to better track item claims using a many-to-many relationship between guests and items.

## What Changed

### Before:
- ❌ Guests had a `claimed_item` field (one item per guest)
- ❌ Items had `claimed` boolean, `guest_name`, `guest_number` (one guest per item)
- ❌ Limited flexibility - couldn't track quantity or multiple claims

### After:
- ✅ Guests have NO `claimed_item` field
- ✅ Items have `claimed_count` to track total claims
- ✅ New `guest_items` junction table tracks who claimed what and how many
- ✅ Full many-to-many relationship - guests can claim multiple items, items can be claimed by multiple guests

## New Schema

### Guests Table
```sql
CREATE TABLE guests (
  name VARCHAR(255) NOT NULL,
  number VARCHAR(50) NOT NULL,
  user_email VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (name, number)
);
```
**Change:** Removed `claimed_item` column

### Items Table
```sql
CREATE TABLE items (
  item_name VARCHAR(255) PRIMARY KEY,
  item_link TEXT,
  item_count INTEGER DEFAULT 0,        -- Total available
  claimed_count INTEGER DEFAULT 0,     -- NEW: Total claimed
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```
**Changes:** 
- Removed `claimed` boolean
- Removed `guest_name` and `guest_number`
- Added `claimed_count` integer

### Guest_Items Table (NEW!)
```sql
CREATE TABLE guest_items (
  guest_name VARCHAR(255) NOT NULL,
  guest_number VARCHAR(50) NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  quantity_claimed INTEGER DEFAULT 1,
  created_at TIMESTAMP,
  PRIMARY KEY (guest_name, guest_number, item_name),
  FOREIGN KEY (guest_name, guest_number) REFERENCES guests(name, number),
  FOREIGN KEY (item_name) REFERENCES items(item_name)
);
```
**Purpose:** Tracks which guest claimed which item and how many

## Running the Migration

### Option 1: Using Admin Endpoint (Easiest)

1. **Push code to GitHub:**
   ```bash
   git push origin main
   ```

2. **Wait for Render to deploy** (2-3 minutes)

3. **Run migration endpoint:**
   ```bash
   curl -X POST https://your-app.onrender.com/api/admin/migrate-schema
   ```

   Or visit in browser:
   ```
   https://your-app.onrender.com/api/admin/migrate-schema
   ```

4. **Verify success:** You should see a response with all the schema changes

### Option 2: Manual SQL (If needed)

```sql
-- Create junction table
CREATE TABLE IF NOT EXISTS guest_items (
  guest_name VARCHAR(255) NOT NULL,
  guest_number VARCHAR(50) NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  quantity_claimed INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (guest_name, guest_number, item_name),
  FOREIGN KEY (guest_name, guest_number) REFERENCES guests(name, number) ON DELETE CASCADE,
  FOREIGN KEY (item_name) REFERENCES items(item_name) ON DELETE CASCADE
);

-- Add claimed_count to items
ALTER TABLE items ADD COLUMN IF NOT EXISTS claimed_count INTEGER DEFAULT 0;

-- Remove old columns from items
ALTER TABLE items 
  DROP COLUMN IF EXISTS claimed,
  DROP COLUMN IF EXISTS guest_name,
  DROP COLUMN IF EXISTS guest_number;

-- Remove claimed_item from guests
ALTER TABLE guests DROP COLUMN IF EXISTS claimed_item;

-- Create indexes
CREATE INDEX idx_guest_items_guest ON guest_items(guest_name, guest_number);
CREATE INDEX idx_guest_items_item ON guest_items(item_name);
```

## API Changes

### Creating a Guest (Simplified)
```json
// Before
{
  "name": "John",
  "number": "123",
  "user_email": "user@example.com",
  "claimed_item": "Baby Thermometer"  ❌ REMOVED
}

// After
{
  "name": "John",
  "number": "123",
  "user_email": "user@example.com"
}
```

### Creating an Item (Simplified)
```json
// Before
{
  "item_name": "Baby Thermometer",
  "item_count": 10,
  "claimed": false,           ❌ REMOVED
  "guest_name": "John",       ❌ REMOVED
  "guest_number": "123"       ❌ REMOVED
}

// After
{
  "item_name": "Baby Thermometer",
  "item_count": 10
}
```

### Claiming an Item (Enhanced)
```json
// Before
{
  "guest_name": "John",
  "guest_number": "123"
}

// After (with quantity support)
{
  "guest_name": "John",
  "guest_number": "123",
  "quantity": 2              ✅ NEW: Can claim multiple
}
```

## New Features

### 1. Track Quantity
Guests can now claim multiple quantities of an item:
```bash
POST /api/items/Baby%20Thermometer/claim
{
  "guest_name": "John",
  "guest_number": "123",
  "quantity": 3
}
```

### 2. View Who Claimed What
Get all guests who claimed an item:
```bash
GET /api/items/Baby%20Thermometer/guests
```

Response:
```json
{
  "item_name": "Baby Thermometer",
  "item_count": 10,
  "claimed_count": 5,
  "claimed_by": [
    {
      "guest_name": "John",
      "guest_number": "123",
      "quantity_claimed": 3,
      "claimed_at": "2025-12-09T10:00:00Z"
    },
    {
      "guest_name": "Jane",
      "guest_number": "456",
      "quantity_claimed": 2,
      "claimed_at": "2025-12-09T11:00:00Z"
    }
  ]
}
```

### 3. Availability Tracking
The system now automatically tracks:
- `item_count`: Total available
- `claimed_count`: Total claimed
- `available`: `item_count - claimed_count`

## Benefits

✅ **Multiple Claims:** Guests can claim multiple items  
✅ **Quantity Tracking:** Track how many of each item was claimed  
✅ **Better Reporting:** See who claimed what and when  
✅ **Flexible:** Items can be claimed by multiple guests  
✅ **Data Integrity:** Proper foreign key relationships  
✅ **Scalable:** Junction table pattern is industry standard

## Testing After Migration

```bash
# 1. Create a guest
curl -X POST https://your-app.onrender.com/api/guests \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","number":"123","user_email":"test@example.com"}'

# 2. Create an item
curl -X POST https://your-app.onrender.com/api/items \
  -H "Content-Type: application/json" \
  -d '{"item_name":"Test Item","item_count":10}'

# 3. Claim the item
curl -X POST https://your-app.onrender.com/api/items/Test%20Item/claim \
  -H "Content-Type: application/json" \
  -d '{"guest_name":"Test","guest_number":"123","quantity":2}'

# 4. View claimed items
curl https://your-app.onrender.com/api/items/claimed

# 5. View who claimed the item
curl https://your-app.onrender.com/api/items/Test%20Item/guests
```

## Rollback

If you need to rollback (not recommended):
1. Restore database from backup
2. Revert code to previous commit:
   ```bash
   git revert HEAD
   git push origin main
   ```

## Support

If you encounter issues:
1. Check the response from the migration endpoint
2. Verify database connection: `GET /api/admin/check-database`
3. Review table schemas: `GET /api/admin/user-schema`

---

**Ready to migrate?** → `POST /api/admin/migrate-schema` 🚀

