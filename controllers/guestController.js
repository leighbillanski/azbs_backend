const Guest = require('../models/Guest');

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
    const { name, number, user_email } = req.body;
    
    if (!name || !number) {
      return res.status(400).json({
        success: false,
        error: 'Name and number are required'
      });
    }
    
    const guest = await Guest.create({ name, number, user_email });
    
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
    const { user_email } = req.body;
    
    const guest = await Guest.update(name, number, { user_email });
    
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
