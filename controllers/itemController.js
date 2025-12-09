const Item = require('../models/Item');
const GuestItem = require('../models/GuestItem');

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

// Get item with list of guests who claimed it
const getItemWithGuests = async (req, res) => {
  try {
    const { itemName } = req.params;
    const item = await Item.findWithGuests(itemName);
    
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
    console.error('Error getting item with guests:', error);
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
    const { item_name, item_photo, item_link, item_count } = req.body;
    
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
      item_count
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
    const { item_photo, item_link, item_count } = req.body;
    
    const item = await Item.update(itemName, { 
      item_photo, 
      item_link, 
      item_count
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
    res.status(500).json({
      success: false,
      error: 'Server error while updating item'
    });
  }
};

// Claim item (using GuestItem junction table)
const claimItem = async (req, res) => {
  try {
    const { itemName } = req.params;
    const { guest_name, guest_number, quantity } = req.body;
    
    if (!guest_name || !guest_number) {
      return res.status(400).json({
        success: false,
        error: 'Guest name and number are required to claim an item'
      });
    }
    
    // Check if item exists
    const item = await Item.findByName(itemName);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }
    
    // Check availability
    const availability = await Item.getAvailability(itemName);
    const requestedQty = quantity || 1;
    
    if (availability.available < requestedQty) {
      return res.status(400).json({
        success: false,
        error: `Not enough items available. Only ${availability.available} remaining.`
      });
    }
    
    const claim = await GuestItem.claim(guest_name, guest_number, itemName, requestedQty);
    
    res.json({
      success: true,
      data: claim,
      message: 'Item claimed successfully'
    });
  } catch (error) {
    console.error('Error claiming item:', error);
    if (error.code === '23503') {
      return res.status(400).json({
        success: false,
        error: 'Guest or item does not exist'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error while claiming item'
    });
  }
};

// Unclaim item (remove from GuestItem junction table)
const unclaimItem = async (req, res) => {
  try {
    const { itemName } = req.params;
    const { guest_name, guest_number } = req.body;
    
    if (!guest_name || !guest_number) {
      return res.status(400).json({
        success: false,
        error: 'Guest name and number are required to unclaim an item'
      });
    }
    
    const claim = await GuestItem.unclaim(guest_name, guest_number, itemName);
    
    res.json({
      success: true,
      data: claim,
      message: 'Item unclaimed successfully'
    });
  } catch (error) {
    console.error('Error unclaiming item:', error);
    if (error.message === 'Claim not found') {
      return res.status(404).json({
        success: false,
        error: 'No claim found for this guest and item'
      });
    }
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
  getItemWithGuests,
  getItemsByGuest,
  getClaimedItems,
  getUnclaimedItems,
  createItem,
  updateItem,
  claimItem,
  unclaimItem,
  deleteItem
};
