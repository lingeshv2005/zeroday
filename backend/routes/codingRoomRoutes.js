const express =require( 'express');
const {
  createRoom,
  getRooms,
  getRoomById,
  addParticipant,
  updateCode,
  logExecution,
  deleteRoom
} =require( '../controllers/codingRoomController.js'); // Updated path based on Firebase logic

const router = express.Router();

// Create a new coding room
router.post('/', createRoom);

// Get rooms associated with a user (by UID)
router.get('/', getRooms);

// Get a specific room by roomId
router.get('/:roomId', getRoomById);

// Add participant to a room
router.post('/:roomId/participant', addParticipant);

// Update code content
router.put('/:roomId/code', updateCode);

// Log code execution result
router.post('/:roomId/execute', logExecution);

// Delete room (only admin/creator)
router.delete('/:roomId', deleteRoom);

module.exports =  router ;
