const admin = require('../firebase/firebaseConfig');
const { createLostFoundItem } = require('../models/lostfoundModel.js');

const db = admin.firestore();
const lostFoundCollection = db.collection('LostFound');

// ✅ Create Lost/Found Item
const createLostFound = async (req, res) => {
  try {
    const { itemname, description, images, location, type, updatedBy } = req.body;

    if (!itemname || !description || !location || !type || !updatedBy) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newItem = createLostFoundItem({
      itemname,
      description,
      images,
      location,
      datetime: admin.firestore.FieldValue.serverTimestamp(),
      type,
      updatedBy
    });

    const docRef = await lostFoundCollection.add(newItem);

    res.status(201).json({
      message: 'Lost/Found item added successfully',
      id: docRef.id,
      data: newItem
    });
  } catch (error) {
    console.error('Error creating Lost/Found item:', error);
    res.status(500).json({ error: 'Failed to create Lost/Found item' });
  }
};

// ✅ Get All Lost/Found Items
const getAllLostFound = async (req, res) => {
  try {
    const snapshot = await lostFoundCollection.orderBy('datetime', 'desc').get();

    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({ items });
  } catch (error) {
    console.error('Error fetching Lost/Found items:', error);
    res.status(500).json({ error: 'Failed to fetch Lost/Found items' });
  }
};

// ✅ Get Items by Type (lost or found)
const getLostFoundByType = async (req, res) => {
  try {
    const { type } = req.params;
    console.log('Requested type:', type); // Debug: Check incoming type

    const snapshot = await lostFoundCollection
      .where('type', '==', type)
      .orderBy('datetime', 'desc')
      .get();

    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log('Fetched items count:', items.length); // Debug

    res.status(200).json({ items });
  } catch (error) {
    console.error('Error fetching items by type:', error);
    res.status(500).json({ error: 'Failed to fetch Lost/Found items by type' });
  }
};

module.exports = {
  createLostFound,
  getAllLostFound,
  getLostFoundByType
};
