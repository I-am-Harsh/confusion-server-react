var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt= require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var config = require('./config');

exports.local =  passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn : 360000000});
};


var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;



exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        // console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));


exports.verifyUser = passport.authenticate('jwt', {session : false});


exports.verifyAdmin = (req,res,next) => {
    if(req.user.admin){
        next();
    }
    else{
        var err = new Error('You are not an admin');
        err.status = 403;
        next(err);
    }
}

exports.verifyComment = (req, dish,next) => {
    
    var author = dish.comments.id(req.params.commentId).author
    // console.log("req.user._id :", req.user._id)
    // console.log("author :", author)
    // console.log(author == req.user._id)
    

    if(req.user._id.equals(author)){
        // console.log("User ID : " + typeof req.user._id);
        // console.log('author id: ' + typeof author);
        return true;
    }
    var err = new Error('Only the owner of the comment can perform this operation');
    err.status = 403;
    next(err);
}