var express = require('express');
var router = express.Router();
// 导入MySQL模块
var mysql = require('mysql');
var dbConfig = require('../../../db/DBConfig');
var reportSql = require('../../../db/day_report/reportSql');
var userSql = require('../../../db/day_report/userSql');
// 使用DBConfig.js的配置信息创建一个MySQL连接池
var pool = mysql.createPool(dbConfig.mysql);

var wyFunc = require('../../../lib/main.min');
// 切词工具
var nodejieba = require("nodejieba");
var userDict = __dirname + '/userdict.utf8';
// 加载自定义词典
nodejieba.load({
  userDict: userDict,
});



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

const questionList = require("./qaList.js");

router.post('/', function(req, res, next) {

  var param = req.body;
  // console.log(param)
  var result_jieba = nodejieba.cut(param.message);
  // console.log(result_jieba)
  var anwserList = [];

  for (let i in result_jieba) {
    for (let j in questionList) {
      // console.log(result_jieba[i], j, strSimilarity2Percent(j, result_jieba[i]))
      // getSame(result_jieba[i], j)
      if (getSame(result_jieba[i], j) >= 0.6) {
        // console.log('--->',questionList[j]);
        if (typeof questionList[j] != 'string') {
          for (let m in questionList[j]) {
            if (anwserList.indexOf(questionList[j][m]) == -1) {
              anwserList.push(questionList[j][m]);
            }
          }
        }

      }
    }
  }
  // var anwserList = wyFunc.Find('列表', questionList, 'key');
  // console.log(anwserList);
  result = {
    code: 200,
    msg: 'ok',
    data: {
      anwser: anwserList
    }
  }
  responseJSON(res, result);
});

function getSame(str1, str2){
  let arr1 = str1.split('');
  let arr2 = str2.split('');

  let arr1_num = [];
  let arr2_num = [];

  let big = [];
  for(let i in arr1){
    if(big.indexOf(arr1[i])==-1){
      big.push(arr1[i]);
    }
  }

  for(let i in arr2){
    if(big.indexOf(arr2[i])==-1){
      big.push(arr2[i]);
    }
  }

  for(let i in big){
    if(str1.indexOf(big[i])!=-1){
      arr1_num.push(1);
    }else{
      arr1_num.push(0);
    }
  }

  for(let i in big){
    if(str2.indexOf(big[i])!=-1){
      arr2_num.push(1);
    }else{
      arr2_num.push(0);
    }
  }

  var top = new Number();
  for(let i in big){
    top += Number(arr1_num[i]*arr2_num[i]);
  }
  // console.log(top,top,arr1_num,arr2_num)

  var bottom_1 = new Number();
  for(let i in big){
    bottom_1 += Number(arr1_num[i]*arr1_num[i]);
  }
  var bottom_2 = new Number();
  for(let i in big){
    bottom_2 += Number(arr1_num[i]*arr1_num[i]);
  }

  var bottom = (Math.sqrt(bottom_1)*Math.sqrt(bottom_1)).toFixed(0);
  
  var samilater = top/bottom;

  // if(samilater == 1 && str1.length != str2.length){
  //   if(str1.length > str2.length){
  //     samilater = str2.length/str1.length;
  //   }else{
  //     samilater = str1.length/str2.length;
  //   }
  // }

  samilater = samilater.toFixed(2);
  console.log('samilater', samilater, str1, str2);
  return samilater;

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
  console.log('d---->',d);
  return (1 - d / l).toFixed(4);
}

function Minimum(a, b, c) {
  return a < b ? (a < c ? a : c) : (b < c ? b : c);
}

module.exports = router;