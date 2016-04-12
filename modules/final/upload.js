'use strict';

var _exports = module.exports = {};
var crypto = require('crypto');
var multer = require('multer');
var mime = require('mime');
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
		res.json(req.file);
		return req.file;
	});
};