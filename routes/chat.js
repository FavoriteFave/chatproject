var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var userService = require('../services/user.service');

var db = mongojs('mongodb://favoritefave:hallo34@ds133296.mlab.com:33296/chatproject', ['users', 'chats']);

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

//update a user, especially loggedIn
router.put('/update/:id', function(req, res) {
  let id = req.params.id;
  let set = req.body;
  userService.update(id, set)
    .then(function() {
      res.sendStatus(200);
    })
    .catch(function(err) {
      res.sendStatus(err).send(err);
    });
});

//get the last 5 chat messages of a specific room
router.get('/chats/:room', function(req, res, next){

  let room = req.params.room;
  db.chats.find({room: room}).limit(5).sort({_id:1}).toArray(function(err, chats){
          if(err){
            res.send(err);
          }
          res.json(chats);
      });
});

module.exports = router;
