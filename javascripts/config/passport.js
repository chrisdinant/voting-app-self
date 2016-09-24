'use strict';

var GitHubStrategy = require('passport-github2').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var configAuth = require('./auth');
var User = require('../models/users');

module.exports = function(passport){
    passport.serializeUser(function (user, done) {
    	done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	}); 
	
	passport.use(new GitHubStrategy({
		clientID: configAuth.githubAuth.clientID,
		clientSecret: configAuth.githubAuth.clientSecret,
		callbackURL: configAuth.githubAuth.callbackURL,
		userEmailURL: '//github.com/api/v3/emails'
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function () {
			User.findOne({ 'login.id': profile.id }, function (err, user) {
				console.log(profile);
				if (err) {
					return done(err);
				}
				if (user) {
					return done(null, user);
				} else {
					var newUser = new User();
					
                    newUser.login.via = 'github';
					newUser.login.id = profile.id;
					newUser.login.name = profile.displayName;
					newUser.login.polls = 0;

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
	
	passport.use(new FacebookStrategy({
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL,
		profileFields: ['id', 'displayName', 'link', 'photos', 'emails']
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function () {
			User.findOne({ 'login.id': profile.id }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					return done(null, user);
				} else {
					var newUser = new User();
					newUser.login.email = profile.emails[0].value;
                    newUser.login.via = 'facebook';
					newUser.login.id = profile.id;
					newUser.login.name = profile.displayName;
					newUser.login.polls = 0;

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
			User.findOne({ 'login.id': profile.id }, function (err, user) {
				if (err) {
					return done(err);
				}
				if (user) {
					return done(null, user);
				} else {
					var newUser = new User();
					newUser.login.email = profile.emails[0].value;
					newUser.login.via = 'google';
					newUser.login.id = profile.id;
					newUser.login.name = profile.displayName;
					newUser.login.polls = 0;

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