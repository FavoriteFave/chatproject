var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var mongoose = require('mongoose')
var app = express();
var io = require('socket.io').listen(4000).sockets;


mongo.connect('mongodb://favoritefave:hallo34@ds133296.mlab.com:33296/chatproject', function(err, db) {
  if(err) {
    throw err;
  }
  console.log('Mongodb connected');

  io.on('connection', function(socket) {
    console.log('connected to IO SOCKET');
    const myDB = db.db('chatproject');
    let chat = myDB.collection('chats');

    /*socket.on('disconnect', function() {
      console.log('user disconnected');
    })*/

    sendStatus = function(s){
      socket.emit('status', s);
    }

    //get chat
    chat.find().limit(100).sort({_id:1}).toArray(function(err, res) {
      if(err){
        throw err;
      }
      //emit messages
      io.emit('output', res);
    });
    //handle inpit
    socket.on('input', function(data){
      let message = data.message;
      let username = data.user;

      if(message == '' || username == ''){
        sendStatus('Please enter a message');
      } else {
        //insert in database
        chat.insert({ message: message, username: username }, function(err, result) {
          if(err) return console.log(err);
          io.emit('output', [data]);
          console.log('saved to database');
          //io.emit('output', [data]);

          //send status Object
          sendStatus({
            message: 'Message sent',
            clear: true
          });
        });
      }
    });
  });
});



module.exports = router;
