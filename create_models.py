#!/usr/bin/env python3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
os.makedirs(os.path.join(BASE_DIR, 'models'), exist_ok=True)

# Create models/User.js
with open(os.path.join(BASE_DIR, 'models', 'User.js'), 'w') as f:
    f.write("""const pool = require('../config/database');

class User {
  // Get all users
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM users ORDER BY created_at DESC'
    );
    return result.rows;
  }

  // Get user by email
  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  // Create new user
  static async create(userData) {
    const { email, name, role, photo } = userData;
    const result = await pool.query(
      `INSERT INTO users (email, name, role, photo) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [email, name, role, photo]
    );
    return result.rows[0];
  }

  // Update user
  static async update(email, userData) {
    const { name, role, photo } = userData;
    const result = await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name), 
           role = COALESCE($2, role), 
           photo = COALESCE($3, photo),
           updated_at = CURRENT_TIMESTAMP
       WHERE email = $4 
       RETURNING *`,
      [name, role, photo, email]
    );
    return result.rows[0];
  }

  // Delete user
  static async delete(email) {
    const result = await pool.query(
      'DELETE FROM users WHERE email = $1 RETURNING *',
      [email]
    );
    return result.rows[0];
  }

  // Get user with their guests
  static async findWithGuests(email) {
    const result = await pool.query(
      `SELECT u.*, 
              json_agg(
                json_build_object(
                  'name', g.name,
                  'number', g.number,
                  'claimed_item', g.claimed_item
                )
              ) FILTER (WHERE g.name IS NOT NULL) as guests
       FROM users u
       LEFT JOIN guests g ON u.email = g.user_email
       WHERE u.email = $1
       GROUP BY u.email`,
      [email]
    );
    return result.rows[0];
  }
}

module.exports = User;
""")
print('✓ models/User.js created')

# Create models/Guest.js
with open(os.path.join(BASE_DIR, 'models', 'Guest.js'), 'w') as f:
    f.write("""const pool = require('../config/database');

class Guest {
  // Get all guests
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM guests ORDER BY created_at DESC'
    );
    return result.rows;
  }

  // Get guest by composite key
  static async findByKey(name, number) {
    const result = await pool.query(
      'SELECT * FROM guests WHERE name = $1 AND number = $2',
      [name, number]
    );
    return result.rows[0];
  }

  // Get all guests for a user
  static async findByUser(userEmail) {
    const result = await pool.query(
      'SELECT * FROM guests WHERE user_email = $1 ORDER BY created_at DESC',
      [userEmail]
    );
    return result.rows;
  }

  // Create new guest
  static async create(guestData) {
    const { name, number, user_email, claimed_item } = guestData;
    const result = await pool.query(
      `INSERT INTO guests (name, number, user_email, claimed_item) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [name, number, user_email, claimed_item]
    );
    return result.rows[0];
  }

  // Update guest
  static async update(name, number, guestData) {
    const { user_email, claimed_item } = guestData;
    const result = await pool.query(
      `UPDATE guests 
       SET user_email = COALESCE($1, user_email), 
           claimed_item = COALESCE($2, claimed_item),
           updated_at = CURRENT_TIMESTAMP
       WHERE name = $3 AND number = $4 
       RETURNING *`,
      [user_email, claimed_item, name, number]
    );
    return result.rows[0];
  }

  // Delete guest
  static async delete(name, number) {
    const result = await pool.query(
      'DELETE FROM guests WHERE name = $1 AND number = $2 RETURNING *',
      [name, number]
    );
    return result.rows[0];
  }

  // Get guest with their claimed items
  static async findWithItems(name, number) {
    const result = await pool.query(
      `SELECT g.*, 
              json_agg(
                json_build_object(
                  'item_name', i.item_name,
                  'item_photo', i.item_photo,
                  'item_link', i.item_link,
                  'claimed', i.claimed,
                  'item_count', i.item_count
                )
              ) FILTER (WHERE i.item_name IS NOT NULL) as items
       FROM guests g
       LEFT JOIN items i ON g.name = i.guest_name AND g.number = i.guest_number
       WHERE g.name = $1 AND g.number = $2
       GROUP BY g.name, g.number`,
      [name, number]
    );
    return result.rows[0];
  }
}

module.exports = Guest;
""")
print('✓ models/Guest.js created')

# Create models/Item.js
with open(os.path.join(BASE_DIR, 'models', 'Item.js'), 'w') as f:
    f.write("""const pool = require('../config/database');

class Item {
  // Get all items
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM items ORDER BY created_at DESC'
    );
    return result.rows;
  }

  // Get item by name
  static async findByName(itemName) {
    const result = await pool.query(
      'SELECT * FROM items WHERE item_name = $1',
      [itemName]
    );
    return result.rows[0];
  }

  // Get all items for a guest
  static async findByGuest(guestName, guestNumber) {
    const result = await pool.query(
      'SELECT * FROM items WHERE guest_name = $1 AND guest_number = $2 ORDER BY created_at DESC',
      [guestName, guestNumber]
    );
    return result.rows;
  }

  // Get all claimed items
  static async findClaimed() {
    const result = await pool.query(
      'SELECT * FROM items WHERE claimed = true ORDER BY created_at DESC'
    );
    return result.rows;
  }

  // Get all unclaimed items
  static async findUnclaimed() {
    const result = await pool.query(
      'SELECT * FROM items WHERE claimed = false ORDER BY created_at DESC'
    );
    return result.rows;
  }

  // Create new item
  static async create(itemData) {
    const { item_name, item_photo, item_link, claimed, item_count, guest_name, guest_number } = itemData;
    const result = await pool.query(
      `INSERT INTO items (item_name, item_photo, item_link, claimed, item_count, guest_name, guest_number) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [item_name, item_photo, item_link, claimed || false, item_count || 0, guest_name, guest_number]
    );
    return result.rows[0];
  }

  // Update item
  static async update(itemName, itemData) {
    const { item_photo, item_link, claimed, item_count, guest_name, guest_number } = itemData;
    const result = await pool.query(
      `UPDATE items 
       SET item_photo = COALESCE($1, item_photo), 
           item_link = COALESCE($2, item_link),
           claimed = COALESCE($3, claimed),
           item_count = COALESCE($4, item_count),
           guest_name = COALESCE($5, guest_name),
           guest_number = COALESCE($6, guest_number),
           updated_at = CURRENT_TIMESTAMP
       WHERE item_name = $7 
       RETURNING *`,
      [item_photo, item_link, claimed, item_count, guest_name, guest_number, itemName]
    );
    return result.rows[0];
  }

  // Claim an item
  static async claim(itemName, guestName, guestNumber) {
    const result = await pool.query(
      `UPDATE items 
       SET claimed = true, 
           guest_name = $1,
           guest_number = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE item_name = $3 
       RETURNING *`,
      [guestName, guestNumber, itemName]
    );
    return result.rows[0];
  }

  // Unclaim an item
  static async unclaim(itemName) {
    const result = await pool.query(
      `UPDATE items 
       SET claimed = false, 
           guest_name = NULL,
           guest_number = NULL,
           updated_at = CURRENT_TIMESTAMP
       WHERE item_name = $1 
       RETURNING *`,
      [itemName]
    );
    return result.rows[0];
  }

  // Delete item
  static async delete(itemName) {
    const result = await pool.query(
      'DELETE FROM items WHERE item_name = $1 RETURNING *',
      [itemName]
    );
    return result.rows[0];
  }
}

module.exports = Item;
""")
print('✓ models/Item.js created')

print('\nAll model files created successfully!')

