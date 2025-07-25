const createStudent = ({
  uid,           // was Uid
  name,          // was Name
  rollnumber,
  email,         // was Email
  hosterler,     // was Hosterler
  block,         // was Block
  roomnumber,    // was Roomnumber
  department,
  year,
  gender,        // was Gender
  lastLoginTime = new Date()
}) => ({
  uid,
  name,
  rollnumber,
  email,
  hosterler,
  block,
  roomnumber,
  department,
  year,
  gender,
  lastLoginTime
});

module.exports = { createStudent };
