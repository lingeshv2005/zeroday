const admin = require("../firebase/firebaseConfig");
const { createStudent } = require('../models/studentModel');

const db = admin.firestore();
const studentsCollection = db.collection('Students');

// ✅ Utility: Parse name/year/department from SECE email
const parseStudentEmail = (email) => {
  const emailParts = email.split('@');
  if (emailParts[1] !== 'sece.ac.in') {
    throw new Error('Invalid email domain. Only @sece.ac.in emails are allowed.');
  }

  const localPart = emailParts[0];
  const match = localPart.match(/^(.+?)(\d{4})([a-z]+)$/i);
  if (!match) {
    throw new Error('Invalid email format. Expected: name.year+dept@sece.ac.in');
  }

  const [, nameWithDot, year, department] = match;
  const name = nameWithDot.replace(/\./g, ' ');
  return {
    name: name.trim(),
    year,
    department: department.toUpperCase()
  };
};

// ✅ Token verification and student creation/update
const verifyTokenAndStoreStudent = async (req, res) => {
  const idToken = req.body.token;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, uid } = decodedToken;

    if (!email.endsWith('@sece.ac.in')) {
      return res.status(403).json({ message: "Only @sece.ac.in emails allowed." });
    }

    let studentInfo;
    try {
      studentInfo = parseStudentEmail(email);
    } catch (parseError) {
      return res.status(400).json({ message: parseError.message });
    }

    const studentData = {
      uid,
      email,
      name: studentInfo.name,
      year: studentInfo.year,
      department: studentInfo.department,
      lastLoginTime: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const studentRef = studentsCollection.doc(uid);
    const studentDoc = await studentRef.get();

    if (studentDoc.exists) {
      await studentRef.update({
        lastLoginTime: admin.firestore.FieldValue.serverTimestamp()
      });
    } else {
      await studentRef.set(studentData);
    }

    res.status(200).json({
      message: "Authentication successful",
      student: {
        uid,
        email,
        name: studentInfo.name,
        year: studentInfo.year,
        department: studentInfo.department
      }
    });
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

// ✅ Get student profile by UID
const getStudentProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const studentDoc = await studentsCollection.doc(uid).get();

    if (!studentDoc.exists) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ student: studentDoc.data() });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};

// ✅ Update student profile
const updateStudentProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const updateData = req.body;

    if (!uid) {
      return res.status(400).json({ error: 'Missing uid parameter' });
    }

    const studentRef = studentsCollection.doc(uid);
    const studentSnap = await studentRef.get();

    if (!studentSnap.exists) {
      return res.status(404).json({ error: 'Student not found' });
    }

    await studentRef.update(updateData);

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

const searchStudentsByName = async (req, res) => {
  const query = req.query.name;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter "name" is required' });
  }

  try {
    const studentsCollection = db.collection('Students'); // ✅ PascalCase
    const snapshot = await studentsCollection.get();

    const matched = [];
    snapshot.forEach((doc) => {
      const student = doc.data();
      if (student.name && student.name.toLowerCase().includes(query.toLowerCase())) {
        matched.push({
          uid: student.uid,
          name: student.name,
        });
      }
    });

    return res.status(200).json({ results: matched });
  } catch (err) {
    console.error('❌ Error searching students:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  verifyTokenAndStoreStudent,
  getStudentProfile,
  updateStudentProfile,
  searchStudentsByName
};
