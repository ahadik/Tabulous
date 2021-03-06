module.exports = function(app, passport, softlayerObjStoreCredentials) {
    var path = require('path');
    var __dirname = path.resolve(path.dirname());
    var objStorage = require('./modules/object_storage/index.js');
    var converter = require('./modules/conversion/index.js');

    // route for home page
    app.get('/', isLoggedIn, function(req, res){
        res.redirect('/canvas');
    });

    app.get('/login', function(req, res){
        res.render('index.ejs');
    });

    app.get('/canvas', isLoggedIn, function(req,res){
        res.render('canvas.ejs', {
            name : req.user.facebook.first_name,
            newUser: true
        });
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            session : true,
            failureRedirect : '/login'
        }),
        function(req, res){
            res.redirect('/canvas')
        },
        function(err,req,res,next) {
            // You could put your own behavior in here, fx: you could force auth again...
            // res.redirect('/auth/facebook/');
            if(err) {
                res.redirect('/auth/facebook/')
            }
        }
    );

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

    app.get('/demo', function(req,res){
        res.render('demo.ejs');
    });

    app.post('/upload', isLoggedIn, function(req, res){
        objStorage.createObject(softlayerObjStoreCredentials,req,res);
    });

    app.post('/convert', function(req,res){
        converter.toPDF(req,res);
    });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}