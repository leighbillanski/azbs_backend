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

  // Get all items for a guest (through guest_items junction table)
  static async findByGuest(guestName, guestNumber) {
    const result = await pool.query(
      `SELECT i.*, gi.quantity_claimed, gi.created_at as claimed_at
       FROM items i
       JOIN guest_items gi ON i.item_name = gi.item_name
       WHERE gi.guest_name = $1 AND gi.guest_number = $2
       ORDER BY gi.created_at DESC`,
      [guestName, guestNumber]
    );
    return result.rows;
  }

  // Get all claimed items (items with claimed_count > 0)
  static async findClaimed() {
    const result = await pool.query(
      'SELECT * FROM items WHERE claimed_count > 0 ORDER BY created_at DESC'
    );
    return result.rows;
  }

  // Get all unclaimed items (items with claimed_count = 0)
  static async findUnclaimed() {
    const result = await pool.query(
      'SELECT * FROM items WHERE claimed_count = 0 ORDER BY created_at DESC'
    );
    return result.rows;
  }

  // Get item with list of guests who claimed it
  static async findWithGuests(itemName) {
    const result = await pool.query(
      `SELECT i.*,
              json_agg(
                json_build_object(
                  'guest_name', gi.guest_name,
                  'guest_number', gi.guest_number,
                  'quantity_claimed', gi.quantity_claimed,
                  'claimed_at', gi.created_at
                )
              ) FILTER (WHERE gi.guest_name IS NOT NULL) as claimed_by
       FROM items i
       LEFT JOIN guest_items gi ON i.item_name = gi.item_name
       WHERE i.item_name = $1
       GROUP BY i.item_name`,
      [itemName]
    );
    return result.rows[0];
  }

  // Create new item
  static async create(itemData) {
    const { item_name, item_photo, item_link, item_count } = itemData;
    const result = await pool.query(
      `INSERT INTO items (item_name, item_photo, item_link, item_count, claimed_count) 
       VALUES ($1, $2, $3, $4, 0) 
       RETURNING *`,
      [item_name, item_photo, item_link, item_count || 0]
    );
    return result.rows[0];
  }

  // Update item
  static async update(itemName, itemData) {
    const { item_photo, item_link, item_count } = itemData;
    const result = await pool.query(
      `UPDATE items 
       SET item_photo = COALESCE($1, item_photo), 
           item_link = COALESCE($2, item_link),
           item_count = COALESCE($3, item_count),
           updated_at = CURRENT_TIMESTAMP
       WHERE item_name = $4 
       RETURNING *`,
      [item_photo, item_link, item_count, itemName]
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

  // Get availability (how many still available to claim)
  static async getAvailability(itemName) {
    const result = await pool.query(
      'SELECT item_count, claimed_count, (item_count - claimed_count) as available FROM items WHERE item_name = $1',
      [itemName]
    );
    return result.rows[0];
  }
}

module.exports = Item;
