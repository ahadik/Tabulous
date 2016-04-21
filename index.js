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

	/* WEBPACK VAR INJECTION */(function(__dirname) {'use strict';
	
	var express = __webpack_require__(1),
	    cfenv = __webpack_require__(2),
	    path = __webpack_require__(3),
	    bodyParser = __webpack_require__(4),
	    upload = __webpack_require__(5),
	    fs;
	
	var app = express(),
	    appEnv = cfenv.getAppEnv();
	
	app.use(express.static(path.join(__dirname, 'public')));
	//app.set(path.join('views', __dirname, '/apps'));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	
	app.get('/upload', function (req, res) {
	    res.sendFile('public/upload.html', { root: __dirname });
	});
	
	app.post('/upload', function (req, res) {
	    var file = upload.router(req, res);
	});
	
	app.get('/', function (req, res) {
	    res.send('index.html');
	});
	
	app.listen(3000, function () {
	    console.info('Server listening on port ' + this.address().port);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _exports = module.exports = {};
	var crypto = __webpack_require__(6);
	var multer = __webpack_require__(7);
	var mime = __webpack_require__(8);
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
/* 6 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("multer");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("mime");

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map