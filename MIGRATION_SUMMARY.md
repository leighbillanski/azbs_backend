# Database Migration Summary

## Date: December 9, 2025

## Overview

Successfully restructured the database schema to implement a many-to-many relationship between guests and items using a junction table.

## Files Created (2 new files)

1. **models/GuestItem.js** - New model for guest_items junction table
2. **SCHEMA_MIGRATION_GUIDE.md** - Comprehensive migration documentation

## Files Modified (13 files)

### Core Models
1. **config/initDb.js**
   - Removed `claimed_item` from guests table
   - Removed `claimed`, `guest_name`, `guest_number` from items table  
   - Added `claimed_count` to items table
   - Created new `guest_items` junction table with indexes

2. **models/Guest.js**
   - Removed `claimed_item` from create()
   - Removed `claimed_item` from update()
   - Updated findWithItems() to use guest_items junction table

3. **models/Item.js** (Complete rewrite)
   - Removed all guest_name/guest_number references
   - Removed claim() and unclaim() methods (moved to GuestItem model)
   - Added findWithGuests() to show who claimed an item
   - Added getAvailability() to check remaining quantity
   - Updated all methods to work with new schema

4. **models/User.js**
   - Removed `claimed_item` from findWithGuests() JSON aggregation

### Controllers
5. **controllers/guestController.js**
   - Removed `claimed_item` from createGuest()
   - Removed `claimed_item` from updateGuest()

6. **controllers/itemController.js** (Complete rewrite)
   - Now uses GuestItem model for claim/unclaim operations
   - Added quantity support for claiming items
   - Added availability checking before claims
   - Removed guest_name/guest_number from create()
   - Removed guest_name/guest_number from update()
   - Added getItemWithGuests() controller

7. **controllers/adminController.js**
   - Added migrateToNewSchema() function
   - Comprehensive migration with transactions
   - Returns updated schemas after migration

### Routes
8. **routes/itemRoutes.js**
   - Added GET /:itemName/guests route
   - Added getItemWithGuests to exports

9. **routes/adminRoutes.js**
   - Added POST /migrate-schema route

### Documentation
10. **README.md**
    - Updated Guest Table schema
    - Updated Item Table schema
    - Added Guest_Items Table documentation
    - Updated all API endpoint examples
    - Updated admin endpoints section

11. **ADMIN_ENDPOINTS.md**
    - Added migration endpoint documentation
    - Renumbered existing sections

12. **MIGRATION_SUMMARY.md** (this file)

13. **SCHEMA_MIGRATION_GUIDE.md** (new comprehensive guide)

## Database Schema Changes

### Guests Table
```sql
-- REMOVED
claimed_item VARCHAR(255)

-- NOW
CREATE TABLE guests (
  name VARCHAR(255) NOT NULL,
  number VARCHAR(50) NOT NULL,
  user_email VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (name, number)
);
```

### Items Table
```sql
-- REMOVED
claimed BOOLEAN DEFAULT FALSE,
guest_name VARCHAR(255),
guest_number VARCHAR(50),
FOREIGN KEY (guest_name, guest_number) ...

-- ADDED
claimed_count INTEGER DEFAULT 0

-- NOW
CREATE TABLE items (
  item_name VARCHAR(255) PRIMARY KEY,
  item_photo TEXT,
  item_link TEXT,
  item_count INTEGER DEFAULT 0,
  claimed_count INTEGER DEFAULT 0,  -- NEW
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Guest_Items Table (NEW!)
```sql
CREATE TABLE guest_items (
  guest_name VARCHAR(255) NOT NULL,
  guest_number VARCHAR(50) NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  quantity_claimed INTEGER DEFAULT 1,
  created_at TIMESTAMP,
  PRIMARY KEY (guest_name, guest_number, item_name),
  FOREIGN KEY (guest_name, guest_number) REFERENCES guests(name, number) ON DELETE CASCADE,
  FOREIGN KEY (item_name) REFERENCES items(item_name) ON DELETE CASCADE
);
```

## API Changes

### New Endpoints
- `GET /api/items/:itemName/guests` - Get item with list of claimers
- `POST /api/admin/migrate-schema` - Run database migration

### Modified Endpoints

#### POST /api/guests (Simplified)
```json
// Before
{ "name": "...", "number": "...", "user_email": "...", "claimed_item": "..." }

// After
{ "name": "...", "number": "...", "user_email": "..." }
```

#### POST /api/items (Simplified)
```json
// Before
{ "item_name": "...", "item_count": 10, "claimed": false, "guest_name": "...", "guest_number": "..." }

// After
{ "item_name": "...", "item_count": 10 }
```

#### POST /api/items/:itemName/claim (Enhanced)
```json
// Before
{ "guest_name": "...", "guest_number": "..." }

// After (with quantity support!)
{ "guest_name": "...", "guest_number": "...", "quantity": 2 }
```

#### POST /api/items/:itemName/unclaim (Modified)
```json
// Now requires guest identification
{ "guest_name": "...", "guest_number": "..." }
```

## New Features

### ✅ Quantity Tracking
- Guests can claim multiple quantities of an item
- Automatic availability checking (item_count - claimed_count)
- Prevents over-claiming

### ✅ Many-to-Many Relationships
- Multiple guests can claim the same item
- One guest can claim multiple items
- Full flexibility

### ✅ Better Reporting
- See who claimed what item
- See when items were claimed
- Track exact quantities

### ✅ Data Integrity
- Proper foreign key relationships
- Cascading deletes
- Transaction support in claim/unclaim operations

## Migration Path

### For New Deployments
The `initDb.js` will create the correct schema automatically.

### For Existing Deployments
Use the admin endpoint:
```bash
POST https://your-app.onrender.com/api/admin/migrate-schema
```

This will:
1. Create guest_items table
2. Add claimed_count to items
3. Remove old columns
4. Set up indexes
5. Return updated schemas

## Testing Checklist

- [ ] Create a guest (without claimed_item)
- [ ] Create an item (without claimed/guest fields)
- [ ] Claim an item with quantity
- [ ] View item with claimers
- [ ] View guest with claimed items
- [ ] Check claimed/unclaimed item lists
- [ ] Unclaim an item
- [ ] Verify availability tracking

## Status

✅ **Code Changes:** Complete  
✅ **Models:** Updated  
✅ **Controllers:** Updated  
✅ **Routes:** Updated  
✅ **Documentation:** Complete  
✅ **Migration Script:** Ready  
✅ **Linter:** No errors  

**Ready to push and deploy!** 🚀

## Next Steps

1. Push to GitHub: `git push origin main`
2. Wait for Render deployment
3. Run migration: `POST /api/admin/migrate-schema`
4. Test the new functionality
5. Update frontend to use new API structure

## Benefits Summary

| Before | After |
|--------|-------|
| One item per guest | Multiple items per guest |
| One guest per item | Multiple guests per item |
| Boolean claimed flag | Quantity tracking |
| No claim history | Full claim history with timestamps |
| Limited flexibility | Full many-to-many support |

---

**Migration ready!** All code changes complete. Database can be migrated via admin endpoint. 🎉

