#!/usr/bin/env python3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
os.makedirs(os.path.join(BASE_DIR, 'controllers'), exist_ok=True)

# Create controllers/userController.js
with open(os.path.join(BASE_DIR, 'controllers', 'userController.js'), 'w') as f:
    f.write("""const User = require('../models/User');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching users'
    });
  }
};

// Get single user
const getUser = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching user'
    });
  }
};

// Get user with guests
const getUserWithGuests = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findWithGuests(email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error getting user with guests:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching user with guests'
    });
  }
};

// Create user
const createUser = async (req, res) => {
  try {
    const { email, name, role, photo } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email and name are required'
      });
    }
    
    const user = await User.create({ email, name, role, photo });
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error while creating user'
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { email } = req.params;
    const { name, role, photo } = req.body;
    
    const user = await User.update(email, { name, role, photo });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating user'
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.delete(email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting user'
    });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  getUserWithGuests,
  createUser,
  updateUser,
  deleteUser
};
""")
print('✓ controllers/userController.js created')

# Create controllers/guestController.js  
with open(os.path.join(BASE_DIR, 'controllers', 'guestController.js'), 'w') as f:
    f.write("""const Guest = require('../models/Guest');

// Get all guests
const getAllGuests = async (req, res) => {
  try {
    const guests = await Guest.findAll();
    res.json({
      success: true,
      count: guests.length,
      data: guests
    });
  } catch (error) {
    console.error('Error getting guests:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching guests'
    });
  }
};

// Get single guest
const getGuest = async (req, res) => {
  try {
    const { name, number } = req.params;
    const guest = await Guest.findByKey(name, number);
    
    if (!guest) {
      return res.status(404).json({
        success: false,
        error: 'Guest not found'
      });
    }
    
    res.json({
      success: true,
      data: guest
    });
  } catch (error) {
    console.error('Error getting guest:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching guest'
    });
  }
};

// Get guest with items
const getGuestWithItems = async (req, res) => {
  try {
    const { name, number } = req.params;
    const guest = await Guest.findWithItems(name, number);
    
    if (!guest) {
      return res.status(404).json({
        success: false,
        error: 'Guest not found'
      });
    }
    
    res.json({
      success: true,
      data: guest
    });
  } catch (error) {
    console.error('Error getting guest with items:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching guest with items'
    });
  }
};

// Get guests by user
const getGuestsByUser = async (req, res) => {
  try {
    const { userEmail } = req.params;
    const guests = await Guest.findByUser(userEmail);
    
    res.json({
      success: true,
      count: guests.length,
      data: guests
    });
  } catch (error) {
    console.error('Error getting guests by user:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching guests'
    });
  }
};

// Create guest
const createGuest = async (req, res) => {
  try {
    const { name, number, user_email, claimed_item } = req.body;
    
    if (!name || !number) {
      return res.status(400).json({
        success: false,
        error: 'Name and number are required'
      });
    }
    
    const guest = await Guest.create({ name, number, user_email, claimed_item });
    
    res.status(201).json({
      success: true,
      data: guest
    });
  } catch (error) {
    console.error('Error creating guest:', error);
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'Guest with this name and number already exists'
      });
    }
    if (error.code === '23503') {
      return res.status(400).json({
        success: false,
        error: 'User email does not exist'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error while creating guest'
    });
  }
};

// Update guest
const updateGuest = async (req, res) => {
  try {
    const { name, number } = req.params;
    const { user_email, claimed_item } = req.body;
    
    const guest = await Guest.update(name, number, { user_email, claimed_item });
    
    if (!guest) {
      return res.status(404).json({
        success: false,
        error: 'Guest not found'
      });
    }
    
    res.json({
      success: true,
      data: guest
    });
  } catch (error) {
    console.error('Error updating guest:', error);
    if (error.code === '23503') {
      return res.status(400).json({
        success: false,
        error: 'User email does not exist'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error while updating guest'
    });
  }
};

// Delete guest
const deleteGuest = async (req, res) => {
  try {
    const { name, number } = req.params;
    const guest = await Guest.delete(name, number);
    
    if (!guest) {
      return res.status(404).json({
        success: false,
        error: 'Guest not found'
      });
    }
    
    res.json({
      success: true,
      data: guest,
      message: 'Guest deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting guest:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting guest'
    });
  }
};

module.exports = {
  getAllGuests,
  getGuest,
  getGuestWithItems,
  getGuestsByUser,
  createGuest,
  updateGuest,
  deleteGuest
};
""")
print('✓ controllers/guestController.js created')

print('\nUser and Guest controllers created successfully!')

