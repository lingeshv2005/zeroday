const express = require('express');
const router = express.Router();

const {
  verifyTokenAndStoreStudent,
  getStudentProfile,
  updateStudentProfile,
  searchStudentsByName
} = require('../controllers/studentController');

// @route   POST /api/students/auth
// @desc    Verify Firebase token and auto create/update student
router.post('/auth', verifyTokenAndStoreStudent);

// @route   GET /api/students/profile/:uid
// @desc    Get student profile by UID
router.get('/profile/:uid', getStudentProfile);

// @route   PUT /api/students/:Uid
// @desc    Update student profile
router.put('/:uid', updateStudentProfile);

router.get('/search', searchStudentsByName);


module.exports = router;
