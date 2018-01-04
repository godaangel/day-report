var express = require('express');
var router = express.Router();
// 导入MySQL模块
var mysql = require('mysql');
var dbConfig = require('../../../db/DBConfig');
var reportSql = require('../../../db/day_report/reportSql');
var userSql = require('../../../db/day_report/userSql');
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
// 添加会议室
router.post('/', function(req, res, next) {
  // 从连接池获取连接 
  pool.getConnection(function(err, connection) {
    // 获取前台页面传过来的参数  
    var param = req.body;
    // 建立连接 增加一个信息 
    var timestamp = new Date().getTime();
    connection.query(reportSql.getReportById, [param.id], function(err, result) {
      if (result) {
        var result_info = result[0];
        connection.query(userSql.getUserByToken, [param.token], function(err, result) {
          if (result && (result.length == 0)) {
            result = {
              code: '-201',
              msg: '对不起，用户不存在'
            }
            // 以json形式，把操作结果返回给前台页面     
            responseJSON(res, result);
            // 释放连接  
            connection.release();
          }else{
            console.log(result_info.user_id, result[0].id)
            if((result[0].id != result_info.user_id) && result[0].username != 'admin'){
              responseJSON(res, {
                code: '-202',
                msg: '对不起，您不是报告作者，没有编辑权限'
              });
              return false;
            }
            var backInfo = {
              code: 200,
              msg: 'ok',
              data: {
                info: result_info,
              }
            };
            // 以json形式，把操作结果返回给前台页面     
            responseJSON(res, backInfo);
            // 释放连接  
            connection.release();
          }
        }); 
      }else{
        // 以json形式，把操作结果返回给前台页面     
        responseJSON(res, result);
        // 释放连接  
        connection.release();
      }
    });
  });
});

module.exports = router;