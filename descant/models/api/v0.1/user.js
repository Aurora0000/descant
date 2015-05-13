var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var account = new Schema({
    username: String,
    email: String, 
    password: String
});

account.plugin(passportLocalMongoose);

module.exports = mongoose.model('account', account);
