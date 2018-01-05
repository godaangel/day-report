var ReportSql = {
  insert: 'INSERT INTO report(title,timerange,content,user_id,type) VALUES(?,?,?,?,?)',
  update: 'update report set title = ?,timerange = ?,content = ? where id=?',
  queryAll: 'select SQL_CALC_FOUND_ROWS * from report where user_id=? order by timerange desc limit ?, ?',
  queryAdmin: 'select SQL_CALC_FOUND_ROWS * from report order by timerange desc limit ?, ?',
  exportByTime: 'select * from report where timerange >= ? and timerange <= ?',
  exportMyByTime: 'select * from report where timerange >= ? and timerange <= ? and user_id = ?',
  getReportById: 'select * from report where id = ? ',
  delete: 'delete from report where id=?'
};
module.exports = ReportSql;