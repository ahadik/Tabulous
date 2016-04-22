// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : process.env.FACEBOOK_CLIENT_ID, // your App ID
        'clientSecret'  : process.env.FACEBOOK_CLIENT_SECRET, // your App Secret
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback'
    }
};