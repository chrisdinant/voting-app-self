var express = require('express');
var path = process.cwd();
var routes = require(path + '/routes/routes.js');
var app = express();

routes(app);


var port = Number(process.env.PORT || 8080);
app.listen(port, function(){
    console.log("check");
});