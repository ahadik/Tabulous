var express = require('express'),
    cfenv = require('cfenv'),
    path = require('path'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash = require('connect-flash'),
    //cookieParser = require('cookie-parser'),
    session = require('express-session'),
    fs = require('fs');

require('source-map-support').install();

var vcapLocal = null
try {
  vcapLocal = require("./vcap-local.js");
}catch (e) {}

var appEnvOpts = vcapLocal ? {vcap:vcapLocal} : {};

var app = express(),
    appEnv = cfenv.getAppEnv(appEnvOpts);

var req_url = 'https://dal.objectstorage.open.softlayer.com/v1/';
var swiftCredentials = appEnv.getServiceCreds("tabulous-storage");
swiftCredentials.container = process.env.TABULOUS_OBJ_CONTAINER;
swiftCredentials.req_url = req_url;

var configDB = require('./modules/config/database.js');
var options = {
  mongos: {
    ssl: true,
    sslValidate: true,
    sslCA: [fs.readFileSync('private/cert.pem')] // cert from compose.io dashboard
  }
}

mongoose.connect(configDB.url(appEnv), options); // connect to our database

// set the view engine to ejs
app.set('view engine', 'ejs');

require('./modules/config/passport')(passport);

var __dirname = path.resolve(path.dirname());
app.use(express.static(path.join(__dirname, 'public')));
app.set(path.join('views', __dirname, 'public'));
app.set('port', process.env.VCAP_APP_PORT || 3000);
app.use(bodyParser.urlencoded({extended: true}));
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
app.use(require("skipper")());

require('./routes.js')(app, passport, swiftCredentials); // load our routes and pass in our app and fully configured passport

app.listen(app.get('port'), function() {

    var skipperSwift = require("skipper-openstack")();
    skipperSwift.ensureContainerExists(swiftCredentials, swiftCredentials.container, function (error) {
      if (error) {
        console.log("unable to create default container", swiftCredentials.container);
      }
      else {
        console.log("ensured default container", swiftCredentials.container, "exists");
      }
    });

    console.info('Server listening on port ' + this.address().port);
});
