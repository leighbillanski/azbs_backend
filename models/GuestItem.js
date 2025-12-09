const pool = require('../config/database');

class GuestItem {
  // Get all claimed items for a guest
  static async findByGuest(guestName, guestNumber) {
    const result = await pool.query(
      `SELECT gi.*, i.item_photo, i.item_link, i.item_count
       FROM guest_items gi
       JOIN items i ON gi.item_name = i.item_name
       WHERE gi.guest_name = $1 AND gi.guest_number = $2
       ORDER BY gi.created_at DESC`,
      [guestName, guestNumber]
    );
    return result.rows;
  }

  // Get all guests who claimed a specific item
  static async findByItem(itemName) {
    const result = await pool.query(
      `SELECT gi.*, g.user_email
       FROM guest_items gi
       JOIN guests g ON gi.guest_name = g.name AND gi.guest_number = g.number
       WHERE gi.item_name = $1
       ORDER BY gi.created_at DESC`,
      [itemName]
    );
    return result.rows;
  }

  // Claim an item (or update quantity if already claimed)
  static async claim(guestName, guestNumber, itemName, quantity = 1) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Check if guest already claimed this item
      const existing = await client.query(
        `SELECT * FROM guest_items 
         WHERE guest_name = $1 AND guest_number = $2 AND item_name = $3`,
        [guestName, guestNumber, itemName]
      );
      
      let result;
      if (existing.rows.length > 0) {
        // Update quantity
        result = await client.query(
          `UPDATE guest_items 
           SET quantity_claimed = quantity_claimed + $1
           WHERE guest_name = $2 AND guest_number = $3 AND item_name = $4
           RETURNING *`,
          [quantity, guestName, guestNumber, itemName]
        );
      } else {
        // Insert new claim
        result = await client.query(
          `INSERT INTO guest_items (guest_name, guest_number, item_name, quantity_claimed)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [guestName, guestNumber, itemName, quantity]
        );
      }
      
      // Update item's claimed_count
      await client.query(
        `UPDATE items 
         SET claimed_count = claimed_count + $1
         WHERE item_name = $2`,
        [quantity, itemName]
      );
      
      await client.query('COMMIT');
      return result.rows[0];
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Unclaim an item (remove guest's claim)
  static async unclaim(guestName, guestNumber, itemName) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Get the quantity that was claimed
      const claim = await client.query(
        `SELECT quantity_claimed FROM guest_items 
         WHERE guest_name = $1 AND guest_number = $2 AND item_name = $3`,
        [guestName, guestNumber, itemName]
      );
      
      if (claim.rows.length === 0) {
        throw new Error('Claim not found');
      }
      
      const quantity = claim.rows[0].quantity_claimed;
      
      // Delete the claim
      const result = await client.query(
        `DELETE FROM guest_items 
         WHERE guest_name = $1 AND guest_number = $2 AND item_name = $3
         RETURNING *`,
        [guestName, guestNumber, itemName]
      );
      
      // Update item's claimed_count
      await client.query(
        `UPDATE items 
         SET claimed_count = claimed_count - $1
         WHERE item_name = $2`,
        [quantity, itemName]
      );
      
      await client.query('COMMIT');
      return result.rows[0];
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get all claims
  static async findAll() {
    const result = await pool.query(
      `SELECT gi.*, i.item_photo, i.item_link
       FROM guest_items gi
       JOIN items i ON gi.item_name = i.item_name
       ORDER BY gi.created_at DESC`
    );
    return result.rows;
  }

  // Delete all claims for a guest
  static async deleteByGuest(guestName, guestNumber) {
    const result = await pool.query(
      `DELETE FROM guest_items 
       WHERE guest_name = $1 AND guest_number = $2
       RETURNING *`,
      [guestName, guestNumber]
    );
    return result.rows;
  }

  // Delete all claims for an item
  static async deleteByItem(itemName) {
    const result = await pool.query(
      `DELETE FROM guest_items 
       WHERE item_name = $1
       RETURNING *`,
      [itemName]
    );
    return result.rows;
  }
}

module.exports = GuestItem;

