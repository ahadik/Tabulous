var express = require('express'),
    cfenv = require('cfenv'),
    path = require('path'),
    bodyParser = require('body-parser'),
    upload = require('./modules/final/upload'),
    fs;

var app = express(),
    appEnv = cfenv.getAppEnv();

app.use(express.static(path.join(__dirname, 'public')));
//app.set(path.join('views', __dirname, '/apps'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/upload', function(req, res){
    res.sendFile('public/upload.html', {root : __dirname});
});

app.post('/upload', function(req, res){
	var file = upload.router(req, res);
});

app.get('/', function(req, res){
    res.send('index.html');
})

app.listen(3000, function() {
    console.info('Server listening on port ' + this.address().port);
});
