'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
    poll: {
        user: String,
        question: String,
        options: [{body: String, votes: Number}]
    }
});

module.exports = mongoose.model('Poll', Poll);