var path = process.cwd();
var Poll = require(path + '/javascripts/models/pollmodel.js');


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
        	res.render('pages/index');
        });
    
    app.get('/welcome', function(req, res){
        res.render('pages/welcome');
        
    });
    
    app.get('/login', function(req,res){
        res.sendFile(path + '/public/login.html');
    });
    
    app.get('/signup', function(req,res){
        res.sendFile(path + '/public/signup.html');
    });
    
    app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/welcome');
		});
		
	app.route('/profile')
	    .get(isLoggedIn, function(req, res){
	        res.render('pages/profile');
	});
	
	app.route('/newpoll')
		.get(isLoggedIn, function(req, res){
			res.render('pages/newpoll');
		});
		
	app.post('/pollupload', function(req, res){
		
		Poll.findOne({'poll.question': req.body.question}, function(err, poll){
			
			if(err){
				throw err;
			}
			if (poll) {
				res.send('poll already exists');
			}
			else {
				var newPoll = new Poll();
				newPoll.poll.question = req.body.question;
				newPoll.poll.user = req.user.user.email;
    			req.body.option.forEach(function(item){
    				newPoll.poll.options.push({'body': item, 'votes': 0});
    			});
    			newPoll.save(function (err) {
					if (err) {
						throw err;
					}
				req.user.user.polls += 1;
				req.user.save(function(err) {
					if(err){
						throw err;
					}
				});
    			res.redirect('/polls/' +req.body.question);
    			});	
			}
		});
		
	});
	
	app.get('/polls', function(req, res){
		res.render('pages/polllist');
	});
	
	app.get('/polls/:query', function(req, res){
		
		Poll.findOne({'poll.question': req.params.query + '?'}, function(err, poll){
			
			if(err) throw err;
			if(poll){
				var question = poll.poll.question;
				var options = poll.poll.options;
				res.render('pages/showpoll', {
					question: question,
					options: options
				});
				
			}
		});
		
	});
    
    app.route('/api/:id')
        .get(isLoggedIn, function(req, res){
        	res.json(req.user.user);
        });
        
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
        
    app.route('/auth/github')
		.get(passport.authenticate('github', { scope: [ 'user:email' ] }));
		
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
		}));
};