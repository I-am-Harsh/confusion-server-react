const body = require('body-parser');
const express = require('express');
const auth = require('../auth');
const cors = require('./cors');

// const dishes = require('../')
const Fav = require('../models/fav');
const favRouter = express.Router();

favRouter.use(body.json());

favRouter.route('/')
.options(cors.corsWithOptions, (req,res) => {
    res.sendStatus = 200;
})


.get(cors.cors, auth.verifyUser, (req,res,next) => {
    Fav.findOne({ userId : req.user._id})
    .populate('userId')
    .populate('dishes')
    .then((result) => {
        if(result){    
            res.statusCode = 200;
            res.setHeader('Content-type',"application/json");
            res.json(result);
        }
        else{
            res.statusCode = 200;
            res.setHeader('Content-type',"application/json");
            res.json('No favs available');   
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions, auth.verifyUser, (req,res) => {
    userId = {}
    userId.userId = req.user.id
    userId.favDish = req.body.dishId
    Fav.findOne({userId : userId.userId}, (err, result) => {
        if(err) return console.log(err);
        var alreadyExist = false;
        console.log("User fav found : ",result);
        if(result){
            // check if the dish exists in the db 
            // the dish supplied is an array so check that as well
            console.log("exists : ", result.dishes.length)
            for (let index = 0; index < result.dishes.length; index++) {
                var secondIndex = 0;
                const element = result.dishes[index];
                console.log("Element :" + element);
                if(element == userId.favDish[secondIndex]){
                    alreadyExist = true;
                    console.log('found');
                    break
                }
                secondIndex++;
                if(secondIndex == req.body.dishId.length){
                    break;
                }
            }
            // if it doenst exist
            if(!alreadyExist){
                console.log("Passing this for push : ",req.body);
                // console.log(typeof req.body.dishId)
                for (const i in req.body.dishId){
                result.dishes.push(req.body.dishId[i]);}
                result.save((err, result) => {
                    if(err){  
                        console.log("first : --->" + err);
                        return res.json(err);
                    }
                    Fav.findOne({userId : userId.userId})
                    .populate('userId')
                    .populate('dishes')
                    .then((result) => {
                        res.json(result);
                    })
                    .catch((err) => res.json(err));
                });
            }
            // if it does
            else {
                console.log(req.body);
                res.json('The dish is already in favourites')
            }
        }
        // if the user document itself doesnt exist
        else{
            console.log('DNE')
            // create the doc using the id
            Fav.create(userId, (err, result) => {
                if(err){
                    return res.json(err);
                }
                console.log(result);
                // remove dishId here
                // created the doc and now push in array 
                result.dishes.push(req.body.dishId);
                result.save((err, result) => {
                    if(err){  
                        return res.json(err);
                    }
                    console.log(result);
                    Fav.findOne({userId : userId.userId})
                    .populate('userId')
                    .populate('dishes')
                    .then((result) => {
                        res.json(result);
                    })
                    .catch((err) => res.json(err));
                });
            })
        }
    })

})

.put(cors.corsWithOptions, auth.verifyUser, (req,res) => {
    res.statusCode = 403;
    res.end(`The ${req.method} was executed.  This operation is not supported.`);
})

.delete(cors.corsWithOptions, auth.verifyUser, (req,res) => {
    Fav.deleteOne({userId : req.user.id})
    .then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.json('All favs are deleted now');
    })
    .catch((err) => res.send(err));
})


favRouter.route('/:dishId')

.options(cors.corsWithOptions, (req,res) => {
    res.sendStatus = 200;
})

.get(cors.cors, auth.verifyUser, (req,res,next) => {
    Fav.findOne({userId : req.user._id})
    .then((result) => {
        if(!result){
            res.statusCode = 200;
            res.setHeader('Content-type','application/json');
            res.json({exists : "false"})
        }
        else{
            result.populate('dishes', (err, result) => {
                if(err) return res.json(err);
                res.json({exists : "true", Dish : result});
            })
        }
    },(err) => next(err))
})

.post(cors.corsWithOptions, auth.verifyUser, (req,res,next) => {
    userId = {}
    userId.userId = req.user.id
    userId.favDish = req.params.dishId
    Fav.findOne({userId : userId.userId}, (err, result) => {
        if(err) return console.log(err);
        var alreadyExist = false;
        console.log(result);
        if(result){
            // console.log(result);
            console.log("exists : ", result.dishes.length)
            for (let index = 0; index < result.dishes.length; index++) {
                const element = result.dishes[index];
                console.log("Element :" + element);
                if(element == userId.favDish){
                    alreadyExist = true;
                    console.log('found');
                    break
                }
                console.log('not found');
            }
            if(!alreadyExist){
                // console.log(req.body);
                result.dishes.push(req.params.dishId);
                result.save((err, result) => {
                    if(err){  
                        console.log("first : --->" + err);
                        return res.json(err);
                    }
                    Fav.findOne({userId : userId.userId})
                    .populate('userId')
                    .populate('dishes')
                    .then((result) => {
                        res.json(result);
                    })
                    .catch((err) => res.json(err));
                });
            }
            else {
                console.log(req.body);
                res.json('The dish is already in favourites')
            }
        }
        else{
            console.log('DNE')
            Fav.create(userId, (err, result) => {
                if(err){  
                    console.log("Second : --->"+err);
                    return res.json(err);
                }
                console.log(result);
                // remove dishId here
                result.dishes.push(req.params.dishId);
                result.save((err, result) => {
                    if(err){  
                        console.log("first : --->" + err);
                        return res.json(err);
                    }
                    console.log(result);
                    Fav.findOne({userId : userId.userId})
                    .populate('userId')
                    .populate('dishes')
                    .then((result) => {
                        res.json(result);
                    })
                    .catch((err) => res.json(err));
                });
            })
        }
    })
})

.put(cors.corsWithOptions, auth.verifyUser, (req,res) => {
    res.statusCode = 403;
    res.end(`The ${req.method} was executed.  This operation is not supported.`);
    
})

.delete(cors.corsWithOptions, auth.verifyUser, (req,res,next) => {
    Fav.findOne({userId : req.user._id}, (err, result) => {
        if(err) return res.json(err);
        var exists = false;
        if(result){
            for (let index = 0; index < result.dishes.length; index++) {
                const element = result.dishes[index];
                if(element == req.params.dishId){
                    exists = true;
                    break
                }
            }
            if(exists){
                result.dishes.pull({_id : req.params.dishId});
                result.save((err, result) => {
                    if(err) return res.send(err);
                    if(result.dishes.length == 0){
                        Fav.deleteOne({userId : req.user._id}, (err, result) => {
                            if(err) return res.status(500).send(err);
                            res.statusCode = 200;
                            res.setHeader('Content-type','plain/text');
                            res.json('You have no favourites left');
                        })
                    }
                    else{
                        res.statusCode = 200;
                        res.setHeader('Content-type','application/json');
                        Fav.findOne({userId : userId.userId})
                        .populate('userId')
                        .populate('dishes')
                        .then((result) => {
                            res.json(result);
                        })
                        .catch((err) => res.json(err));
                    }
                })
            }
            else{
                res.statusCode = 404;
                res.setHeader('Content-type','application/json');
                res.json({status : "The dish is not in favs"});
            }
        }
        else{
            res.statusCode = 404;
            res.setHeader('Content-type','application/json');
            res.json({status : "You have no favs registered"});
        }
    })
});

module.exports = favRouter;

