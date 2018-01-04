var express = require('express');
var router = express.Router();
// 导入MySQL模块
var mysql = require('mysql');
var dbConfig = require('../../../db/DBConfig');
var reportSql = require('../../../db/day_report/reportSql');
var userSql = require('../../../db/day_report/userSql');

var nodeExcel = require('excel-export');

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
router.get('/', function(req, res, next) {

  // 从连接池获取连接 
  pool.getConnection(function(err, connection) {
    // 获取前台页面传过来的参数  
    var param = req.query || req.params;
    // 建立连接 增加一个信息 
    var timestamp = new Date().getTime();
    connection.query(reportSql.exportByTime, [param.timerange], function(err, result) {
      if (result && (result.length == 0)) {
        result = {
          code: '-404',
          msg: '暂无数据'
        }
        responseJSON(res, result);
        connection.release();
      }else{
        var header = ["平台","产品模块","功能简介","产品","设计","客户端","H5","后端","集成/联调","测试","上线","今日重要进展","风险点","备注"];
        var conf = {};

        conf.stylesXmlFile = "style.xml";

        var cols = [];
        for(var i in header){
          cols.push({
            caption: header[i],
            type: 'string',
            // captionStyleIndex: 1,
            width: 128.234
          });
        }

        var rowItem = [{
          type: 'APP',
          list: ['机票', '酒店', '餐饮', '门票', '城市名片', '景区名片', '天气', '直播', '语音导览', '投诉', '找厕所', '购', '找导游/旅行社', '首页/聚合页面', '个人中心', '订单中心']
        }, {
          type: '小程序',
          list: ['找厕所', '门票', '诚信商户/支付', '直播']
        }, {
          type: '其它',
          list: ['织云系统', 'Mock系统', 'WAU', 'WMU', '其它']
        }];
        var rows = [];
        var leftList = [];

        for(var j in rowItem){
          for(var k in rowItem[j].list){
            var arr = [];
            for(var s = 0; s < 16; s ++){
              arr.push('');
            }
            leftList.push(rowItem[j].type+'-'+rowItem[j].list[k]);
            arr[0] = rowItem[j].type;
            arr[1] = rowItem[j].list[k];
            rows.push(arr);
          }
        }
        // console.log(leftList);

        for(var m in result){
          var oneItem = JSON.parse(result[m].content);
          // console.log(oneItem)

          for(var n in oneItem){
            // console.log(oneItem[n].item_title, oneItem[n].item_type)
            //纵向坐标
            var rowIndex = leftList.indexOf(oneItem[n].item_title);
            //横向坐标
            var colIndex = header.indexOf(oneItem[n].item_type);

            // console.log(rowIndex,colIndex);
            if(rowIndex!=-1&&colIndex!=-1){
              rows[rowIndex][colIndex] = oneItem[n].item_progress;
              rows[rowIndex][8] = oneItem[n].item_together;
              rows[rowIndex][11] = rows[rowIndex][11] +'\n' + oneItem[n].item_content;
              rows[rowIndex][12] = oneItem[n].item_rist;
              rows[rowIndex][13] = oneItem[n].item_remark;
            }
          }
        }
        // console.log(rows);
        conf = {
          rows: rows,
          cols: cols
        }
        var result = nodeExcel.execute(conf);
        var time = param.timerange.split('-')[1]+param.timerange.split('-')[2];
        var fileTitle = '一部手机游云南产品研发进度_' + time;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
        res.setHeader("Content-Disposition", "attachment; filename=" + encodeURI(fileTitle) + ".xlsx");
        res.end(result, 'binary');

        connection.release();
      }
    });
  });
});

module.exports = router;