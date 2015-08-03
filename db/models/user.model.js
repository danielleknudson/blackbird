var db        = require('../databaseConfig.js');
var bcrypt    = require('bcrypt');
var Promise   = require('bluebird');

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  initialize: function () {
    this.on('saving', this.hashPassword, this);
  },
  hashPassword: function () {
    var context = this;
    var password = this.get('password');

    return new Promise(function (resolve, reject) {
      bcrypt.hash(password, 10, function(error, hash){
        if (error){
          return reject(error);
        }

        return resolve(context.set({'password': hash}));
      });
    });

  },
  checkPassword: function (pass, callback) {
    console.log('========================================================in checkPassword');

    bcrypt.compare(pass, this.get('password'), function (err, res) {
      if (err) { throw new Error('Error comparing salt, pass. Could not verify password.'); }
      console.log(res);
      callback(res);
    });

  },
});

module.exports = User;