var _ = require('lodash');
var config = require('../config.json');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongojs = require('mongojs');

var db = mongojs('mongodb://favoritefave:hallo34@ds133296.mlab.com:33296/chatproject', ['users', 'onlineUsers']);

var service = {};

service.authenticate = authenticate;
service.create = create;
service.update = update;

module.exports = service;

//used for login, to check for user details
function authenticate(username, password) {
    var deferred = Q.defer();
    db.users.findOne({ name: username }, function(err, user) {
      if(err)  deferred.reject(err.name + ': ' + err.message);

      if(user && bcrypt.compareSync(password, user.hash /*create*/)) {
        //authentication succes
        deferred.resolve({
          _id: user._id,
          name: user.name,
          loggedIn: user.loggedIn,
          token: jwt.sign({ sub: user._id }, config.secret/*create*/)
        });
      } else {
        //authentication failed
        console.log('auth failed');
        deferred.resolve();
      }
    });
    return deferred.promise;
}

//used for registration and creating new users
function create(userParam) {

  var deferred = Q.defer();
  //validation
  db.users.findOne({ name: userParam.name }, function(err, usr) {
    if(err) {
      deferred.reject(err.name + ': ' + err.message);
    }
    if(usr) {
      //username already taken
      deferred.reject('Username ' + usr.name + ' already taken');
    } else {
      createUser();
    }
  });

  function createUser() {
    // set user without clear text pw
    var user = _.omit(userParam, 'password');

    //add hashed pw to user obj
    user.hash = bcrypt.hashSync(userParam.password, 10);

    user.loggedIn = "false";

    db.users.save(user, function(err, usr) {
      if(err) deferred.reject(err.name + ': ' + err.message);

      deferred.resolve();
    });
  }
  return deferred.promise;
}

//used to set online users
function update(id, set) {
  var deferred = Q.defer();
  //find the current User and set him as logged in
  db.users.findAndModify({
    query: { _id: mongojs.ObjectId(id) },
    update: { $set: set },
    new: true
  }, function(err, doc, lastErrorObject) {
    if(err) deferred.reject(err.name + ': ' + err.message);

    if(doc) deferred.resolve();
  });
  return deferred.promise;
}
