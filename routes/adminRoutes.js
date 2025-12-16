const express = require('express');
const router = express.Router();
const {
  updateUserSchema,
  checkDatabase,
  getUserSchema,
  migrateToNewSchema,
  addGuestGoingColumn,
  updateGuestGoingDefault,
  removeItemPhotoColumn,
  setGoingDefaultTrue
} = require('../controllers/adminController');

// Admin routes for database management
router.post('/update-user-schema', updateUserSchema);
router.post('/migrate-schema', migrateToNewSchema);
router.post('/add-guest-going', addGuestGoingColumn);
router.post('/update-going-default', updateGuestGoingDefault);
router.post('/set-going-default-true', setGoingDefaultTrue);
router.post('/remove-item-photo', removeItemPhotoColumn);
router.get('/check-database', checkDatabase);
router.get('/user-schema', getUserSchema);

module.exports = router;

