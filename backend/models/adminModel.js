const createAdmin = ({
  uid,
  name,
  email,          // was `Email`
  hosterler,
  block,
  roomnumber,
  department,
  designation,
  gender,         // was `Gender`
  lastLoginTime = new Date()
}) => ({
  uid,
  name,
  email,
  hosterler,
  block,
  roomnumber,
  department,
  designation,
  gender,
  lastLoginTime
});

module.exports = { createAdmin };
