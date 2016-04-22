/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var express = __webpack_require__(1),
	    cfenv = __webpack_require__(2),
	    path = __webpack_require__(3),
	    bodyParser = __webpack_require__(4),
	    mongoose = __webpack_require__(5),
	    passport = __webpack_require__(6),
	    flash = __webpack_require__(7),
	    cookieParser = __webpack_require__(8),
	    session = __webpack_require__(9),
	    fs = __webpack_require__(10);
	
	__webpack_require__(11).install();
	
	var app = express(),
	    appEnv = cfenv.getAppEnv();
	
	// set the view engine to ejs
	app.set('view engine', 'ejs');
	
	var configDB = __webpack_require__(12);
	var options = {
	    mongos: {
	        ssl: true,
	        sslValidate: true,
	        sslCA: [fs.readFileSync('private/cert.pem')] // cert from compose.io dashboard
	    }
	};
	mongoose.connect(configDB.url(appEnv), options); // connect to our database
	
	__webpack_require__(13)(passport);
	
	var __dirname = path.resolve(path.dirname());
	app.use(express.static(path.join(__dirname, 'public')));
	app.set(path.join('views', __dirname, 'public'));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(cookieParser());
	
	// required for passport
	app.use(session({ secret: process.env.SESSION_SECRET })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
	
	__webpack_require__(18)(app, passport); // load our routes and pass in our app and fully configured passport
	
	app.listen(3000, function () {
	    console.info('Server listening on port ' + this.address().port);
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("cfenv");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("mongoose");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("passport");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("connect-flash");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("cookie-parser");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("express-session");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("source-map-support");

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
		'url': function url(appEnv) {
			var mongo_uri, mongo_un, mongo_pw, mongo_port, mongo_db_name;
			if (appEnv.isLocal) {
				mongo_uri = process.env.TABULOUS_DB_URI;
				mongo_un = process.env.TABULOUS_DB_UN;
				mongo_port = process.env.TABULOUS_DB_PORT;
				mongo_db_name = process.env.TABULOUS_DB;
				mongo_pw = process.env.TABULOUS_DB_PW;
			} else {
				var user_provided = JSON.parse(process.env.VCAP_SERVICES)['user-provided'];
				var credentials;
				for (var i = 0; i < user_provided.length; i++) {
					if (user_provided[i]['name'] == 'tabulous-mongo') {
						credentials = user_provided[i]['credentials'];
					}
				}
				mongo_uri = credentials['uri'];
				mongo_port = credentials['port'];
				mongo_db_name = 'production';
				mongo_un = credentials['user'];
				mongo_pw = credentials['password'];
			}
			return "mongodb://" + mongo_un + ":" + mongo_pw + "@" + mongo_uri + ":" + mongo_port + "/" + mongo_db_name + "?ssl=true";
		}
		//'url' : 'mongodb://<user>:<password>@aws-us-east-1-portal.16.dblayer.com:10228/development'
		/*
	    'url' : function(appEnv){ return 'mongodb://'+( appEnv.isLocal ? process.env.TABULOUS_DB_UN : appEnv.services()['user-provided']['credentials']['user'])
	    		+':'+( appEnv.isLocal == true ? process.env.TABULOUS_DB_PW : appEnv.services()['user-provided']['credentials']['password'])
	    		+'@'+( appEnv.isLocal == true ? process.env.TABULOUS_DB_URI : appEnv.services()['user-provided']['credentials']['uri'])
	    		+':'+( appEnv.isLocal == true ? process.env.TABULOUS_DB_PORT : appEnv.services()['user-provided']['credentials']['port'])
	    		+(appEnv.isLocal == true ? '/development?ssl=true' : '/production');
	    	}
	    */
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// load all the things we need
	var FacebookStrategy = __webpack_require__(14).Strategy;
	
	// load up the user model
	var User = __webpack_require__(15);
	
	// load the auth variables
	var configAuth = __webpack_require__(17);
	
	module.exports = function (passport) {
	
	    // used to serialize the user for the session
	    passport.serializeUser(function (user, done) {
	        done(null, user.id);
	    });
	
	    // used to deserialize the user
	    passport.deserializeUser(function (id, done) {
	        User.findById(id, function (err, user) {
	            done(err, user);
	        });
	    });
	
	    // =========================================================================
	    // FACEBOOK ================================================================
	    // =========================================================================
	    passport.use(new FacebookStrategy({
	
	        // pull in our app id and secret from our auth.js file
	        clientID: configAuth.facebookAuth.clientID,
	        clientSecret: configAuth.facebookAuth.clientSecret,
	        callbackURL: configAuth.facebookAuth.callbackURL,
	        profileFields: ['id', 'name', 'email']
	
	    },
	
	    // facebook will send back the token and profile
	    function (token, refreshToken, profile, done) {
	        // asynchronous
	        process.nextTick(function () {
	
	            // find the user in the database based on their facebook id
	            User.findOne({ 'facebook.id': profile.id }, function (err, user) {
	
	                // if there is an error, stop everything and return that
	                // ie an error connecting to the database
	                if (err) return done(err);
	
	                // if the user is found, then log them in
	                if (user) {
	                    return done(null, user); // user found, return that user
	                } else {
	                        // if there is no user found with that facebook id, create them
	                        var newUser = new User();
	                        console.log(profile);
	                        // set all of the facebook information in our user model
	                        newUser.facebook.id = profile.id; // set the users facebook id                  
	                        newUser.facebook.token = token; // we will save the token that facebook provides to the user                   
	                        newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
	                        newUser.facebook.first_name = profile.name.givenName;
	                        newUser.facebook.last_name = profile.name.familyName;
	                        newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
	
	                        // save our user to the database
	                        newUser.save(function (err) {
	                            if (err) throw err;
	
	                            // if successful, return the new user
	                            return done(null, newUser);
	                        });
	                    }
	            });
	        });
	    }));
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("passport-facebook");

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// load the things we need
	var mongoose = __webpack_require__(5);
	var bcrypt = __webpack_require__(16);
	
	// define the schema for our user model
	var userSchema = mongoose.Schema({
	
	    local: {
	        email: String,
	        password: String
	    },
	    facebook: {
	        id: String,
	        token: String,
	        email: String,
	        name: String,
	        first_name: String,
	        last_name: String
	    },
	    twitter: {
	        id: String,
	        token: String,
	        displayName: String,
	        username: String
	    },
	    google: {
	        id: String,
	        token: String,
	        email: String,
	        name: String
	    }
	});
	
	// methods ======================
	// generating a hash
	userSchema.methods.generateHash = function (password) {
	    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	};
	
	// checking if password is valid
	userSchema.methods.validPassword = function (password) {
	    return bcrypt.compareSync(password, this.local.password);
	};
	
	// create the model for users and expose it to our app
	module.exports = mongoose.model('User', userSchema);

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = require("bcrypt-nodejs");

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';
	
	// expose our config directly to our application using module.exports
	module.exports = {
	
	    'facebookAuth': {
	        'clientID': process.env.FACEBOOK_CLIENT_ID, // your App ID
	        'clientSecret': process.env.FACEBOOK_CLIENT_SECRET, // your App Secret
	        'callbackURL': 'http://localhost:3000/auth/facebook/callback'
	    }
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = function (app, passport) {
	    var path = __webpack_require__(3);
	    var __dirname = path.resolve(path.dirname());
	    var upload = __webpack_require__(19);
	    // route for home page
	    app.get('/', function (req, res) {
	        res.render('index.ejs');
	    });
	
	    app.get('/canvas', isLoggedIn, function (req, res) {
	        res.render('canvas.ejs', {
	            name: req.user.facebook.first_name,
	            newUser: true
	        });
	    });
	
	    // =====================================
	    // FACEBOOK ROUTES =====================
	    // =====================================
	    // route for facebook authentication and login
	    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
	
	    // handle the callback after facebook has authenticated the user
	    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	        successRedirect: '/canvas',
	        failureRedirect: '/'
	    }));
	
	    // route for logging out
	    app.get('/logout', function (req, res) {
	        req.logout();
	        res.redirect('/');
	    });
	
	    app.post('/upload', isLoggedIn, function (req, res) {
	        var file = upload.router(req, res);
	    });
	};
	
	// route middleware to make sure a user is logged in
	function isLoggedIn(req, res, next) {
	
	    // if user is authenticated in the session, carry on
	    if (req.isAuthenticated()) return next();
	
	    // if they aren't redirect them to the home page
	    res.redirect('/');
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _exports = module.exports = {};
	var crypto = __webpack_require__(20);
	var multer = __webpack_require__(21);
	var mime = __webpack_require__(22);
	var storage = multer.diskStorage({
		destination: function destination(req, file, callback) {
			callback(null, './public/uploads');
		},
		filename: function filename(req, file, cb) {
			crypto.pseudoRandomBytes(16, function (err, raw) {
				cb(null, raw.toString('hex') + '.' + mime.extension(file.mimetype));
			});
		}
	});
	
	var upload = multer({ storage: storage }).single('wireframe');
	
	_exports.router = function (req, res) {
		upload(req, res, function (err) {
			if (err) {
				console.log(err);
				return res.end('Error uploading file.');
			}
			req.file.success = true;
			res.json(req.file);
			return req.file;
		});
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("multer");

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = require("mime");

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map