var path = process.cwd();

module.exports = function(app){
    
    app.get('/', function(req, res){
        res.sendFile(path + '/public/index.html');
    });
    
    app.get('/login', function(req,res){
        res.sendFile(path + '/public/login.html');
    });
};