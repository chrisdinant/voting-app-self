var express = require('express');
var path = process.cwd();
var routes = require(path + '/routes/routes.js');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

require('dotenv').load();

app.use('/public', express.static(path + '/public'));
app.use("/public/styles", express.static(path + "/public/styles"));

routes(app);


var port = Number(process.env.PORT || 8080);
app.listen(port, function(){
    console.log("check");
});