var express = require('express'),
    cfenv = require('cfenv'),
    path = require('path'),
    bodyParser = require('body-parser'),
    hello_world = require('./modules/final/hello-world'), //for demonstration purposes only
    fs,
    multer = require('multer');

var app = express(),
    appEnv = cfenv.getAppEnv(),
    storage = multer.diskStorage({
    	destination: function(req, file, callback){
    		callback(null, './uploads');
    	}
    });
var upload = multer({storage : storage}).single('wireframe');

app.post('/upload', function(req, res){
	upload(req, res, function(err){
		if(err){
			return res.end('Error uploading file.');
		}
		res.end('File is uploaded');
	});
});

app.use(express.static(path.join(__dirname, 'public')));
//app.set(path.join('views', __dirname, '/apps'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send('index.html');
})

app.listen(3000, function() {
    console.info('Server listening on port ' + this.address().port);
});
