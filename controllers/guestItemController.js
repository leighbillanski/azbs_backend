const GuestItem = require('../models/GuestItem');

// Get all claims
const getAllClaims = async (req, res) => {
  try {
    const claims = await GuestItem.findAll();
    res.json({
      success: true,
      count: claims.length,
      data: claims
    });
  } catch (error) {
    console.error('Error getting claims:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching claims'
    });
  }
};

// Get all items claimed by a specific guest
const getClaimsByGuest = async (req, res) => {
  try {
    const { guestName, guestNumber } = req.params;
    const claims = await GuestItem.findByGuest(guestName, guestNumber);
    
    res.json({
      success: true,
      count: claims.length,
      data: claims
    });
  } catch (error) {
    console.error('Error getting claims by guest:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching guest claims'
    });
  }
};

// Get all guests who claimed a specific item
const getClaimsByItem = async (req, res) => {
  try {
    const { itemName } = req.params;
    const claims = await GuestItem.findByItem(itemName);
    
    res.json({
      success: true,
      count: claims.length,
      data: claims
    });
  } catch (error) {
    console.error('Error getting claims by item:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching item claims'
    });
  }
};

// Create a claim (guest claims an item)
const createClaim = async (req, res) => {
  try {
    const { guest_name, guest_number, item_name, quantity } = req.body;
    
    if (!guest_name || !guest_number || !item_name) {
      return res.status(400).json({
        success: false,
        error: 'Guest name, guest number, and item name are required'
      });
    }
    
    const claim = await GuestItem.claim(
      guest_name, 
      guest_number, 
      item_name, 
      quantity || 1
    );
    
    res.status(201).json({
      success: true,
      data: claim,
      message: 'Item claimed successfully'
    });
  } catch (error) {
    console.error('Error creating claim:', error);
    if (error.code === '23503') {
      return res.status(400).json({
        success: false,
        error: 'Guest or item does not exist'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error while creating claim'
    });
  }
};

// Update a claim (change quantity)
const updateClaim = async (req, res) => {
  try {
    const { guestName, guestNumber, itemName } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'Valid quantity is required'
      });
    }
    
    // For now, we'll unclaim and reclaim with new quantity
    // This maintains the claimed_count properly
    await GuestItem.unclaim(guestName, guestNumber, itemName);
    const claim = await GuestItem.claim(guestName, guestNumber, itemName, quantity);
    
    res.json({
      success: true,
      data: claim,
      message: 'Claim quantity updated successfully'
    });
  } catch (error) {
    console.error('Error updating claim:', error);
    if (error.message === 'Claim not found') {
      return res.status(404).json({
        success: false,
        error: 'Claim not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error while updating claim'
    });
  }
};

// Delete a claim (unclaim an item)
const deleteClaim = async (req, res) => {
  try {
    const { guestName, guestNumber, itemName } = req.params;
    
    const claim = await GuestItem.unclaim(guestName, guestNumber, itemName);
    
    res.json({
      success: true,
      data: claim,
      message: 'Item unclaimed successfully'
    });
  } catch (error) {
    console.error('Error deleting claim:', error);
    if (error.message === 'Claim not found') {
      return res.status(404).json({
        success: false,
        error: 'Claim not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error while deleting claim'
    });
  }
};

// Delete all claims for a guest
const deleteClaimsByGuest = async (req, res) => {
  try {
    const { guestName, guestNumber } = req.params;
    const claims = await GuestItem.deleteByGuest(guestName, guestNumber);
    
    res.json({
      success: true,
      count: claims.length,
      data: claims,
      message: `Deleted ${claims.length} claim(s) for guest`
    });
  } catch (error) {
    console.error('Error deleting claims by guest:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting guest claims'
    });
  }
};

// Delete all claims for an item
const deleteClaimsByItem = async (req, res) => {
  try {
    const { itemName } = req.params;
    const claims = await GuestItem.deleteByItem(itemName);
    
    res.json({
      success: true,
      count: claims.length,
      data: claims,
      message: `Deleted ${claims.length} claim(s) for item`
    });
  } catch (error) {
    console.error('Error deleting claims by item:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting item claims'
    });
  }
};

module.exports = {
  getAllClaims,
  getClaimsByGuest,
  getClaimsByItem,
  createClaim,
  updateClaim,
  deleteClaim,
  deleteClaimsByGuest,
  deleteClaimsByItem
};

