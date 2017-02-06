var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var express = require('express');
var router = express.Router();

module.exports = router;

//Prend user id et la save dans la session
passport.serializeUser(function(user, done){
	done(null, user.id);
});

//si l'id est trouvée, la sauvegarde dans user
//Si ne la trouve pas retourne error
passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		done(err, user);
	});
});

//Fonction signup
passport.use('local.signup', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback : true
}, function(req, email, password, done){
	
	//Check si l'utilisateur existe déjà, si il existe : error, sinon newUser
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


//Fonction login
passport.use('local.login', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback : true
}, function(req, email, password, done){
	
	//Check si l'email a déjà été utilisée
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

