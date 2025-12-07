const express = require('express');
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
