const express = require('express');
const router = express.Router();

const {
  createNewAnnouncement,
  getAllAnnouncements,
  getAnnouncementsByCategory
} = require('../controllers/announcementsController');

// POST: Create a new announcement
router.post('/', createNewAnnouncement);

// GET: Get all announcements
router.get('/', getAllAnnouncements);

// GET: Get announcements by category (e.g., /announcements/holiday)
router.get('/:category', getAnnouncementsByCategory);

module.exports = router;
