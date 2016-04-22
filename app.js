var express = require('express'),
    cfenv = require('cfenv'),
    path = require('path'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash = require('connect-flash'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    fs = require('fs');

require('source-map-support').install();

var app = express(),
    appEnv = cfenv.getAppEnv();


// set the view engine to ejs
app.set('view engine', 'ejs');

var configDB = require('./modules/config/database.js');
var options = {
  mongos: {
    ssl: true,
    sslValidate: true,
    sslCA: [fs.readFileSync('private/cert.pem')] // cert from compose.io dashboard
  }
}
mongoose.connect(configDB.url(appEnv), options); // connect to our database

require('./modules/config/passport')(passport);

var __dirname = path.resolve(path.dirname());
app.use(express.static(path.join(__dirname, 'public')));
app.set(path.join('views', __dirname, 'public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

// required for passport
app.use(session({ secret: process.env.SESSION_SECRET })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.listen(3000, function() {
    console.info('Server listening on port ' + this.address().port);
});
