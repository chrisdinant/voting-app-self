var Poll = require('../models/pollmodel.js');

$("#pollSubmit").on('click', submitPoll());

function submitPoll(e){
    e.preventDefault();
    var newPoll = new Poll();
    newPoll.poll.user=
    
}