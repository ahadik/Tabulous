// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var projectSchema = mongoose.Schema({

    id: String,
    wireframe: String,
    owner: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Project', projectSchema);