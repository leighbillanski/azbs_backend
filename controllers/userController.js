const User = require('../models/User');

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
    const { email, name, password, role } = req.body;
    
    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email, name, and password are required'
      });
    }
    
    const user = await User.create({ email, name, password, role });
    
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
    const { name, password, role } = req.body;
    
    const user = await User.update(email, { name, password, role });
    
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
