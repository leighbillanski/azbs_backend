const express = require('express');
const router = express.Router();
const {
  updateUserSchema,
  checkDatabase,
  getUserSchema
} = require('../controllers/adminController');

// Admin routes for database management
router.post('/update-user-schema', updateUserSchema);
router.get('/check-database', checkDatabase);
router.get('/user-schema', getUserSchema);

module.exports = router;

