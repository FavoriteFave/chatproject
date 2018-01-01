var express = require('express');
var config = require('./config.json');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var path = require('path');

var port ='3000';


//socket io

//var server = require('http').createServer(app);

var start = require('./routes/start');
var registration = require('./routes/registration');
var chat = require('./routes/chat');


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
}).unless({ path: ['/api/authenticate', '/socket.io/socket.io.js', '/api/user', '/api/users'] }));

app.use('/', start);
app.use('/api', registration);
app.use('/chat', chat);

app.listen(process.env.PORT || port, () =>{
  console.log('Server started on port '+port);
});
