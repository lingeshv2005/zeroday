const createLostFoundItem = ({
  itemname,
  description,
  images = [],          // Array of image URLs (strings)
  location,
  datetime = new Date(), // JavaScript Date object
  type,                 // 'lost' or 'found'
  updatedBy             // admin UID or name
}) => ({
  itemname,
  description,
  images,
  location,
  datetime,
  type,
  updatedBy
});

module.exports = { createLostFoundItem };
