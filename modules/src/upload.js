var exports = module.exports = {};
var crypto = require('crypto');
var multer = require('multer');
var mime = require('mime');
var storage = multer.diskStorage({
	destination: function(req, file, callback){
		callback(null, './public/uploads');
	},
	filename: function (req, file, cb) {
		crypto.pseudoRandomBytes(16, function (err, raw) {
			cb(null, raw.toString('hex') + '.' + mime.extension(file.mimetype));
		});
	}
});

var upload = multer({storage : storage}).single('wireframe');

exports.router = (req, res) => {
	upload(req, res, function(err){
		if(err){
            console.log(err);
			return res.end('Error uploading file.');
		}
		req.file.success=true;
		res.json(req.file);
        return req.file;
	});
}