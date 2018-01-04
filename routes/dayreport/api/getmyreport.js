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
    console.log(req.body);
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
        var pageSize = param.page_size?param.page_size:28;
        if(result[0].username == 'admin'){
          connection.query(reportSql.queryAdmin, [(param.current_page?(param.current_page - 1):0)*pageSize, pageSize], function(err, result2) {
            if (result2) {
              var total = 0;
              var list = result2;
              connection.query('select found_rows() as total', function(err, result3) {
                if(result3){
                  total = result3[0].total;
                  result3 = {
                    code: 200,
                    msg: 'ok',
                    data: {
                      list: list,
                      auth: result[0].username,
                      pagination: {
                        current_page: param.current_page?parseInt(param.current_page):0,
                        page_size: pageSize,
                        total: total
                      }
                    }
                  };
                }
                // 以json形式，把操作结果返回给前台页面     
                responseJSON(res, result3);
                // 释放连接  
                connection.release();
              });
            }
          });
        }else{
          connection.query(reportSql.queryAll, [result[0].id, (param.current_page?(param.current_page - 1):0)*pageSize, pageSize], function(err, result2) {
            if (result2) {
              var total = 0;
              var list = result2;
              connection.query('select found_rows() as total', function(err, result3) {
                if(result3){
                  total = result3[0].total;
                  result3 = {
                    code: 200,
                    msg: 'ok',
                    data: {
                      list: list,
                      auth: result[0].username,
                      pagination: {
                        current_page: param.current_page?parseInt(param.current_page):0,
                        page_size: pageSize,
                        total: total
                      }
                    }
                  };
                }
                // 以json形式，把操作结果返回给前台页面     
                responseJSON(res, result3);
                // 释放连接  
                connection.release();
              });
            }
          });
        }
        
      }
    });
  });
});

module.exports = router;