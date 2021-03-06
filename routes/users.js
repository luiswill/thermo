var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/signup', function(req, res){
	res.render('signup');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Register User
router.post('/signup', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;


	var newUser = new User({
		name: name,
		email:email,
		username: username,
		password: password,
		isAdmin: false
	});

	User.createUser(newUser, function(err, user){
		if(err) throw err;
		console.log(user);
	});

	res.redirect('/users/login');

});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false);
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false);
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res){
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	res.redirect('/');
});

module.exports = router;