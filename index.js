var express = require('express');
var config = require('./config.json');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var path = require('path');

var port ='3000';

//socket io variables
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongo = require('mongodb').MongoClient;
var mongojs = require('mongojs');

//routes
var start = require('./routes/start');
var chat = require('./routes/chat');

var onlineUsers = {};

app.use(cors());
//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//Set Static Folder
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'client', 'dist')));

//Body Parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//authorization token
app.use(expressJwt({
  secret: config.secret,
  getToken: function(req) {
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] == 'Bearer'){
      return req.headers.authorization.split(' ')[1];
    } else if(req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
}).unless({ path: ['/api/authenticate', '/socket.io/', '/api/user', '/api/users', 'api/update'] }));


app.use('/', start);
app.use('/api', chat);
//app.use('/chat', chat);

//socket.io connection
mongo.connect('mongodb://favoritefave:hallo34@ds133296.mlab.com:33296/chatproject', function(err, db) {
  if(err) {
    throw err;
  }
  console.log('Mongodb connected');

  io.on('connection', function(socket) {
    console.log('connected to IO SOCKET');
    const myDB = db.db('chatproject');
    let chat = myDB.collection('chats');
    let users = myDB.collection('users');

    //server receives every online user
    socket.on('onlineUser', function(name) {
      socket.username = name;
      onlineUsers[socket.username] = socket.id;
      updateOnlineUsers();
    });

    //on new chatroom -> socket joining it to receive its messages
    socket.on('room', function(room) {
      if(socket.room) {
        socket.leave(socket.room);
        socket.room = room;
        socket.join(room);
      } else {
      socket.room = room;
      socket.join(room);
      }
    });

    //on disconnect delete username from onlineusers so it's no longer displayed
    socket.on('disconnect', function(data) {
      if(!socket.username) return;
      delete onlineUsers[socket.username];
      updateOnlineUsers();
    });

    //broadcast all current online users to every socket
    function updateOnlineUsers() {
      var userNames = Object.keys(onlineUsers);
      var userArr = userNames.map(function(str) {
        var nStr = encodeURIComponent(str);
        return nStr;
      });
      io.emit('onlineUsers', userArr);
    }

    //handle input
    socket.on('input', function(data){
      let message = data.message;
      let username = data.user;
      let room = data.room;

      if(message == '' || username == ''){
        alert('Please enter a message');
      } else {
        //insert in database
        chat.insert({ message: message, username: username, room: room }, function(err, result) {
          if(err) return console.log(err);
          io.to(socket.room).emit('newMessage', [data]);
          console.log('saved to database');
        });
      }
    });
  });
}.bind(this));

http.listen(process.env.PORT || port, () =>{
  console.log('Server started on port '+port);
});
