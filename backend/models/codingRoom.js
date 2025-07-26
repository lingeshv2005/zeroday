// utils/firebaseSchemas.js

const createCodingRoom = ({
  roomId,
  roomName,
  admin, // uid of creator
  participants = [], // array of { uid, role, addedBy }
  language = 'javascript',
  codeContent = '',
  executionLogs = [], // array of { output, isError, executedBy, timestamp }
  accessType = 'private',
  accessLink = null,
  createdAt = new Date(),
  lastEdited = new Date()
}) => ({
  roomId,
  roomName,
  admin,
  participants,   // e.g., [{ uid: 'abc123', role: 'edit', addedBy: 'xyz456' }]
  language,
  codeContent,
  executionLogs,  // e.g., [{ output: "Hello", isError: false, executedBy: "xyz123", timestamp: Date }]
  accessType,
  accessLink,
  createdAt,
  lastEdited
});

module.exports = { createCodingRoom };
