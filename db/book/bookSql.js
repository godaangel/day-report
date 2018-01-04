var BookSQL = {
  insert: 'INSERT INTO admin(id,name,password) VALUES(?,?,?)',
  queryAll: 'SELECT * FROM User',
  getUserById: 'SELECT * FROM User WHERE uid = ? ',
};
module.exports = BookSQL;