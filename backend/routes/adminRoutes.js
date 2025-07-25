const express = require('express');
const router = express.Router();
const {
  verifyTokenAndStoreAdmin,
  getAdminProfile,
  updateAdminProfile
} = require('../controllers/adminController');

router.post('/auth', verifyTokenAndStoreAdmin);
router.get('/:uid', getAdminProfile);
router.put('/:uid', updateAdminProfile);

module.exports = router;
