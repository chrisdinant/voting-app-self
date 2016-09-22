'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	login: {
	    via: String,
	    id: String,
	    name: String,
	    polls: Number
	}
});

module.exports = mongoose.model('User', User);