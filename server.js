var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');
var path = require('path');


// Configure the local strategy for use by Passport.
passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {                                                                                                                            
      if (err) { return cb(err); }                                                                                                                                                     
      if (!user) { return cb(null, false); }                                                                                                                                           
      if (user.password != password) { return cb(null, false); }                                                                                                                       
      return cb(null, user);                                                                                                                                                           
    });                                                                                                                                                                                
  }));

// Configure Passport authenticated session persistence.                                                                                                                                                                 
passport.serializeUser(function(user, cb) {                                                                                                                                            
  cb(null, user.id);                                                                                                                                                                   
});                                                                                                                                                                                    

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// Create a new application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// Define routes.
app.get('/',
  function(req, res) {
    res.render('home');
  });

app.get('/login',
  function(req, res){
    res.render('login', { user: req.user });
  });
  
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

app.get('/download', 
    function(req, res){
      res.render('download');
  });

app.get('/download-file1', 
  function(req, res){
    var filename = "public/welcome.gif";
    res.download(filename);
});

app.get('/download-file2',
  function(req, res){
    var filename = "public/pic.jpg";
    res.download(filename);
  })

var server = app.listen(8080, function(){
  var port = server.address().port;
  console.log("Server running at http://localhost:%s", port);
})
