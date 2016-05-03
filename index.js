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
	
	//cookieParser = require('cookie-parser'),
	session = __webpack_require__(8),
	    fs = __webpack_require__(9);
	__webpack_require__(10);
	
	__webpack_require__(11).install();
	
	var vcapLocal = null;
	try {
	  vcapLocal = __webpack_require__(12);
	} catch (e) {}
	
	var appEnvOpts = vcapLocal ? { vcap: vcapLocal } : {};
	
	var app = express(),
	    appEnv = cfenv.getAppEnv(appEnvOpts);
	
	var req_url = 'https://dal.objectstorage.open.softlayer.com/v1/';
	var swiftCredentials = appEnv.getServiceCreds("tabulous-storage");
	swiftCredentials.container = process.env.TABULOUS_OBJ_CONTAINER;
	swiftCredentials.req_url = req_url;
	
	var configDB = __webpack_require__(13);
	var options = {
	  mongos: {
	    ssl: true,
	    sslValidate: true,
	    sslCA: [fs.readFileSync('private/cert.pem')] // cert from compose.io dashboard
	  }
	};
	
	mongoose.connect(configDB.url(appEnv), options); // connect to our database
	
	// set the view engine to ejs
	app.set('view engine', 'ejs');
	
	__webpack_require__(14)(passport);
	
	var __dirname = path.resolve(path.dirname());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use('/bower_components', express.static(__dirname + '/bower_components'));
	app.set(path.join('views', __dirname, 'public'));
	app.set('port', process.env.VCAP_APP_PORT || 3000);
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	//app.use(cookieParser({ secret: process.env.SESSION_SECRET }));
	
	// required for passport
	//app.set('trust proxy', 1) // trust first proxy
	app.use(session({
	  secret: process.env.SESSION_SECRET,
	  resave: false,
	  saveUninitialized: true,
	  cookie: {}
	}));
	
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
	app.use(__webpack_require__(19)());
	
	__webpack_require__(20)(app, passport, swiftCredentials); // load our routes and pass in our app and fully configured passport
	
	app.listen(app.get('port'), function () {
	
	  var skipperSwift = __webpack_require__(25)();
	  skipperSwift.ensureContainerExists(swiftCredentials, swiftCredentials.container, function (error) {
	    if (error) {
	      console.log("unable to create default container", swiftCredentials.container);
	    } else {
	      console.log("ensured default container", swiftCredentials.container, "exists");
	    }
	  });
	
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

	module.exports = require("express-session");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("babel-core/register");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("source-map-support");

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function () {
		var vcap = {
			services: {
				"user-provided": [{
					"name": "tabulous-mongo",
					"label": "user-provided",
					"credentials": {
						"uri": process.env.TABULOUS_DB_URI,
						"port": process.env.TABULOUS_DB_PORT,
						"user": process.env.TABULOUS_DB_UN,
						"password": process.env.TABULOUS_DB_PW
					}
				}],
				"Object-Storage": [{
					"name": "tabulous-storage",
					"label": "Object-Storage",
					"plan": "standard",
					"credentials": {
						"auth_url": process.env.TABULOUS_OBJ_AUTH_URL,
						"token_url": process.env.TABULOUS_OBJ_TOKEN_URL,
						"project": process.env.TABULOUS_OBJ_PROJECT,
						"projectId": process.env.TABULOUS_OBJ_PROJECT_ID,
						"region": process.env.TABULOUS_OBJ_REGION,
						"userId": process.env.TABULOUS_OBJ_USER_ID,
						"username": process.env.TABULOUS_OBJ_UN,
						"password": process.env.TABULOUS_OBJ_PW,
						"domainId": process.env.TABULOUS_OBJ_DOMAIN_ID,
						"domainName": process.env.TABULOUS_OBJ_DOMAIN_NAME
					}
				}]
			}
		};
		return vcap;
	}();

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = {
		'url': function url(appEnv) {
			var mongoCreds = appEnv.getServiceCreds("tabulous-mongo");
			mongoCreds.database = process.env.TABULOUS_DB;
			return "mongodb://" + mongoCreds.user + ":" + mongoCreds.password + "@" + mongoCreds.uri + ":" + mongoCreds.port + "/" + mongoCreds.database + "?ssl=true";
		}
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// load all the things we need
	var FacebookStrategy = __webpack_require__(15).Strategy;
	
	// load up the user model
	var User = __webpack_require__(16);
	
	// load the auth variables
	var configAuth = __webpack_require__(18);
	
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
/* 15 */
/***/ function(module, exports) {

	module.exports = require("passport-facebook");

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// load the things we need
	var mongoose = __webpack_require__(5);
	var bcrypt = __webpack_require__(17);
	
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
/* 17 */
/***/ function(module, exports) {

	module.exports = require("bcrypt-nodejs");

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';
	
	// expose our config directly to our application using module.exports
	module.exports = {
	
	    'facebookAuth': {
	        'clientID': process.env.FACEBOOK_CLIENT_ID, // your App ID
	        'clientSecret': process.env.FACEBOOK_CLIENT_SECRET, // your App Secret
	        'callbackURL': process.env.TABULOUS_FACEBOOK_CALLBACK
	    }
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = require("skipper");

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = function (app, passport, swiftCredentials) {
	    var path = __webpack_require__(3);
	    var __dirname = path.resolve(path.dirname());
	    var objStorage = __webpack_require__(21).install(swiftCredentials);
	    var converter = __webpack_require__(26);
	
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
	        objStorage.createObject(false, req, res);
	    });
	
	    app.post('/convert', function (req, res) {
	        converter.toPDF(req, res);
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
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var request = __webpack_require__(22);
	var fs = __webpack_require__(9);
	var mimeTypes = __webpack_require__(23);
	var crypto = __webpack_require__(24);
	
	/*
		TODO: set request URL automatically from token request
	*/
	
	module.exports = {
		token: null,
		accountData: {},
		expiration: 0,
		install: function install(credentials) {
			//Check if the token URL was brought in with the VCAP credentials. If not, add it from environmental variables.
			if (Object.keys(credentials).indexOf('token_url') == -1) {
				credentials['token_url'] = process.env.TABULOUS_OBJ_TOKEN_URL;
			}
	
			if (this.checkAccountData(credentials)) {
				this.accountData = credentials;
			} else {
				process.stderr.write('Invalid credentials\n');
			}
			return this;
		},
	
		checkAccountData: function checkAccountData(credentials) {
	
			['auth_url', 'token_url', 'project', 'projectId', 'region', 'userId', 'username', 'password', 'domainId', 'domainName', 'req_url'].forEach(function (key) {
				if (Object.keys(credentials).indexOf(key) == -1) {
					return false;
				}
			});
			return true;
		},
	
		setToken: function setToken(callback) {
			var form = {
				"auth": {
					"identity": {
						"methods": ["password"],
						"password": {
							"user": {
								"id": this.accountData.userId,
								"password": this.accountData.password
							}
						}
					},
					"scope": {
						"project": {
							"id": this.accountData.projectId
						}
					}
				}
			};
	
			var options = {
				json: form,
				method: 'POST',
				uri: this.accountData.token_url
			};
			var that = this;
			function processResponse(error, response, body) {
				if (!error && response.statusCode == 201) {
					that.token = response.caseless.dict['x-subject-token'];
					this.expiration = new Date(response.body.token.expires_at);
					if (callback) {
						callback(that.token);
					}
				} else {
					process.stderr.write('TOKEN AUTHENTICATION FAILED:\n');
					process.stderr.write(error + '\n');
					process.stderr.write(response.statusCode + '\n');
				}
			}
	
			request.post(options, processResponse);
		},
	
		setContainer: function setContainer(container) {
			this.container = container;
		},
	
		listContainerContents: function listContainerContents(cont) {
			var container = this.accountData.container;
			if (!container) {
				container = cont;
			}
			var that = this;
			var listReq = function listReq(token) {
				request({
					'url': that.accountData.req_url + 'AUTH_' + that.accountData.project_id + '/' + container,
					'headers': { 'X-Auth-Token': token }
				}, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						console.log(response.body);
					} else {
						console.log(error);
						console.log(response.statusCode);
					}
				});
			};
			//if the token has expired, get and set a new one first
			if (this.expiration < new Date()) {
				this.setToken(listReq);
			} else {
				listReq(this.token);
			}
		},
		createObject: function createObject(cont, req, res) {
			var skipperSwift = __webpack_require__(25)();
	
			var container = this.accountData.container;
			if (!container) {
				container = cont;
			}
			var that = this;
			crypto.pseudoRandomBytes(16, function (err, raw) {
				var filename = raw.toString('hex') + '.' + mimeTypes.extension(req.file('wireframe')._files[0].stream.headers['content-type']);
				req.file('wireframe')._files[0].stream.filename = filename;
				req.file('wireframe').upload({
					adapter: __webpack_require__(25),
					credentials: that.accountData,
					container: container
				}, function (err, uploadedFiles) {
					if (err) {
						console.log(err);
						return res.json({
							success: false,
							error: err
						});
					} else {
						console.log(that.accountData);
						return res.json({
							success: true,
							path: 'http://dal.objectstorage.open.softlayer.com/v1/AUTH_' + that.accountData.projectId + '/' + that.accountData.container + '/' + filename
						});
					}
				});
			});
		}
	};

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = require("mime-types");

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = require("skipper-openstack");

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }
	
	var Rsvg = __webpack_require__(27).Rsvg;
	var request = __webpack_require__(22).defaults({ encoding: null });
	var cfenv = __webpack_require__(2);
	var fs = __webpack_require__(9);
	var Readable = __webpack_require__(28).Readable;
	
	function parseSVG(svgText, resolve) {
		var svg = void 0,
		    sections = void 0;
		var svgStart = void 0;
		var regex = /[^\"]*/;
	
		var _svgText$split = svgText.split("xlink:href=\"");
	
		var _svgText$split2 = _toArray(_svgText$split);
	
		svgStart = _svgText$split2[0];
		sections = _svgText$split2.slice(1);
	
	
		var section = sections.shift();
		//extract the url from the start of the section
		var url = section.match(regex)[0];
		//remove the url from the section
		section = section.replace(url, '');
	
		request.get(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
				resolve(svgStart + "xlink:href=\"" + data + section);
			}
		});
	}
	
	module.exports = {
		toPDF: function toPDF(req, res) {
			var svg = new Rsvg();
			var svgText = req.body.svg;
			var fileName = req.body.projectID;
			var p = new Promise(function (resolve) {
				parseSVG(svgText, resolve);
			});
			p.then(function (results) {
				svg.on('finish', function () {
					res.attachment(fileName + '.pdf');
					res.setHeader("Content-type", "application/pdf");
					var rs = Readable();
					rs._read = function () {
						rs.push(svg.render({
							format: 'pdf',
							width: svg.width,
							height: svg.height
						}).data);
						rs.push(null);
					};
					rs.pipe(res);
					res.end();
				});
				var rs = Readable();
				rs._read = function () {
					rs.push(results);
					rs.push(null);
				};
	
				rs.pipe(svg);
			});
		}
	};

/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = require("librsvg");

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = require("stream");

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map