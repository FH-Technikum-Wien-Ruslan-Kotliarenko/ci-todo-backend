// app.js
var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(session.Store);

var todosRouter = require('./routes/todos');
var authRouter  = require('./routes/auth');
var db = require('./db/db');

var app = express();
app.use(cors({
  // allow all origins (for now)
  origin: function(origin, callback) {
    callback(null, true);
  },
  credentials: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Session config
app.use(session({
  secret: 'SOME_LONG_RANDOM_STRING',  
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({
    db: db
  })
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/todos', todosRouter);
app.use('/api/auth', authRouter);   // <-- add the auth routes

// catch 404 and error handler, etc...
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  next(createError(err.status || 500));
});

module.exports = app;
