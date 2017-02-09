var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var express = require('express');
var router = express.Router();

module.exports = router;

/**
 * takes the user id and save it in this session
 */
passport.serializeUser(function(user, done){
	done(null, user.id);
});

/**
 * if id exists: stock it in user
 * else throw error
 */
passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		done(err, user);
	});
});

/**
 * function to signup with e-mail and password
 * check if the user doesn´t exist yet, else error
 */
passport.use('local.signup', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback : true
}, function(req, email, password, done){

	User.findOne({'email' : email}, function(err, user){
		if(err){
			return done(err);
		}
		
		if (user){
			req.flash('msgError', 'User Already Exist !');
			return done(null, false);
		}
		
		
		var newUser = new User();
		newUser.fullname = req.body.name;
		newUser.email = req.body.email;
		newUser.password =  newUser.encryptPassword(req.body.password);
		
		newUser.save(function(err){
			if(err){
				return done(err);
			}
			
			return done(null, newUser);
		})
	})	
}));


/**
 * Function to login with email and password
 * check if this mail adress is already used, if es throw exception
 */
passport.use('local.login', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback : true
}, function(req, email, password, done){

	User.findOne({'email' : email}, function(err, user){
		if(err){
			return done(err);
		}
		
		if (!user){
			req.flash('loginError', 'Email Not Found !');
			return done(null, false);
		}
		
		if (!user.validPassword(req.body.password)){
			req.flash('passwordError', 'Password Not Found !');
			return done(null, false);
		};
		
		return done(null, user);
	})
}));

