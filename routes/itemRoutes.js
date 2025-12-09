const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/itemController');

// Item routes
router.get('/', getAllItems);
router.get('/claimed', getClaimedItems);
router.get('/unclaimed', getUnclaimedItems);
router.get('/guest/:guestName/:guestNumber', getItemsByGuest);
router.get('/:itemName', getItem);
router.get('/:itemName/guests', getItemWithGuests);
router.post('/', createItem);
router.put('/:itemName', updateItem);
router.post('/:itemName/claim', claimItem);
router.post('/:itemName/unclaim', unclaimItem);
router.delete('/:itemName', deleteItem);

module.exports = router;
