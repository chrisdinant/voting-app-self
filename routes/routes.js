var path = process.cwd();
var Poll = require(path + '/javascripts/models/pollmodel.js');

module.exports = function(app, passport, flash) {
    
    function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/');
		}
	}
	app.get('/test', function(req, res) {
    	req.flash('successMessage', 'You are successfully using req-flash');
    	req.flash('errorMessage', 'No errors, you\'re doing fine');
 
    	res.redirect('/');
	});
	
    app.route('/')
        .get(function(req, res){
        	//console.log(req.sessionID);
        	req.session.returnTo = req.path;
			Poll.find({}, function(err, pollArr){
				if(err) throw err;
				//res.send(req.flash());
				res.render('pages/index', {
					pollArr: pollArr
				});
			});
		});
    
     app.route('/mypolls')
        .get(function(req, res){
        	req.session.returnTo = req.path;
			Poll.find({'poll.user': req.user.user.name}, function(err, pollArr){
				if(err) throw err;
				res.render('pages/mypolls', {
					pollArr: pollArr
				});
			});
		});

    app.get('/login', function(req,res){
        res.render('pages/login', {
        	loginMessage: req.flash('loginMessage')
        });
    });
    
    app.get('/signup', function(req,res){
        res.render('pages/signup', {
        	signupMessage: req.flash('signupMessage')
        });
    });
    
    app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});
		
	app.route('/profile')
	    .get(isLoggedIn, function(req, res){
	    	
	    	Poll.count({'poll.user': req.user.user.name}, function(err, pollcount){
	    		if(err) throw err;
	    			res.render('pages/profile', {
	    			pollCount: pollcount
	    		});	
	    	});
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
				newPoll.poll.user = req.user.user.name;
    			req.body.option.forEach(function(item){
    				newPoll.poll.options.push({'body': item, 'votes': 0});
    			});
    			newPoll.save(function (err) {
					if (err) {
						throw err;
					}
				
    			res.redirect('/polls/' +req.body.question);
    			});	
			}
		});
	});
	
	app.post('/delpoll', function(req, res){
		Poll.remove({'poll.question': req.body.question}, function(err){
			if(err) throw err;
			res.redirect('/mypolls');
		});
	});
	
	app.post('/addOption', function(req, res){
		Poll.findOne({'poll.question': decodeURIComponent(req.body.question) + '?'}, function(err, poll){
			if(err) throw err;
			poll.poll.options.push({'body': req.body.option, 'votes': 0});
			poll.save(function(err){
				if(err) throw err;
				res.redirect(req.get('referer'));
			});
		});
	});
	
	app.get('/polls/:query', function(req, res){
		
		var username = "";
		if(req.isAuthenticated()){
			username = req.user.user.name;
		}
		req.session.returnTo = req.path;
		Poll.findOne({'poll.question': req.params.query + '?'}, function(err, poll){
			if(err) throw err;
			console.log(req.user);
			if(poll) {
				var question = poll.poll.question;
				var options = poll.poll.options;
				var pollUser = poll.poll.user;
				
				if(username === pollUser){
					res.redirect('/polldata/' + req.params.query + '?');
				} else{
				res.render('pages/showpoll', {
					question: question,
					options: options,
					pollUser: pollUser
				});
				}
			}
		});
		
	});
	
	app.get('/polldata/:query', function(req, res){
		req.session.returnTo = req.path;
		Poll.findOne({'poll.question': req.params.query + '?'}, function(err, poll){
			
			if(err) throw err;
			if(poll) {
				var question = poll.poll.question;
				var options = poll.poll.options;
				var pollUser = poll.poll.user;
				
				res.render('pages/polldata', {
					question: question,
					options: options,
					pollUser: pollUser
				});
			}
		});
		
	});
	
	app.route('/votes')
		.post(function(req, res){
			
		Poll.findOne({"poll.question": decodeURIComponent(req.body.question) + '?'}, function(err, poll){
			if(err) throw err;
			
			if(poll.poll.voters.indexOf(req.sessionID) === -1){
			Poll.update({"poll.question": decodeURIComponent(req.body.question) + '?', 'poll.options.body' : req.body.option}, 
			{$inc: {'poll.options.$.votes': 1}, $push: {'poll.options.$.voters': req.sessionID, 'poll.voters': req.sessionID}}, function(err, poll){
			if(err) throw err;
			res.send('updated');
		});	
		} else {
			res.redirect('/polls/' +req.body.question);
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
			failureRedirect: '/login'}),
            function(req, res) {
                // Successful authentication, redirect home.
            res.redirect(req.session.returnTo || '/');
            delete req.session.returnTo;
        });
		
	app.get('/auth/facebook',
        passport.authenticate('facebook', { scope: 'email'}));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { 
            failureRedirect: '/login' }),
            function(req, res) {
                // Successful authentication, redirect home.
            res.redirect(req.session.returnTo || '/');
            delete req.session.returnTo;
        });
        
    app.route('/auth/google')
		.get(passport.authenticate('google', { scope: ['profile', 'email'] }));
		
	app.route('/auth/google/callback')
		.get(passport.authenticate('google', { 
            failureRedirect: '/login' }),
            function(req, res) {
                // Successful authentication, redirect home.
            res.redirect(req.session.returnTo || '/');
            delete req.session.returnTo;
        });
};