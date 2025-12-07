const pool = require('../config/database');

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
