var express = require('express');
var router = express.Router();
// 导入MySQL模块
var mysql = require('mysql');
var dbConfig = require('../../../db/DBConfig');
var reportSql = require('../../../db/day_report/reportSql');
var userSql = require('../../../db/day_report/userSql');

var getUserInfo  = require('../common/getUserInfo');

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

router.post('/', function(req, res, next) {

  /**
   * 获取报告列表
   * @Author   Warrenyang
   * @DateTime 2018-03-11
   * @version  [version]
   */
  function getReportList(connection, userInfo, param){
    return new Promise((resolve, reject) => {
      var pageSize = param.page_size?param.page_size:28;
      if(userInfo[0].username == 'admin'){
        connection.query(reportSql.queryAdmin, [(param.current_page?(param.current_page - 1):0)*pageSize, pageSize], function(err, result) {
          if (result) {
            var list = result;
            resolve(list);
          }else{
            reject();
          }
        });
      }else{
        connection.query(reportSql.queryAll, [userInfo[0].id, (param.current_page?(param.current_page - 1):0)*pageSize, pageSize], function(err, result) {
          if (result) {
            var list = result;
            resolve(list);
          }else{
            reject();
          }
        });
      }
    });
  }

  /**
   * 获取报告总数
   * @Author   Warrenyang
   * @DateTime 2018-03-11
   * @version  [version]
   */
  function getTotal(connection, list, userInfo, param){
    return new Promise((resolve, reject) => {
      var pageSize = param.page_size?param.page_size:28;
      connection.query('select found_rows() as total', function(err, result) {
        if(result){
          var total = result[0].total || 0;
          result = {
            code: 200,
            msg: 'ok',
            data: {
              list: list,
              auth: userInfo[0].username,
              pagination: {
                current_page: param.current_page?parseInt(param.current_page):0,
                page_size: pageSize,
                total: total
              }
            }
          };
        }
        resolve(result);
      });
    });
  }

  // 从连接池获取连接 
  pool.getConnection(function(err, connection) {
    // 获取前台页面传过来的参数  
    var param = req.body;
    // 建立连接 增加一个信息 
    var timestamp = new Date().getTime();

    /**
     * async/await 获取整个信息
     * @Author   Warrenyang
     * @DateTime 2018-03-11
     */
    let getMyreport = async function() {
      let userInfo = await getUserInfo(connection, param);
      let reportList = await getReportList(connection, userInfo, param);
      let result = await getTotal(connection, reportList, userInfo, param);
      responseJSON(res, result);
      connection.release();
    }

    getMyreport().catch((result) => {
      responseJSON(res, result);
      connection.release();
    });
  });
});

module.exports = router;