var express     = require('express');
var app         = express();
var partials    = require('express-partials'); // allows multiple templates to be rendered
var bodyParser  = require('body-parser'); // parses HTTP request body 
var session     = require('express-session'); // stores user session data

// DB Models/files
var db          = require('./db/databaseConfig.js');
var User        = require('./db/models/user.model.js');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Middleware that will be used
app.use(session({
  secret: 'Funky cat...'
}));

app.use(partials());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('login');
});

app.get('/signup', function (req, res) {
  res.render('signup');
});

app.post('/signup', function (req, res) {

  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;

  new User({email: email})
    .fetch()
    .then(function (user) {
      if (!user) { // sign the user up

        var user = new User({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: req.body.password
        });

        user.save().then(function (user) {
          console.log('just saved a user!', user);
          res.render('home');
        });

      } else { // user already exists with that email
        res.status(409).send('That email address is already in use.');
      }
    });


});

app.get('/login', function (req, res) {
  res.render('login');
});

app.post('/login', function(req, res) {
  console.log('USER TRYING TO LOG IN!!!!!!!');
  var email = req.body.email;
  var password = req.body.password;
  console.log(password);
  new User({ 'email': email })
    .fetch()
    .then(function (user) {
      if (!user) {
        res.send('No account exists for that email address. Please enter the create email address or create an account.');
      }

      user.checkPassword(req.body.password, function (match) {
        if (!match) {
          res.render('login');
        }
        res.render('home');
      });

    });

});

app.listen(8080);

module.exports = app;