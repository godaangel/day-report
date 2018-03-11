var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * 路由接口配置
 */
var index = require('./routes/index');
app.use('/', index);

/**
 * API
 */
var addroom = require('./routes/book_room/api/addroom');
app.use('/book_room/room/add', addroom);
var updateroom = require('./routes/book_room/api/updateroom');
app.use('/book_room/room/update', updateroom);
var getroom = require('./routes/book_room/api/getroom');
app.use('/book_room/room/list', getroom);

/**
 * 日报接口
 */
var login = require('./routes/dayreport/api/login');
app.use('/dayreport/api/login', login);

var getmyreport = require('./routes/dayreport/api/getmyreport');
app.use('/dayreport/api/getmyreport', getmyreport);

var addreport = require('./routes/dayreport/api/addreport');
app.use('/dayreport/api/addreport', addreport);

var getreportbyid = require('./routes/dayreport/api/getreportbyid');
app.use('/dayreport/api/getreportbyid', getreportbyid);

var updatereport = require('./routes/dayreport/api/updatereport');
app.use('/dayreport/api/updatereport', updatereport);

var deletereport = require('./routes/dayreport/api/deletereport');
app.use('/dayreport/api/deletereport', deletereport);

var exportReport = require('./routes/dayreport/api/export');
app.use('/dayreport/api/export', exportReport);

var exportWeekReport = require('./routes/dayreport/api/exportweek');
app.use('/dayreport/api/exportweek', exportWeekReport);

var getKeyword = require('./routes/dayreport/api/question');
app.use('/dayreport/api/question', getKeyword);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
