const pool = require('../config/database');

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
