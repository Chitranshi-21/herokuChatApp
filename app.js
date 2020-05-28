var createError = require('http-errors');
var express = require('express');
var socket = require('socket.io');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
var dotenv = require('dotenv');
const flash = require('connect-flash');
const session = require('express-session');

dotenv.config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var chatRouter = require('./public/chat');
var app = express();


//EJS
app.set('views', path.join(__dirname, 'views'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs');
app.use(expressLayouts);

var server = app.listen(5500,function(){
  console.log('listening to request on port 5500');
});
var io = socket(server);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//Routes
app.use('/index', indexRouter);
//app.use('/chat',chatRouter);
app.use('/users', usersRouter);
//app.use('/send',emailRouter);
//Static files
app.use(express.static('public'));

// Socket setup & pass server
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);

    // Handle chat event
    socket.on('chat', function(data){
      console.log('message: ' + data);
        // console.log(data);
        io.sockets.emit('chat', data);
    });

    // Handle typing event
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });

    socket.on('disconnect', function(){
      console.log('A user disconnected');
    });

});


// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
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
