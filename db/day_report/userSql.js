var UserSql = {
  insert: 'INSERT INTO user(title,timerange,content,user_id,type) VALUES(?,?,?,?,?)',
  update: 'update user set name = ?,des = ?,update_time = ? where id=?',
  queryAll: 'select SQL_CALC_FOUND_ROWS * from user limit ?, ?;',
  getUserById: 'select * from user where id = ? ',
  getUserByToken: 'select * from user where token = ? ',
  getUserByLogin: 'select * from user where username = ? and password = ? ',
};
module.exports = UserSql;