let userSql = require('../../../db/day_report/userSql');

/**
 * 统一获取用户信息
 * @Author   Warrenyang
 * @DateTime 2018-03-11
 * @version  [version]
 * @param    {[type]}   connection [description]
 * @param    {[type]}   param      [description]
 */
const getUserInfo = function(connection, param) {
  return new Promise((resolve, reject) => {
    connection.query(userSql.getUserByToken, [param.token], function(err, result) {
      // console.log(result)
      if (result && (result.length == 0)) {
        result = {
          code: '-201',
          msg: '对不起，用户不存在'
        }
        reject(result);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = getUserInfo;