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