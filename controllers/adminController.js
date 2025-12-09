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

// Migrate to new schema (remove claimed_item from guests, restructure items, add guest_items table)
const migrateToNewSchema = async (req, res) => {
  const client = await pool.connect();
  
  try {
    console.log('Starting database schema migration...');
    await client.query('BEGIN');
    
    // Step 1: Create guest_items junction table if it doesn't exist
    console.log('1. Creating guest_items junction table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS guest_items (
        guest_name VARCHAR(255) NOT NULL,
        guest_number VARCHAR(50) NOT NULL,
        item_name VARCHAR(255) NOT NULL,
        quantity_claimed INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (guest_name, guest_number, item_name),
        FOREIGN KEY (guest_name, guest_number) REFERENCES guests(name, number) ON DELETE CASCADE,
        FOREIGN KEY (item_name) REFERENCES items(item_name) ON DELETE CASCADE
      );
    `);
    
    // Step 2: Add claimed_count to items if it doesn't exist
    console.log('2. Adding claimed_count column to items table...');
    await client.query(`
      ALTER TABLE items 
      ADD COLUMN IF NOT EXISTS claimed_count INTEGER DEFAULT 0;
    `);
    
    // Step 3: Drop old columns from items table
    console.log('3. Removing old columns from items table...');
    await client.query(`
      ALTER TABLE items 
      DROP COLUMN IF EXISTS claimed CASCADE,
      DROP COLUMN IF EXISTS guest_name CASCADE,
      DROP COLUMN IF EXISTS guest_number CASCADE;
    `);
    
    // Step 4: Remove claimed_item from guests table
    console.log('4. Removing claimed_item column from guests table...');
    await client.query(`
      ALTER TABLE guests 
      DROP COLUMN IF EXISTS claimed_item CASCADE;
    `);
    
    // Step 5: Create indexes
    console.log('5. Creating indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_guest_items_guest ON guest_items(guest_name, guest_number);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_guest_items_item ON guest_items(item_name);
    `);
    
    await client.query('COMMIT');
    
    // Get updated schemas
    const guestsSchema = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'guests'
      ORDER BY ordinal_position;
    `);
    
    const itemsSchema = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'items'
      ORDER BY ordinal_position;
    `);
    
    const guestItemsSchema = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'guest_items'
      ORDER BY ordinal_position;
    `);
    
    console.log('Migration completed successfully');
    
    res.json({
      success: true,
      message: 'Database schema migrated successfully',
      changes: {
        guests: 'Removed claimed_item column',
        items: 'Removed claimed, guest_name, guest_number; Added claimed_count',
        guest_items: 'Created new junction table'
      },
      schemas: {
        guests: guestsSchema.rows,
        items: itemsSchema.rows,
        guest_items: guestItemsSchema.rows
      }
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to migrate database schema',
      details: error.message
    });
  } finally {
    client.release();
  }
};

// Add going column to guests table
const addGuestGoingColumn = async (req, res) => {
  const client = await pool.connect();
  
  try {
    console.log('Adding going column to guests table...');
    
    await client.query(`
      ALTER TABLE guests 
      ADD COLUMN IF NOT EXISTS going BOOLEAN DEFAULT TRUE;
    `);
    
    // Verify the column was added
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'guests'
      ORDER BY ordinal_position;
    `);
    
    console.log('Going column added successfully');
    
    res.json({
      success: true,
      message: 'Guests table updated successfully - going column added',
      schema: result.rows
    });
    
  } catch (error) {
    console.error('Error adding going column:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add going column',
      details: error.message
    });
  } finally {
    client.release();
  }
};

module.exports = {
  updateUserSchema,
  checkDatabase,
  getUserSchema,
  migrateToNewSchema,
  addGuestGoingColumn
};

