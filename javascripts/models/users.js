'use strict';

var bcrypt   = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	user:{
		name: String,
		email: String,
		polls: Number
	},
	local: {
		email: String,
	    password: String,
	},
	facebook: {
		email: String,
		token: String,
		name: String,
		id: String
	},
	github: {
		email: String,
		name: String,
		token: String,
		id: String,
	},
	google: {
		name: String,
		token: String,
		email: String,
		id: String
	},

});

// methods ======================
// generating a hash
User.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
User.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


module.exports = mongoose.model('User', User);