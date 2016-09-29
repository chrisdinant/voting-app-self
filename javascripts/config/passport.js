'use strict';
var request = require('request');
var LocalStrategy = require('passport-local').Strategy;
var GitHubStrategy = require('passport-github2').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var configAuth = require('./auth');
var User = require('../models/users');
var githubEmail = '';

module.exports = function(passport){
    passport.serializeUser(function (user, done) {
    	done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
	
	passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);
                newUser.user.email = email;
                newUser.user.polls = 0;

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));
    
    
        // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));


	
	passport.use(new GitHubStrategy({
		clientID: configAuth.githubAuth.clientID,
		clientSecret: configAuth.githubAuth.clientSecret,
		callbackURL: configAuth.githubAuth.callbackURL,
		userEmailURL: '//api.github.com/user/emails',
		passReqToCallback : true
	},
	function (req, token, refreshToken, profile, done) {
		var options = {
    		headers: {
      			'User-Agent': 'chrisdinant',
        		'Authorization': 'token ' + token
    		},
    		json:    true,
    		url:     'https://api.github.com/user/emails'
    		};

    	// get emails using oauth token
    	request(options, function(error, response, body) {
    		if (error || response.statusCode != 200) {
        		console.error(error, body);
        		done(null, false, {message: "can't connect to github."});
        		return;
    		}
    		githubEmail = body[0].email;
    	
		
		process.nextTick(function () {
			
			User.findOne({ 'user.email': githubEmail }, function (err, user) {
				
				if (err) {
					return done(err);
				}
				if (user) {
					user.user.name=profile.displayName;
					user.user.email = githubEmail;
					user.github.email=githubEmail;
					user.github.name=profile.displayName;
					user.github.token=token;
					user.github.id=profile.id;
					user.save(function(err){
						if (err) {
							throw err;
						}
						return done(null, user);
					});
				} else {
					var newUser = new User();
					newUser.user.name = profile.displayName;
                	newUser.github.id = profile.id;
					newUser.github.name = profile.displayName;
					newUser.github.token = token;
					newUser.github.email = githubEmail;
					newUser.user.email = githubEmail;
					
					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
				}
			});
		});
    	});
	}));
	
	
	passport.use(new FacebookStrategy({
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL,
		profileFields: ['id', 'displayName', 'link', 'photos', 'emails']
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function () {
			User.findOne({ 'user.email': profile.emails[0].value }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					user.user.name=profile.displayName;
					user.user.email = profile.emails[0].value;
					user.facebook.email=profile.emails[0].value;
					user.facebook.name=profile.displayName;
					user.facebook.token=token;
					user.facebook.id=profile.id;
					user.save(function(err){
						if (err) {
							throw err;
						}
						return done(null, user);
					});
					
				} else {
					var newUser = new User();
					newUser.user.name=profile.displayName;
					newUser.facebook.email = profile.emails[0].value;
                    newUser.facebook.id = profile.id;
					newUser.facebook.name = profile.displayName;
					newUser.facebook.token = token;
					newUser.user.email = profile.emails[0].value;
					
					newUser.save(function (err) {
						if (err) {
							throw err;
						}
						return done(null, newUser);
					});
				}
			});
		});
	}));
	
	passport.use(new GoogleStrategy({
		clientID: configAuth.googleAuth.clientID,
		clientSecret: configAuth.googleAuth.clientSecret,
		callbackURL: configAuth.googleAuth.callbackURL,
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function () {
			User.findOne({ 'user.email': profile.emails[0].value }, function (err, user) {
				if (err) {
					return done(err);
				}
				if (user) {
					user.user.name=profile.displayName;
					user.user.email = profile.emails[0].value;
					user.google.name = profile.displayName;
					user.google.email = profile.emails[0].value;
					user.google.id = profile.id;
					user.google.token = token;
					user.save(function(err) {
                        if (err)
                            return done(err);
                        return done(null, user);
                    });
				} else {
					var newUser = new User();
					newUser.user.name=profile.displayName;
					newUser.google.email = profile.emails[0].value;
					newUser.google.token = token;
					newUser.google.id = profile.id;
					newUser.google.name = profile.displayName;
					newUser.user.email = profile.emails[0].value;
					
					newUser.save(function (err) {
						if (err) {
							throw err;
						}
						return done(null, newUser);
					});
				}
			});
		});
	}));
};