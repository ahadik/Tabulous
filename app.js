var express = require('express'),
		cfenv = require('cfenv'),
		path = require('path'),
		bodyParser = require('body-parser'),
		mongoose = require('mongoose'),
		passport = require('passport'),
		flash = require('connect-flash'),
		//cookieParser = require('cookie-parser'),
		session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    fs = require('fs'),
    assert = require('assert');

require('babel-core/register');
require('source-map-support').install();

var vcapLocal = null
try {
	vcapLocal = require("./vcap-local.js");
}catch (e) {}

var appEnvOpts = vcapLocal ? {vcap:vcapLocal} : {};

var app = express(),
		appEnv = cfenv.getAppEnv(appEnvOpts);

var softlayerObjStoreCreds = appEnv.getServiceCreds("tabulous-sl-os-store");
var configDB = require('./modules/config/database.js');
var ca =[fs.readFileSync('private/cert.pem')];
var options = {
	mongos: {
		ssl: true,
		sslValidate: true,
		sslCA: ca // cert from compose.io dashboard
	}
}

mongoose.connect(configDB.url(appEnv), options); // connect to our database

// set the view engine to ejs
app.set('view engine', 'ejs');

require('./modules/config/passport')(passport);

var __dirname = path.resolve(path.dirname());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',	express.static(__dirname + '/bower_components'));
app.set(path.join('views', __dirname, 'public'));
if(process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'staging'){
	app.set('port', process.env.VCAP_APP_PORT || 80);
}else{
	app.set('port', 3000);
}
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//app.use(cookieParser({ secret: process.env.SESSION_SECRET }));

app.use(session({
    key : 'SessionKey',
    secret : 'CATONTHEKEYBOARD',
    cookie : {
        path : '/',
        httpOnly : true,
        maxAge : null
    },
    resave: true,
    saveUninitialized: true,
    store : new MongoStore({
        url : configDB.url(appEnv),
        mongoOptions : {
            mongos : {
                ssl : true,
                sslValidate : true,
                sslCA : ca,
                ca : ca, 
                poolSize : 1,
                reconnectTries : 1
            }
        },
        collection : 'sessions',
        stringify : false
    }).on('connected', function(result) {
        console.log('Connected to sessions db!');
        return;

    })
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(require("skipper")());

require('./routes.js')(app, passport, softlayerObjStoreCreds); // load our routes and pass in our app and fully configured passport

app.listen(app.get('port'), function() {
		var skipperSwift = require("skipper-openstack")();
		skipperSwift.ensureContainerExists(softlayerObjStoreCreds, softlayerObjStoreCreds.container, function (error) {
			if (error) {
				console.log(error);
				console.log("unable to create default container", softlayerObjStoreCreds.container);
			}
			else {
				console.log("ensured default container", softlayerObjStoreCreds.container, "exists");
			}
		});
		console.info('Server listening on port ' + this.address().port);
});
