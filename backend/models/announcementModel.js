const createAnnouncement = ({
  title,
  content,
  docs = [],
  updatedBy,
  Category,           // exam, holiday, events
  timestamp = new Date()
}) => ({
  title: title,
  content: content,
  docs: docs,
  updatedBy: updatedBy,
  Category: Category,
  timestamp: timestamp
});

module.exports = { createAnnouncement };
