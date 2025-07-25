const express =require('express');
const router = express.Router();
const  compileCode = require( '../controllers/complierController.js');

// Sample GET route for testing
router.get('/status', (req, res) => {
  res.json({ status: 'Editor backend is running' });
});
router.post('/compile', compileCode);

module.exports = router;