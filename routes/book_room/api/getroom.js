var express = require('express');
var router = express.Router();
// 导入MySQL模块
var mysql = require('mysql');
var dbConfig = require('../../../db/DBConfig');
var roomSql = require('../../../db/book_room/roomSql');
// 使用DBConfig.js的配置信息创建一个MySQL连接池
var pool = mysql.createPool(dbConfig.mysql);
// 响应一个JSON数据
var responseJSON = function(res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '-200',
      msg: '操作失败'
    });
  } else {
    res.json(ret);
  }
};
// 更新会议室
router.get('/', function(req, res, next) {
  // 从连接池获取连接 
  pool.getConnection(function(err, connection) {
    // 获取前台页面传过来的参数  
    var param = req.query || req.params;
    // 建立连接 修改一个信息 
    var timestamp = new Date().getTime();
    var pageSize = param.page_size?param.page_size:10;

    connection.query(roomSql.queryAll, [(param.current_page?(param.current_page - 1):0)*pageSize, pageSize], function(err, result) {
      if (result) {

        var total = 0;
        var list = result;

        connection.query('select found_rows() as total', function(err, result2) {
          if(result2){
            total = result2[0].total;
            result2 = {
              code: 200,
              msg: 'ok',
              data: {
                list: list,
                pagination: {
                  current_page: param.current_page?parseInt(param.current_page):0,
                  page_size: pageSize,
                  total: total
                }
              }
            };
          }
          // 以json形式，把操作结果返回给前台页面     
          responseJSON(res, result2);
          // 释放连接  
          connection.release();
        });
      }
    });
  });
});

module.exports = router;