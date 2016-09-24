'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	login: {
		email: String,
	    via: String,
	    id: String,
	    name: String,
	    polls: Number
	}
});

module.exports = mongoose.model('User', User);