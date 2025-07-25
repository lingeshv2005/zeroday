const admin = require('../firebase/firebaseConfig');
const { createAnnouncement } = require('../models/announcementModel'); // Adjust path if needed

const db = admin.firestore();
const announcementsCollection = db.collection('Announcements');

// ✅ Create Announcement
const createNewAnnouncement = async (req, res) => {
  try {
    const { title, content, docs, updatedBy, Category } = req.body;

    if (!title || !content || !updatedBy || !Category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const announcementData = createAnnouncement({
      title,
      content,
      docs,
      updatedBy,
      Category,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    const docRef = await announcementsCollection.add(announcementData);

    res.status(201).json({
      message: 'Announcement created successfully',
      id: docRef.id,
      data: announcementData
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
};

// ✅ Get All Announcements
const getAllAnnouncements = async (req, res) => {
  try {
    const snapshot = await announcementsCollection.orderBy('timestamp', 'desc').get();

    const announcements = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({ announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
};

// ✅ Get Announcements by Category
const getAnnouncementsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const snapshot = await announcementsCollection
      .where('Category', '==', category)
      .orderBy('timestamp', 'desc')
      .get();

    const announcements = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({ announcements });
  } catch (error) {
    console.error('Error fetching announcements by category:', error);
    res.status(500).json({ error: 'Failed to fetch announcements by category' });
  }
};

module.exports = {
  createNewAnnouncement,
  getAllAnnouncements,
  getAnnouncementsByCategory
};
