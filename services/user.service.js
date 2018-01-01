var _ = require('lodash');
var config = require('../config.json'); //create
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongojs = require('mongojs');
var mongo = require('mongoskin');

var db = mongojs('mongodb://username:pw@ds133296.mlab.com:33296/chatproject', ['users']);


var service = {};

service.authenticate = authenticate;
service.create = create;

module.exports = service;


function authenticate(username, password) {
    var deferred = Q.defer();

    db.users.findOne({ name: username }, function(err, user) {
      if(err)  deferred.reject(err.name + ': ' + err.message);

      if(user && bcrypt.compareSync(password, user.hash /*create*/)) {
        //authentication succes
        deferred.resolve({
          _id: user._id,
          name: user.name,
          token: jwt.sign({ sub: user._id }, config.secret/*create*/)
        });
      } else {
        //authentication failed
        deferred.resolve();
      }
    });

    return deferred.promise;
}


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

    db.users.save(user, function(err, usr) {
      if(err) deferred.reject(err.name + ': ' + err.message);

      deferred.resolve();
    });
  }
  return deferred.promise;
}
