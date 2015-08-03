var db        = require('../databaseConfig.js');
var bcrypt    = require('bcrypt');
var Promise   = require('bluebird');

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  initialize: function () {
    console.log('in User model');
    this.on('creating', this.hashPassword);
  },
  hashPassword: function () {
    var context = this;

    bcrypt.genSalt(10, function(err, salt) {
      if (err) { throw new Error('Problem generating salt.'); }
      console.log('salt: ',salt);
      bcrypt.hash(context.get('password'), salt, null, function (err, hash) {
        context.set('salt', salt);
        context.set('password', hash);
      });

    });
  },
  checkPassword: function (pass, callback) {
    var salt = this.get('salt');

    bcrypt.compare(salt, pass, function (err, res) {
      if (err) { throw new Error('Error comparing salt, pass. Could not verify password.'); }
      callback(res);
    });

  },
});

module.exports = User;