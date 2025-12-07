const express = require('express');
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
