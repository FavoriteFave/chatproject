var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var userService = require('../services/user.service');

var db = mongojs('mongodb://username:pw@ds133296.mlab.com:33296/chatproject', ['users', 'chats']);

//routes - fun concept, maybe do it later
//router.get('/users', getAll);


//authenticate a user
router.post('/authenticate', function(req, res) {
  userService.authenticate(req.body.username, req.body.password)
    .then(function(user) {
      if(user) {
        //success authentication
        res.send(user);
      } else {
        //authentication failed
        res.status(400).send('Username or password incorrect');
      }
    })
    .catch(function(err) {
      res.status(400).send(err);
    });
});
//get all the user
router.get('/users', function(req, res, next){
  db.users.find(function(err, users){
    if(err){
      res.send(err);
    }
    res.json(users);
  });
});

//get single user
router.get('/user/:id', function(req, res, next) {
  db.users.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, usr){
    if(err){
      res.send(err);
    }
    res.json(usr);
  });
});

//save a new user
router.post('/user', function(req, res) {
  let user = req.body;
  userService.create(user)
    .then(function() {
      res.sendStatus(200);
    })
    .catch(function(err) {
      res.sendStatus(400).send(err);
    });
});

//get all chats
router.get('/chats', function(req, res, next){
  db.chats.find(function(err, chats){
    if(err){
      res.send(err);
    }
    res.json(chats);
  });
});

module.exports = router;
