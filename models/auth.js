var passport = require('passport');
var LocalStrat = require('passport-local').Strategy;
var user = require('../models/user');


exports.local = passport.use(new LocalStrat(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());