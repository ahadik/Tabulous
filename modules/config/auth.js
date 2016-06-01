// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : process.env.FACEBOOK_CLIENT_ID, // your App ID
        'clientSecret'  : process.env.FACEBOOK_CLIENT_SECRET, // your App Secret
        'callbackURL'   : process.env.TABULOUS_FACEBOOK_CALLBACK,
        'enableProof' : true
    }
};