'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
    poll: {
        user: String,
        voters: [String],
        question: String,
        options: [{body: String, votes: Number, voters: [String]}]
    }
});

module.exports = mongoose.model('Poll', Poll);