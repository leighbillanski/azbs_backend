const express = require('express');
const router = express.Router();
const {
  updateUserSchema,
  checkDatabase,
  getUserSchema,
  migrateToNewSchema,
  addGuestGoingColumn
} = require('../controllers/adminController');

// Admin routes for database management
router.post('/update-user-schema', updateUserSchema);
router.post('/migrate-schema', migrateToNewSchema);
router.post('/add-guest-going', addGuestGoingColumn);
router.get('/check-database', checkDatabase);
router.get('/user-schema', getUserSchema);

module.exports = router;

