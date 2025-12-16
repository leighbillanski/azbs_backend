const pool = require('./database');

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create User table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        email VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        number VARCHAR(50),
        password VARCHAR(255) NOT NULL,
        role VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Users table created/verified');

    // Create Guest table
    await client.query(`
      CREATE TABLE IF NOT EXISTS guests (
        name VARCHAR(255) NOT NULL,
        number VARCHAR(50) NOT NULL,
        user_email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
        going BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (name, number)
      );
    `);
    console.log('✓ Guests table created/verified');

    // Create Item table
    await client.query(`
      CREATE TABLE IF NOT EXISTS items (
        item_name VARCHAR(255) PRIMARY KEY,
        item_link TEXT,
        item_count INTEGER DEFAULT 0,
        claimed_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Items table created/verified');

    // Create Guest_Items junction table (tracks who claimed what)
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
    console.log('✓ Guest_Items junction table created/verified');

    // Create indexes for better query performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_guests_user_email ON guests(user_email);
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_guest_items_guest ON guest_items(guest_name, guest_number);
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_guest_items_item ON guest_items(item_name);
    `);
    
    await client.query('COMMIT');
    console.log('✓ Database initialization complete');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { createTables };
