const pool = require('../config/database');

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
    const { name, number, user_email, going } = guestData;
    const result = await pool.query(
      `INSERT INTO guests (name, number, user_email, going) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [name, number, user_email, going !== undefined ? going : true]
    );
    return result.rows[0];
  }

  // Update guest
  static async update(name, number, guestData) {
    const { user_email, going } = guestData;
    const result = await pool.query(
      `UPDATE guests 
       SET user_email = COALESCE($1, user_email), 
           going = COALESCE($2, going),
           updated_at = CURRENT_TIMESTAMP
       WHERE name = $3 AND number = $4 
       RETURNING *`,
      [user_email, going, name, number]
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
                  'item_name', gi.item_name,
                  'quantity_claimed', gi.quantity_claimed,
                  'item_link', i.item_link,
                  'item_count', i.item_count,
                  'claimed_at', gi.created_at
                )
              ) FILTER (WHERE gi.item_name IS NOT NULL) as claimed_items
       FROM guests g
       LEFT JOIN guest_items gi ON g.name = gi.guest_name AND g.number = gi.guest_number
       LEFT JOIN items i ON gi.item_name = i.item_name
       WHERE g.name = $1 AND g.number = $2
       GROUP BY g.name, g.number`,
      [name, number]
    );
    return result.rows[0];
  }
}

module.exports = Guest;
