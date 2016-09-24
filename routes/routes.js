var path = process.cwd();

module.exports = function(app, passport){
    
    function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/welcome');
		}
	}
    
    app.route('/')
        .get(isLoggedIn, function(req, res){
        res.sendFile(path + '/public/index.html');
    });
    
    app.get('/welcome', function(req, res){
        res.sendFile(path + '/public/welcome.html');
    });
    
    app.get('/login', function(req,res){
        res.sendFile(path + '/public/login.html');
    });
    
    app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/welcome');
		});
		
	app.route('/profile')
	    .get(isLoggedIn, function(req, res){
	        res.sendFile(path + '/public/profile.html');
	});
    
    app.route('/api/:id')
        .get(isLoggedIn, function(req, res){
            res.json(req.user.login);
        });
    
    app.route('/auth/github')
		.get(passport.authenticate('github', { scope: [ 'email' ] }));
		
	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
		
	app.get('/auth/facebook',
        passport.authenticate('facebook', { scope: 'email'}));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { 
            failureRedirect: '/login' }),
            function(req, res) {
                // Successful authentication, redirect home.
            res.redirect('/');
        });
        
    app.route('/auth/google')
		.get(passport.authenticate('google', { scope: ['profile', 'email'] }));
		
	app.route('/auth/google/callback')
		.get(passport.authenticate('google', {
			successRedirect: '/',
			failureRedirect: '/login'
		}))
};