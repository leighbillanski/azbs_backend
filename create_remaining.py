#!/usr/bin/env python3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Create controllers/itemController.js
with open(os.path.join(BASE_DIR, 'controllers', 'itemController.js'), 'w') as f:
    f.write("""const Item = require('../models/Item');

// Get all items
const getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error getting items:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching items'
    });
  }
};

// Get single item
const getItem = async (req, res) => {
  try {
    const { itemName } = req.params;
    const item = await Item.findByName(itemName);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error getting item:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching item'
    });
  }
};

// Get items by guest
const getItemsByGuest = async (req, res) => {
  try {
    const { guestName, guestNumber } = req.params;
    const items = await Item.findByGuest(guestName, guestNumber);
    
    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error getting items by guest:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching items'
    });
  }
};

// Get claimed items
const getClaimedItems = async (req, res) => {
  try {
    const items = await Item.findClaimed();
    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error getting claimed items:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching claimed items'
    });
  }
};

// Get unclaimed items
const getUnclaimedItems = async (req, res) => {
  try {
    const items = await Item.findUnclaimed();
    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error getting unclaimed items:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching unclaimed items'
    });
  }
};

// Create item
const createItem = async (req, res) => {
  try {
    const { item_name, item_photo, item_link, claimed, item_count, guest_name, guest_number } = req.body;
    
    if (!item_name) {
      return res.status(400).json({
        success: false,
        error: 'Item name is required'
      });
    }
    
    const item = await Item.create({ 
      item_name, 
      item_photo, 
      item_link, 
      claimed, 
      item_count, 
      guest_name, 
      guest_number 
    });
    
    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error creating item:', error);
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'Item with this name already exists'
      });
    }
    if (error.code === '23503') {
      return res.status(400).json({
        success: false,
        error: 'Guest does not exist'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error while creating item'
    });
  }
};

// Update item
const updateItem = async (req, res) => {
  try {
    const { itemName } = req.params;
    const { item_photo, item_link, claimed, item_count, guest_name, guest_number } = req.body;
    
    const item = await Item.update(itemName, { 
      item_photo, 
      item_link, 
      claimed, 
      item_count, 
      guest_name, 
      guest_number 
    });
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error updating item:', error);
    if (error.code === '23503') {
      return res.status(400).json({
        success: false,
        error: 'Guest does not exist'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error while updating item'
    });
  }
};

// Claim item
const claimItem = async (req, res) => {
  try {
    const { itemName } = req.params;
    const { guest_name, guest_number } = req.body;
    
    if (!guest_name || !guest_number) {
      return res.status(400).json({
        success: false,
        error: 'Guest name and number are required to claim an item'
      });
    }
    
    const item = await Item.claim(itemName, guest_name, guest_number);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }
    
    res.json({
      success: true,
      data: item,
      message: 'Item claimed successfully'
    });
  } catch (error) {
    console.error('Error claiming item:', error);
    if (error.code === '23503') {
      return res.status(400).json({
        success: false,
        error: 'Guest does not exist'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error while claiming item'
    });
  }
};

// Unclaim item
const unclaimItem = async (req, res) => {
  try {
    const { itemName } = req.params;
    
    const item = await Item.unclaim(itemName);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }
    
    res.json({
      success: true,
      data: item,
      message: 'Item unclaimed successfully'
    });
  } catch (error) {
    console.error('Error unclaiming item:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while unclaiming item'
    });
  }
};

// Delete item
const deleteItem = async (req, res) => {
  try {
    const { itemName } = req.params;
    const item = await Item.delete(itemName);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }
    
    res.json({
      success: true,
      data: item,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting item'
    });
  }
};

module.exports = {
  getAllItems,
  getItem,
  getItemsByGuest,
  getClaimedItems,
  getUnclaimedItems,
  createItem,
  updateItem,
  claimItem,
  unclaimItem,
  deleteItem
};
""")
print('✓ controllers/itemController.js created')

# Create routes directory and files
os.makedirs(os.path.join(BASE_DIR, 'routes'), exist_ok=True)

# Create routes/userRoutes.js
with open(os.path.join(BASE_DIR, 'routes', 'userRoutes.js'), 'w') as f:
    f.write("""const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  getUserWithGuests,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// User routes
router.get('/', getAllUsers);
router.get('/:email', getUser);
router.get('/:email/guests', getUserWithGuests);
router.post('/', createUser);
router.put('/:email', updateUser);
router.delete('/:email', deleteUser);

module.exports = router;
""")
print('✓ routes/userRoutes.js created')

# Create routes/guestRoutes.js
with open(os.path.join(BASE_DIR, 'routes', 'guestRoutes.js'), 'w') as f:
    f.write("""const express = require('express');
const router = express.Router();
const {
  getAllGuests,
  getGuest,
  getGuestWithItems,
  getGuestsByUser,
  createGuest,
  updateGuest,
  deleteGuest
} = require('../controllers/guestController');

// Guest routes
router.get('/', getAllGuests);
router.get('/user/:userEmail', getGuestsByUser);
router.get('/:name/:number', getGuest);
router.get('/:name/:number/items', getGuestWithItems);
router.post('/', createGuest);
router.put('/:name/:number', updateGuest);
router.delete('/:name/:number', deleteGuest);

module.exports = router;
""")
print('✓ routes/guestRoutes.js created')

# Create routes/itemRoutes.js
with open(os.path.join(BASE_DIR, 'routes', 'itemRoutes.js'), 'w') as f:
    f.write("""const express = require('express');
const router = express.Router();
const {
  getAllItems,
  getItem,
  getItemsByGuest,
  getClaimedItems,
  getUnclaimedItems,
  createItem,
  updateItem,
  claimItem,
  unclaimItem,
  deleteItem
} = require('../controllers/itemController');

// Item routes
router.get('/', getAllItems);
router.get('/claimed', getClaimedItems);
router.get('/unclaimed', getUnclaimedItems);
router.get('/guest/:guestName/:guestNumber', getItemsByGuest);
router.get('/:itemName', getItem);
router.post('/', createItem);
router.put('/:itemName', updateItem);
router.post('/:itemName/claim', claimItem);
router.post('/:itemName/unclaim', unclaimItem);
router.delete('/:itemName', deleteItem);

module.exports = router;
""")
print('✓ routes/itemRoutes.js created')

# Create server.js
with open(os.path.join(BASE_DIR, 'server.js'), 'w') as f:
    f.write("""const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { createTables } = require('./config/initDb');
const userRoutes = require('./routes/userRoutes');
const guestRoutes = require('./routes/guestRoutes');
const itemRoutes = require('./routes/itemRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'AZBS Backend API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      guests: '/api/guests',
      items: '/api/items'
    }
  });
});

app.use('/api/users', userRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/items', itemRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    message: err.message
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('Initializing database...');
    await createTables();
    
    app.listen(PORT, () => {
      console.log(`\\n🚀 Server is running on port ${PORT}`);
      console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
      console.log(`\\nAvailable routes:`);
      console.log(`  Users:  http://localhost:${PORT}/api/users`);
      console.log(`  Guests: http://localhost:${PORT}/api/guests`);
      console.log(`  Items:  http://localhost:${PORT}/api/items\\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
""")
print('✓ server.js created')

print('\nAll remaining files created successfully!')

