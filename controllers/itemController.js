const Item = require('../models/Item');

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
