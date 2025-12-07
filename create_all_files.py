#!/usr/bin/env python3
import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Update package.json
pkg_path = os.path.join(BASE_DIR, 'package.json')
with open(pkg_path, 'r') as f:
    pkg = json.load(f)

pkg['main'] = 'server.js'
pkg['scripts'] = {
    'start': 'node server.js',
    'dev': 'nodemon server.js'
}
pkg['description'] = 'Backend API for AZBS application with PostgreSQL'

with open(pkg_path, 'w') as f:
    json.dump(pkg, f, indent=2)

print('✓ package.json updated')

# Create .env.example
with open(os.path.join(BASE_DIR, '.env.example'), 'w') as f:
    f.write("""PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=azbs_db
""")
print('✓ .env.example created')

# Create config/database.js
os.makedirs(os.path.join(BASE_DIR, 'config'), exist_ok=True)
with open(os.path.join(BASE_DIR, 'config', 'database.js'), 'w') as f:
    f.write("""const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'azbs_db',
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
""")
print('✓ config/database.js created')

# Create config/initDb.js
with open(os.path.join(BASE_DIR, 'config', 'initDb.js'), 'w') as f:
    f.write("""const pool = require('./database');

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create User table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        email VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(100),
        photo TEXT,
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
        claimed_item VARCHAR(255),
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
        item_photo TEXT,
        item_link TEXT,
        claimed BOOLEAN DEFAULT FALSE,
        item_count INTEGER DEFAULT 0,
        guest_name VARCHAR(255),
        guest_number VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (guest_name, guest_number) REFERENCES guests(name, number) ON DELETE SET NULL
      );
    `);
    console.log('✓ Items table created/verified');

    // Create indexes for better query performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_guests_user_email ON guests(user_email);
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_items_guest ON items(guest_name, guest_number);
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
""")
print('✓ config/initDb.js created')

print('\nAll configuration files created successfully!')

