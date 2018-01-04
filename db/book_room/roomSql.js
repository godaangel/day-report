var RoomSQL = {
  insert: 'INSERT INTO room_list(name,des,update_time,create_time) VALUES(?,?,?,?)',
  update: 'update room_list set name = ?,des = ?,update_time = ? where id=?',
  queryAll: 'select SQL_CALC_FOUND_ROWS * from room_list limit ?, ?;',
  getRoomById: 'select * from room_list where id = ? ',
};
module.exports = RoomSQL;