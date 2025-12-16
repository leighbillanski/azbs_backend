# Admin Endpoints Guide

These endpoints allow you to manage your database schema remotely, which is especially useful when you can't access the database shell directly (e.g., on free-tier hosting).

## Available Endpoints

### 1. Migrate to New Schema

**Endpoint:** `POST /api/admin/migrate-schema`

**Purpose:** Migrates database to new schema with guest_items junction table

**What it does:**
- Removes `claimed_item` from guests table
- Removes `claimed`, `guest_name`, `guest_number` from items table
- Adds `claimed_count` to items table
- Creates new `guest_items` junction table to track who claimed what

**Usage:**

```bash
curl -X POST https://your-app-url.onrender.com/api/admin/migrate-schema
```

**Response:**

```json
{
  "success": true,
  "message": "Database schema migrated successfully",
  "changes": {
    "guests": "Removed claimed_item column",
    "items": "Removed claimed, guest_name, guest_number; Added claimed_count",
    "guest_items": "Created new junction table"
  },
  "schemas": {
    "guests": [...],
    "items": [...],
    "guest_items": [...]
  }
}
```

### 2. Update User Schema (Add Number Column)

**Endpoint:** `POST /api/admin/update-user-schema`

**Purpose:** Adds the `number` column to the users table

**Usage:**

```bash
# Using curl
curl -X POST https://your-app-url.onrender.com/api/admin/update-user-schema

# Or just visit in browser (POST will be handled)
https://your-app-url.onrender.com/api/admin/update-user-schema
```

**Response:**

```json
{
  "success": true,
  "message": "Users table updated successfully - number column added",
  "schema": [
    {
      "column": "email",
      "type": "character varying",
      "max_length": 255
    },
    {
      "column": "name",
      "type": "character varying",
      "max_length": 255
    },
    {
      "column": "number",
      "type": "character varying",
      "max_length": 50
    },
    {
      "column": "password",
      "type": "character varying",
      "max_length": 255
    },
    {
      "column": "role",
      "type": "character varying",
      "max_length": 100
    },
    {
      "column": "created_at",
      "type": "timestamp without time zone",
      "max_length": null
    },
    {
      "column": "updated_at",
      "type": "timestamp without time zone",
      "max_length": null
    }
  ]
}
```

### 3. Check Database Connection

**Endpoint:** `GET /api/admin/check-database`

**Purpose:** Test if the database is connected and accessible

**Usage:**

```bash
curl https://your-app-url.onrender.com/api/admin/check-database
```

**Response:**

```json
{
  "success": true,
  "message": "Database is connected",
  "time": "2025-12-09T10:30:00.000Z",
  "version": "PostgreSQL 15.x"
}
```

### 4. Remove Item Photo Column

**Endpoint:** `POST /api/admin/remove-item-photo`

**Purpose:** Removes the `item_photo` column from the items table

**Usage:**

```bash
# Using curl
curl -X POST https://your-app-url.onrender.com/api/admin/remove-item-photo

# Or just visit in browser
https://your-app-url.onrender.com/api/admin/remove-item-photo
```

**Response:**

```json
{
  "success": true,
  "message": "Items table updated successfully - item_photo column removed",
  "schema": [
    {
      "column_name": "item_name",
      "data_type": "character varying"
    },
    {
      "column_name": "item_link",
      "data_type": "text"
    },
    {
      "column_name": "item_count",
      "data_type": "integer"
    },
    {
      "column_name": "claimed_count",
      "data_type": "integer"
    },
    {
      "column_name": "created_at",
      "data_type": "timestamp without time zone"
    },
    {
      "column_name": "updated_at",
      "data_type": "timestamp without time zone"
    }
  ]
}
```

### 5. Set Going Default to True

**Endpoint:** `POST /api/admin/set-going-default-true`

**Purpose:** Changes the `going` column default to `TRUE` and updates all existing guests with `going = FALSE` to `going = TRUE`

**Usage:**

```bash
# Using curl
curl -X POST https://your-app-url.onrender.com/api/admin/set-going-default-true

# Or just visit in browser
https://your-app-url.onrender.com/api/admin/set-going-default-true
```

**Response:**

```json
{
  "success": true,
  "message": "Going column default changed to true. Updated 5 existing guests.",
  "updated_count": 5
}
```

**What it does:**
- Changes the default value for the `going` column from `FALSE` to `TRUE`
- Updates all existing guests who have `going = FALSE` to `going = TRUE`
- New guests created after this migration will have `going = TRUE` by default

### 6. Get User Table Schema

**Endpoint:** `GET /api/admin/user-schema`

**Purpose:** View the current structure of the users table

**Usage:**

```bash
curl https://your-app-url.onrender.com/api/admin/user-schema
```

**Response:**

```json
{
  "success": true,
  "table": "users",
  "columns": [
    {
      "name": "email",
      "type": "character varying",
      "max_length": 255,
      "nullable": "NO"
    },
    {
      "name": "name",
      "type": "character varying",
      "max_length": 255,
      "nullable": "NO"
    },
    {
      "name": "number",
      "type": "character varying",
      "max_length": 50,
      "nullable": "YES"
    },
    // ... more columns
  ]
}
```

## How to Use After Deployment

### Step 1: Deploy Your Code

Push your changes to GitHub (already done):

```bash
git push origin main
```

### Step 2: Wait for Deployment

Render will automatically deploy your changes. Wait for the deployment to complete.

### Step 3: Update the Database Schema

Once deployed, make a POST request to the update endpoint:

**Option A: Using Browser**

Simply visit this URL in your browser:
```
https://your-app-name.onrender.com/api/admin/update-user-schema
```

**Option B: Using curl**

```bash
curl -X POST https://your-app-name.onrender.com/api/admin/update-user-schema
```

**Option C: Using Postman/Insomnia**

Make a POST request to:
```
https://your-app-name.onrender.com/api/admin/update-user-schema
```

### Step 4: Verify

Check the schema was updated:

```bash
curl https://your-app-name.onrender.com/api/admin/user-schema
```

Look for the `number` column in the response!

## Important Notes

⚠️ **Security Consideration:**

These are admin endpoints with no authentication. In production, you should:

1. Add authentication middleware
2. Restrict access by IP or API key
3. Remove these endpoints after schema updates are done

For now, since you're in development, it's fine to leave them open.

## Example: Complete Update Flow

```bash
# 1. Check database is connected
curl https://your-app.onrender.com/api/admin/check-database

# 2. View current schema (before update)
curl https://your-app.onrender.com/api/admin/user-schema

# 3. Update the schema (add number column)
curl -X POST https://your-app.onrender.com/api/admin/update-user-schema

# 4. Verify the update
curl https://your-app.onrender.com/api/admin/user-schema
```

## Troubleshooting

### Database Connection Timeout

If you get a timeout error, the database might be sleeping (free tier). Try again in 30-60 seconds.

### Column Already Exists

If the column already exists, the endpoint will still return success (using `ADD COLUMN IF NOT EXISTS`).

### Permission Denied

Make sure your database user has ALTER TABLE permissions.

---

**Ready to update?** Just deploy and hit the endpoint! 🚀

