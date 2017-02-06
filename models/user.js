var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var userSchema = mongoose.Schema({
	fullname : {type : String},
	email : {type : String},
	password: {type : String}
});

// Sa crypte le mdp oklm (à enlever aussi peut être)
userSchema.methods.encryptPassword = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

//fonction Check si mdp est le même
//password : input de l'utilisateur
//this.password : mdp de la db

userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);