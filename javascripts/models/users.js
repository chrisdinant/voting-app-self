'use strict';

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

module.exports = mongoose.model('User', User);