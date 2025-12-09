# Claims API Documentation

## Overview

The Claims API (Guest-Items API) manages the many-to-many relationship between guests and items. It allows you to track which guests claimed which items and in what quantities.

## Base URL

```
/api/claims
```

## Endpoints

### 1. Get All Claims

**Endpoint:** `GET /api/claims`

**Description:** Retrieve all claims in the system

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "guest_name": "Kaylynn Johnson",
      "guest_number": "123",
      "item_name": "Baby Thermometer",
      "quantity_claimed": 2,
      "created_at": "2025-12-09T10:00:00.000Z",
      "item_photo": "https://example.com/photo.jpg",
      "item_link": "https://example.com/item"
    }
  ]
}
```

**Example:**
```bash
curl https://your-app.onrender.com/api/claims
```

---

### 2. Get Claims by Guest

**Endpoint:** `GET /api/claims/guest/:guestName/:guestNumber`

**Description:** Get all items claimed by a specific guest

**Parameters:**
- `guestName` (path) - Guest's name
- `guestNumber` (path) - Guest's number

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "guest_name": "Kaylynn Johnson",
      "guest_number": "123",
      "item_name": "Baby Thermometer",
      "quantity_claimed": 2,
      "created_at": "2025-12-09T10:00:00.000Z",
      "item_photo": "https://example.com/photo.jpg",
      "item_link": "https://example.com/item",
      "item_count": 10
    }
  ]
}
```

**Example:**
```bash
curl https://your-app.onrender.com/api/claims/guest/Kaylynn%20Johnson/123
```

---

### 3. Get Claims by Item

**Endpoint:** `GET /api/claims/item/:itemName`

**Description:** Get all guests who claimed a specific item

**Parameters:**
- `itemName` (path) - Item name

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "guest_name": "Kaylynn Johnson",
      "guest_number": "123",
      "item_name": "Baby Thermometer",
      "quantity_claimed": 2,
      "created_at": "2025-12-09T10:00:00.000Z",
      "user_email": "kayla@example.com"
    },
    {
      "guest_name": "John Doe",
      "guest_number": "456",
      "item_name": "Baby Thermometer",
      "quantity_claimed": 1,
      "created_at": "2025-12-09T11:00:00.000Z",
      "user_email": "john@example.com"
    }
  ]
}
```

**Example:**
```bash
curl https://your-app.onrender.com/api/claims/item/Baby%20Thermometer
```

---

### 4. Create a Claim

**Endpoint:** `POST /api/claims`

**Description:** Create a new claim (guest claims an item)

**Request Body:**
```json
{
  "guest_name": "Kaylynn Johnson",
  "guest_number": "123",
  "item_name": "Baby Thermometer",
  "quantity": 2
}
```

**Required Fields:**
- `guest_name` (string)
- `guest_number` (string)
- `item_name` (string)
- `quantity` (integer, optional, default: 1)

**Response:**
```json
{
  "success": true,
  "data": {
    "guest_name": "Kaylynn Johnson",
    "guest_number": "123",
    "item_name": "Baby Thermometer",
    "quantity_claimed": 2,
    "created_at": "2025-12-09T10:00:00.000Z"
  },
  "message": "Item claimed successfully"
}
```

**Example:**
```bash
curl -X POST https://your-app.onrender.com/api/claims \
  -H "Content-Type: application/json" \
  -d '{
    "guest_name": "Kaylynn Johnson",
    "guest_number": "123",
    "item_name": "Baby Thermometer",
    "quantity": 2
  }'
```

**Notes:**
- If the guest already claimed this item, the quantity will be added to the existing claim
- Automatically updates the item's `claimed_count`
- Creates entry in `guest_items` junction table

---

### 5. Update Claim Quantity

**Endpoint:** `PUT /api/claims/:guestName/:guestNumber/:itemName`

**Description:** Update the quantity of an existing claim

**Parameters:**
- `guestName` (path) - Guest's name
- `guestNumber` (path) - Guest's number
- `itemName` (path) - Item name

**Request Body:**
```json
{
  "quantity": 5
}
```

**Required Fields:**
- `quantity` (integer, must be > 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "guest_name": "Kaylynn Johnson",
    "guest_number": "123",
    "item_name": "Baby Thermometer",
    "quantity_claimed": 5,
    "created_at": "2025-12-09T10:00:00.000Z"
  },
  "message": "Claim quantity updated successfully"
}
```

**Example:**
```bash
curl -X PUT https://your-app.onrender.com/api/claims/Kaylynn%20Johnson/123/Baby%20Thermometer \
  -H "Content-Type: application/json" \
  -d '{"quantity": 5}'
```

**Notes:**
- Replaces the existing quantity with the new value
- Updates item's `claimed_count` accordingly

---

### 6. Delete a Claim

**Endpoint:** `DELETE /api/claims/:guestName/:guestNumber/:itemName`

**Description:** Remove a specific claim (unclaim an item)

**Parameters:**
- `guestName` (path) - Guest's name
- `guestNumber` (path) - Guest's number
- `itemName` (path) - Item name

