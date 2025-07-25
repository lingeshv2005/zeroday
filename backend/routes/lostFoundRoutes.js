const express = require('express');
const router = express.Router();

const {
  createLostFound,
  getAllLostFound,
  getLostFoundByType
} = require('../controllers/lostFoundController');

// POST /api/lostfound
router.post('/', createLostFound);

// GET /api/lostfound
router.get('/', getAllLostFound);

// GET /api/lostfound/:type (type = 'lost' or 'found')
router.get('/:type', getLostFoundByType);

module.exports = router;
