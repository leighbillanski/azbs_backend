const pool = require('../config/database');

// Update database schema - Add number column to users table
const updateUserSchema = async (req, res) => {
  const client = await pool.connect();
  
  try {
    console.log('Starting database schema update...');
    
    // Add number column to users table
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS number VARCHAR(50);
    `);
    
    // Verify the column was added
    const result = await client.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);
    
    console.log('Users table updated successfully');
    
    res.json({
      success: true,
      message: 'Users table updated successfully - number column added',
      schema: result.rows.map(col => ({
        column: col.column_name,
        type: col.data_type,
        max_length: col.character_maximum_length
      }))
    });
    
  } catch (error) {
    console.error('Error updating schema:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update database schema',
      details: error.message
    });
  } finally {
    client.release();
  }
};

// Health check for database connection
const checkDatabase = async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as time, version() as version');
    
    res.json({
      success: true,
      message: 'Database is connected',
      time: result.rows[0].time,
      version: result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      success: false,
      error: 'Database connection failed',
      details: error.message
    });
  }
};

// Get current database schema for users table
const getUserSchema = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type, character_maximum_length, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);
    
    res.json({
      success: true,
      table: 'users',
      columns: result.rows.map(col => ({
        name: col.column_name,
        type: col.data_type,
        max_length: col.character_maximum_length,
        nullable: col.is_nullable
      }))
    });
  } catch (error) {
    console.error('Error fetching schema:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch schema',
      details: error.message
    });
  }
};

module.exports = {
  updateUserSchema,
  checkDatabase,
  getUserSchema
};

