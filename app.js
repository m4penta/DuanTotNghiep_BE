const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const App = require('./routes/router.index');
const createError = require('http-errors');
const database = require('./configs/database.model');
const nocache = require('nocache');
const cors = require('cors');
const app = express();
app.use(cors());

app.set('views', path.join(__dirname, 'views/'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views/template/')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/')));
app.use(express.static(path.join(__dirname, 'storage/')));
app.use(nocache());
app.all('/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

database.connect;
App.init(app);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
