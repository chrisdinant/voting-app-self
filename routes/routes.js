var path = process.cwd();

module.exports = function(app){
    
    app.get('/', function(req, res){
        res.sendFile(path + '/views/main.html');
    });
    
};