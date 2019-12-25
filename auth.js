var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt= require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var config = require('./config');
var FacebookTokenStrategy = require('passport-facebook-token');

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

    if(req.user._id.equals(author)){
        return true;
    }
    var err = new Error('Only the owner of the comment can perform this operation');
    err.status = 403;
    next(err);
}


exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID : config.facebook.clientId,
    clientSecret : config.facebook.clientSecret
    },
    cb = (accessToken, refreshToken, profile, done) => {
        // console.log(profile);
        User.findOne({facebookId : profile.id}, (err, user) =>{
            // if any error
            if(err){
                return done(err,false);
            }
            // if user is found
            if(!err && user !== null){
                return done(null, user);
            }
            // if no user is found, then we create one
            else{
                console.log(profile);
                user = new User({username : profile.displayName});
                user.facebookId = profile.id;
                user.firstname = profile.name.givenName;
                user.lastname = profile.name.familyName;
                user.save((err, user) => {
                    if(err){
                        return done(err, false);
                    }
                    else{
                        return done(null, user);
                    }
                })
            }
        });
    }
));