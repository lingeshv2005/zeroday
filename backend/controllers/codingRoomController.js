const { v4: uuidv4 } = require('uuid');
const admin = require('../firebase/firebaseConfig');
const  {createCodingRoom}  = require('../models/codingRoom');

const db = admin.firestore();
const codingRoomsCollection = db.collection('codingRooms');

// ✅ Create Room
const createRoom = async (req, res) => {
  try {
    const { roomName, admin: adminUid, language = 'javascript', accessType = 'private' } = req.body;

    if (!roomName || !adminUid) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const roomId = uuidv4();
    const accessLink = roomId;

    const roomData = createCodingRoom({
      roomId,
      roomName,
      admin: adminUid,
      participants: [{ uid: adminUid, role: 'edit', addedBy: adminUid }],
      language,
      accessType,
      accessLink,
      codeContent: '',
      executionLogs: [],
      lastEdited: new Date(),
      createdAt: new Date()
    });

    const docRef = await codingRoomsCollection.doc(roomId).set(roomData);

    res.status(201).json({ message: 'Room created', roomId, data: roomData });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
};

// ✅ Get Rooms of a User
const getRooms = async (req, res) => {
  try {
    const { uid } = req.query;
    if (!uid) return res.status(400).json({ error: 'Missing uid in query' });

    const snapshot = await codingRoomsCollection.get();
    const rooms = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }));
      
    res.status(200).json({ rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};

// ✅ Get Room by ID
const getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;

    const doc = await codingRoomsCollection.doc(roomId).get();
    if (!doc.exists) return res.status(404).json({ error: 'Room not found' });

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
};

// ✅ Add Participant
const addParticipant = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { uidToAdd, role, addedBy } = req.body;

    const doc = await codingRoomsCollection.doc(roomId).get();
    if (!doc.exists) return res.status(404).json({ error: 'Room not found' });

    const roomData = doc.data();
    const editor = roomData.participants.find(p => p.uid === addedBy && p.role === 'edit');
    if (!editor) return res.status(403).json({ error: 'Only editors can add participants' });

    const exists = roomData.participants.some(p => p.uid === uidToAdd);
    if (exists) return res.status(400).json({ error: 'User already in room' });

    const updatedParticipants = [...roomData.participants, { uid: uidToAdd, role, addedBy }];
    await codingRoomsCollection.doc(roomId).update({ participants: updatedParticipants });

    res.status(200).json({ message: 'Participant added' });
  } catch (error) {
    console.error('Error adding participant:', error);
    res.status(500).json({ error: 'Failed to add participant' });
  }
};

// ✅ Update Code
const updateCode = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { uid, codeContent } = req.body;

    const doc = await codingRoomsCollection.doc(roomId).get();
    if (!doc.exists) return res.status(404).json({ error: 'Room not found' });

    const roomData = doc.data();

    await codingRoomsCollection.doc(roomId).update({
      codeContent,
      lastEdited: new Date()
    });

    res.status(200).json({ message: 'Code updated' });
  } catch (error) {
    console.error('Error updating code:', error);
    res.status(500).json({ error: 'Failed to update code' });
  }
};

// ✅ Log Execution
const logExecution = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { output, isError, executedBy } = req.body;

    const execLog = {
      output,
      isError,
      executedBy,
      timestamp: new Date()
    };

    const doc = await codingRoomsCollection.doc(roomId).get();
    if (!doc.exists) return res.status(404).json({ error: 'Room not found' });

    const roomData = doc.data();
    const updatedLogs = [...(roomData.executionLogs || []), execLog];

    await codingRoomsCollection.doc(roomId).update({ executionLogs: updatedLogs });

    res.status(200).json({ message: 'Execution logged' });
  } catch (error) {
    console.error('Error logging execution:', error);
    res.status(500).json({ error: 'Failed to log execution' });
  }
};

// ✅ Delete Room
const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { uid } = req.body;

    const doc = await codingRoomsCollection.doc(roomId).get();
    if (!doc.exists) return res.status(404).json({ error: 'Room not found' });

    const roomData = doc.data();
    if (roomData.admin !== uid) {
      return res.status(403).json({ error: 'Only admin can delete the room' });
    }

    await codingRoomsCollection.doc(roomId).delete();

    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
};

module.exports = {
  createRoom,
  getRooms,
  getRoomById,
  addParticipant,
  updateCode,
  logExecution,
  deleteRoom
};
