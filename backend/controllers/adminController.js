const admin = require("../firebase/firebaseConfig");

const db = admin.firestore();
const adminsCollection = db.collection('Admins');

// ✅ Extract name from email (before @sece.ac.in)
const extractNameFromEmail = (email) => {
  const emailParts = email.split('@');
  if (emailParts[1] !== 'sece.ac.in') {
    throw new Error('Invalid email domain. Only @sece.ac.in emails are allowed.');
  }

  const name = emailParts[0];
  return name.toUpperCase(); // Capitalized name
};

// ✅ Token verification and admin creation/update
const verifyTokenAndStoreAdmin = async (req, res) => {
  const idToken = req.body.token;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, uid } = decodedToken;

    if (!email.endsWith('@sece.ac.in')) {
      return res.status(403).json({ message: "Only @sece.ac.in emails allowed." });
    }

    let name;
    try {
      name = extractNameFromEmail(email);
    } catch (parseError) {
      return res.status(400).json({ message: parseError.message });
    }

    const adminRef = adminsCollection.doc(uid);
    const adminDoc = await adminRef.get();

    if (adminDoc.exists) {
      // Update only last login time
      await adminRef.update({
        lastLoginTime: admin.firestore.FieldValue.serverTimestamp()
      });
    } else {
      // Create new admin with only base data
      const adminData = {
        uid,
        email,
        name,
        department: '', // Will be filled later
        year: '',
        role: '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLoginTime: admin.firestore.FieldValue.serverTimestamp()
      };
      await adminRef.set(adminData);
    }

    const updatedDoc = await adminRef.get();

    res.status(200).json({
      message: "Admin authentication successful",
      admin: updatedDoc.data()
    });

  } catch (err) {
    console.error('Admin Authentication error:', err);
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

// ✅ Get admin profile by UID
const getAdminProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const adminDoc = await adminsCollection.doc(uid).get();

    if (!adminDoc.exists) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ admin: adminDoc.data() });
  } catch (err) {
    console.error('Error fetching admin profile:', err);
    res.status(500).json({ message: "Error fetching admin profile", error: err.message });
  }
};

// ✅ Update admin profile (name, role, year, department can be changed here)
const updateAdminProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const updateData = req.body;

    if (!uid) {
      return res.status(400).json({ error: 'Missing uid parameter' });
    }

    const adminRef = adminsCollection.doc(uid);
    const adminSnap = await adminRef.get();

    if (!adminSnap.exists) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    await adminRef.update(updateData);

    res.status(200).json({ message: 'Admin profile updated successfully' });
  } catch (error) {
    console.error('Error updating admin profile:', error);
    res.status(500).json({ error: 'Failed to update admin profile' });
  }
};

module.exports = {
  verifyTokenAndStoreAdmin,
  getAdminProfile,
  updateAdminProfile
};