**Response:**
```json
{
  "success": true,
  "data": {
    "guest_name": "Kaylynn Johnson",
    "guest_number": "123",
    "item_name": "Baby Thermometer",
    "quantity_claimed": 2
  },
  "message": "Item unclaimed successfully"
}
```

**Example:**
```bash
curl -X DELETE https://your-app.onrender.com/api/claims/Kaylynn%20Johnson/123/Baby%20Thermometer
```

**Notes:**
- Removes the entry from `guest_items` table
- Automatically updates the item's `claimed_count`

---

### 7. Delete All Claims by Guest

**Endpoint:** `DELETE /api/claims/guest/:guestName/:guestNumber`

**Description:** Remove all claims for a specific guest

**Parameters:**
- `guestName` (path) - Guest's name
- `guestNumber` (path) - Guest's number

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "guest_name": "Kaylynn Johnson",
      "guest_number": "123",
      "item_name": "Baby Thermometer",
      "quantity_claimed": 2
    },
    {
      "guest_name": "Kaylynn Johnson",
      "guest_number": "123",
      "item_name": "Bottle Warmer",
      "quantity_claimed": 1
    }
  ],
  "message": "Deleted 3 claim(s) for guest"
}
```

**Example:**
```bash
curl -X DELETE https://your-app.onrender.com/api/claims/guest/Kaylynn%20Johnson/123
```

**Use Case:** When a guest cancels all their claims

---

### 8. Delete All Claims for Item

**Endpoint:** `DELETE /api/claims/item/:itemName`

**Description:** Remove all claims for a specific item

**Parameters:**
- `itemName` (path) - Item name

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "guest_name": "Kaylynn Johnson",
      "guest_number": "123",
      "item_name": "Baby Thermometer",
      "quantity_claimed": 2
    },
    {
      "guest_name": "John Doe",
      "guest_number": "456",
      "item_name": "Baby Thermometer",
      "quantity_claimed": 1
    }
  ],
  "message": "Deleted 2 claim(s) for item"
}
```

**Example:**
```bash
curl -X DELETE https://your-app.onrender.com/api/claims/item/Baby%20Thermometer
```

**Use Case:** When an item is no longer available or removed from registry

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Guest name, guest number, and item name are required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Claim not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Server error while creating claim"
}
```

---

## Common Use Cases

### 1. Guest Claims an Item
```javascript
// User clicks "I'll bring this" button
POST /api/claims
{
  "guest_name": "Kaylynn Johnson",
  "guest_number": "123",
  "item_name": "Baby Thermometer",
  "quantity": 2
}
```

### 2. View What a Guest Claimed
```javascript
// Show user's claimed items
GET /api/claims/guest/Kaylynn%20Johnson/123
```

### 3. View Who's Bringing an Item
```javascript
// Show who claimed this item
GET /api/claims/item/Baby%20Thermometer
```

### 4. Guest Changes Quantity
```javascript
// Update from 2 to 3
PUT /api/claims/Kaylynn%20Johnson/123/Baby%20Thermometer
{
  "quantity": 3
}
```

### 5. Guest Unclaims an Item
```javascript
// Remove claim
DELETE /api/claims/Kaylynn%20Johnson/123/Baby%20Thermometer
```

---

## Database Structure

The Claims API operates on the `guest_items` junction table:

```sql
CREATE TABLE guest_items (
  guest_name VARCHAR(255) NOT NULL,
  guest_number VARCHAR(50) NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  quantity_claimed INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (guest_name, guest_number, item_name),
  FOREIGN KEY (guest_name, guest_number) REFERENCES guests(name, number) ON DELETE CASCADE,
  FOREIGN KEY (item_name) REFERENCES items(item_name) ON DELETE CASCADE
);
```

**Key Features:**
- Composite primary key ensures one claim per guest-item pair
- Foreign keys maintain referential integrity
- Cascading deletes clean up claims when guests or items are deleted
- `quantity_claimed` tracks how many the guest is bringing

---

## Testing

```bash
# 1. Create a claim
curl -X POST http://localhost:5000/api/claims \
  -H "Content-Type: application/json" \
  -d '{"guest_name":"Test","guest_number":"123","item_name":"Test Item","quantity":2}'

# 2. Get all claims
curl http://localhost:5000/api/claims

# 3. Get guest's claims
curl http://localhost:5000/api/claims/guest/Test/123

# 4. Get item's claims
curl http://localhost:5000/api/claims/item/Test%20Item

# 5. Update quantity
curl -X PUT http://localhost:5000/api/claims/Test/123/Test%20Item \
  -H "Content-Type: application/json" \
  -d '{"quantity":5}'

# 6. Delete claim
curl -X DELETE http://localhost:5000/api/claims/Test/123/Test%20Item
```

---

## Related Endpoints

- **Items API:** `/api/items` - Manage items
- **Guests API:** `/api/guests` - Manage guests
- **Item with Guests:** `GET /api/items/:itemName/guests` - Alternative way to see who claimed an item
- **Guest with Items:** `GET /api/guests/:name/:number/items` - Alternative way to see what a guest claimed

---

**The Claims API provides complete control over the guest-item relationship!** 🎉

