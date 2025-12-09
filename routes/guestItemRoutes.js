const express = require('express');
const router = express.Router();
const {
  getAllClaims,
  getClaimsByGuest,
  getClaimsByItem,
  createClaim,
  updateClaim,
  deleteClaim,
  deleteClaimsByGuest,
  deleteClaimsByItem
} = require('../controllers/guestItemController');

// Guest-Item (Claims) routes
router.get('/', getAllClaims);
router.get('/guest/:guestName/:guestNumber', getClaimsByGuest);
router.get('/item/:itemName', getClaimsByItem);
router.post('/', createClaim);
router.put('/:guestName/:guestNumber/:itemName', updateClaim);
router.delete('/:guestName/:guestNumber/:itemName', deleteClaim);
router.delete('/guest/:guestName/:guestNumber', deleteClaimsByGuest);
router.delete('/item/:itemName', deleteClaimsByItem);

module.exports = router;

