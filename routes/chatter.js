// Make connection
//var socket = io.connect('http://localhost:/5500/');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');
var router = express.Router();

var app = express();

router.get('/', function(req, res, next) {
    res.sendFile('index.html');
  });
  
  
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

module.exports = router;
