var express = require('express');
var bodyParser = require('body-parser');
var path = process.cwd();
var routes = require(path + '/routes/routes.js');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

require('dotenv').load();
require('./javascripts/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to mongo');
});

app.set('view engine', 'ejs');

app.use('/public', express.static(path + '/public'));
app.use("/public/styles", express.static(path + "/public/styles"));
app.use('/front', express.static(path + '/javascripts/front'));
app.use(bodyParser());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
	secret: 'secretVote',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);


var port = Number(process.env.PORT || 8080);
app.listen(port, function(){
    console.log("check");
});