var createError = require('http-errors');
var express = require('express');
const session = require('express-session')
const mongoose = require('mongoose');
require('dotenv').config()
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bcrypt = require('bcryptjs');

const mongoDB = process.env.DB_URL
mongoose.connect(mongoDB, {useNewUrlParser:true, useUnifiedTopology:true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

var indexRouter = require('./routes/index');
const UserModel = require('./models/UserModel');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
