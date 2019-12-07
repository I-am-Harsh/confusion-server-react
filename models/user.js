var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passport = require('passport-local-mongoose')


var User = new Schema({
    admin : {
        type : Boolean,
        default : false
    }
});

User.plugin(passport);


module.exports = mongoose.model('User', User);