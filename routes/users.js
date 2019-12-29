var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../auth');
var cors = require('./cors');
/* GET users listing. */
var User = require('../models/user');

router.use(bodyParser.json());

router.options('*', cors.corsWithOptions, (req,res) => res.sendStatus(200));

router.get('/', cors.cors,authenticate.verifyUser,authenticate.verifyAdmin ,function(req, res, next) {
  User.find()
  .then((result) => {
    res.statusCode = 200;
    res.setHeader('Content-type','application/json');
    if(result.length){
      res.send(result);
      return;
  }
    res.json("There are no users at the moment");
  })
});

router.post('/signup', cors.corsWithOptions,  (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      
      if(req.body.firstname){
        user.firstname = req.body.firstname;
      }
      if(req.body.lastname){
        user.lastname = req.body.lastname;
      }
      user.save((err, user) => {
        if(err){
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return;
        }
        else{
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Registration Successful!'});
          });
        }
      })
    }
  });
});

router.post('/login', cors.corsWithOptions, (req, res,next) => {

  passport.authenticate('local', (err, authResult, info) => {
    // err
    if(err) return next(err);
    // if(info) return res.send(info);
    // wrong pwd and else
    if(!authResult){
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: 'Login failed', err : info});
    }
    req.logIn(authResult, (err) => {
      
      if(err){
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'Login failed', err : 'Could not login user, please try again.'});
      }
      else{
        var token = authenticate.getToken({_id : req.user._id});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, token : token, status: 'You are successfully logged in!'});
      }
    });
  }) (req,res,next);
});



router.get('/logout', cors.cors,(req, res,next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

router.get('/facebook/token', passport.authenticate('facebook-token'), (req,res) => {
  if(req.user){
    var token = authenticate.getToken({_id : req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token : token, status: 'You are successfully logged in!'});
  }
});


// when the token expires
router.get('/checkJWTToken', cors.corsWithOptions, (req,res,next) => {
  passport.authenticate('jwt', {session : false}, (err, user,info) => {
    if(err) return next(err);
    if(!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status : 'jwt invalid', success : false, err : info});
    }
    else{ 
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status : 'jwt valid', success : false, user : user});
    }
  }) (req,res,next);
});
module.exports = router;



