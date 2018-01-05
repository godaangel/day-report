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
// 生成周报
router.post('/', function(req, res, next) {

  // 从连接池获取连接 
  pool.getConnection(function(err, connection) {
    // 获取前台页面传过来的参数  
    var param = req.body;
    // 建立连接 增加一个信息 
    var timestamp = new Date().getTime();
    console.log(req.body)
    var dateArr = getWorkDay(getFirstDayOfWeek(param.timerange||getLocalTime(timestamp)));
    connection.query(userSql.getUserByToken, [param.token], function(err, result_1) {
      console.log(result_1)
      if (result_1 && (result_1.length == 0)) {
        result_1 = {
          code: '-201',
          msg: '对不起，用户不存在'
        }
        // 以json形式，把操作结果返回给前台页面     
        responseJSON(res, result_1);
        // 释放连接  
        connection.release();
      }else{
        connection.query(reportSql.exportMyByTime, [dateArr[0], dateArr[4], result_1[0].id], function(err, result) {
        if (result && (result.length == 0)) {
          result = {
            code: '-404',
            msg: '暂无数据'
          }
          responseJSON(res, result);
          connection.release();
        }else{
          var daybydayArr = [];
          for(var i in result){
            var contentList = JSON.parse(result[i].content);
            var typeList = [];
            var finalList = [];
            for(var j in contentList){
              var type = contentList[j].item_title + ' ' + contentList[j].item_type;
              if(typeList.indexOf(type) == -1){
                // console.log(contentList[j])
                typeList.push(type);
                finalList.push({
                  name: type,
                  content: contentList[j].item_content,
                  risk: (contentList[j].item_rist||'')
                })
              }else{
                finalList[typeList.indexOf(type)].content += (contentList[j].item_content?(';'+contentList[j].item_content):'');
                finalList[typeList.indexOf(type)].risk += (contentList[j].item_risk?(';'+contentList[j].item_risk):'');
              }
            }
            daybydayArr.push(finalList);
            // console.log(finalList)
          }

          var typeList = [];
          var reportList = [];
          var contentList = [];
          var riskList = [];
          for(let i in daybydayArr){
            for(let j in daybydayArr[i]){
              // console.log(daybydayArr[i][j].name)
              let name = daybydayArr[i][j].name;
              if(typeList.indexOf(name) == -1){
                typeList.push(name);
                reportList.push({
                  name: name,
                  content: daybydayArr[i][j].content,
                  risk: daybydayArr[i][j].risk
                });
                contentList.push(daybydayArr[i][j].content);
                riskList.push(daybydayArr[i][j].risk);
              }else{
                //内容相似度排除
                let contentCount = 0;
                for(let m in contentList){
                  if(strSimilarity2Percent(daybydayArr[i][j].content, contentList[m]) >= 0.7){
                    contentCount += 1;
                  }
                }

                if(contentCount == 0){
                  reportList[typeList.indexOf(name)].content += '\n'+daybydayArr[i][j].content;
                  contentList.push(daybydayArr[i][j].content);
                }

                //风险相似度排除
                let riskCount = 0;
                for(let m in riskList){
                  if(strSimilarity2Percent(daybydayArr[i][j].risk, riskList[m]) >= 0.7){
                    riskCount += 1;
                  }
                }

                if(riskCount == 0){
                  reportList[typeList.indexOf(name)].risk += '\n'+daybydayArr[i][j].risk;
                  riskList.push(daybydayArr[i][j].risk);
                }
              }
            }
          }
          result = {
            code: 200,
            msg: 'ok',
            data: reportList
          }
          responseJSON(res, result);
          connection.release();
        }
      });
      }
    });
    
  });
});

module.exports = router;

//获取本周一
function getFirstDayOfWeek(date) {
  date = new Date(date);
  var day = date.getDay() || 7;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 - day);
};

function getWorkDay(firstDay){
  var oneDay = 24*60*60*1000;
  var arr = [];
  for(var i = 0; i < 5; i ++){
    var day = getLocalTime(firstDay.getTime() + oneDay*i);
    arr.push(day);
  }
  return arr;
}

function getLocalTime(nS) {
  var now = new Date(parseInt(nS));
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  if (month < 10) {
      month = "0" + month;
  }
  var date = now.getDate();
  if (date < 10) {
      date = "0" + date;
  }
  var hour = now.getHours();
  if (hour < 10) {
      hour = "0" + hour;
  }
  var minute = now.getMinutes();
  if (minute < 10) {
      minute = "0" + minute;
  }
  var second = now.getSeconds();
  if (second < 10) {
      second = "0" + second;
  }
  return year + "-" + month + "-" + date;
}

//两个字符串的相似程度，并返回相差字符个数
function strSimilarity2Number(s, t) {
  var n = s.length,
    m = t.length,
    d = [];
  var i, j, s_i, t_j, cost;
  if (n == 0) return m;
  if (m == 0) return n;
  for (i = 0; i <= n; i++) {
    d[i] = [];
    d[i][0] = i;
  }
  for (j = 0; j <= m; j++) {
    d[0][j] = j;
  }
  for (i = 1; i <= n; i++) {
    s_i = s.charAt(i - 1);
    for (j = 1; j <= m; j++) {
      t_j = t.charAt(j - 1);
      if (s_i == t_j) {
        cost = 0;
      } else {
        cost = 1;
      }
      d[i][j] = Minimum(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  }
  return d[n][m];
}
//两个字符串的相似程度，并返回相似度百分比
function strSimilarity2Percent(s, t) {
  var l = s.length > t.length ? s.length : t.length;
  var d = strSimilarity2Number(s, t);
  return (1 - d / l).toFixed(4);
}

function Minimum(a, b, c) {
  return a < b ? (a < c ? a : c) : (b < c ? b : c);
}
