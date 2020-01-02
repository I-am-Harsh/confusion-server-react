
const express = require('express');
const body = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
const dishRouter = express.Router();
const auth = require('../auth');
const cors = require('./cors');


dishRouter.use(body.json());

dishRouter.route('/')

.options(cors.corsWithOptions, (req,res) => {
    res.sendStatus = 200;
})
// the modified res is passed here
.get( cors.cors, (req,res,next) =>{
    Dishes.find(req.query)
    .populate('comments.author')
    .then((result) => {
        if(result.length){
            res.statusCode = 200;
            res.setHeader('Content-type',"application/json");
            res.json(result);   
        }
        else{
            res.statusCode = 200;
            res.setHeader('Content-type',"application/json");
            res.json('There are no dishes at the moment');
        }

    }, (err) => next(err))
    .catch((err) => next(err));
})


.post(cors.corsWithOptions, auth.verifyUser,auth.verifyAdmin ,(req,res,next) =>{
    Dishes.create(req.body)
    .then((dish) =>{
        console.log(`Dishes created : ${req.body}`);
        res.statusCode = 200;
        res.setHeader('Content-type',"application/json");
        res.json(dish);
    })
    .catch((err) => {
        if(err.name === 'ValidationError'){
            // res.write('There is something wrong');
            res.json(err._message);
        }
        else{
            res.json('There is something else wrong');
            // res.json(err);
        }
    });
})

.put(cors.corsWithOptions, auth.verifyUser, (req,res) =>{
    res.statusCode = 403;
    res.end(`The ${req.method} was executed.  This operation is not supported.`);
})

.delete(cors.corsWithOptions ,auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
    Dishes.deleteMany()
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});



// DishId
dishRouter.route('/:dishId')

.options(cors.corsWithOptions, (req,res) => {
    res.sendStatus = 200;
})

.get(cors.cors,(req,res,next) =>{
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) =>{
        console.log(`Dish : ${req.body}`);
        res.statusCode = 200;
        res.setHeader('Content-type',"application/json");
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err))
})

.post(auth.verifyUser,auth.verifyAdmin,(req,res) =>{
    res.statusCode = 403;
    res.end(`The ${req.method} was executed.  This operation is not supported. Dish id is ${req.params.dishId}`);
})

.put(cors.corsWithOptions,auth.verifyUser, auth.verifyAdmin, (req,res,next) =>{
    Dishes.findByIdAndUpdate(req.params.dishId,{
        $set : req.body
    }, 
        {new : true}
    )
    .then((dish) =>{
        console.log(`Dishes created : ${req.body}`);
        res.statusCode = 200;
        res.setHeader('Content-type',"application/json");
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err))
})

.delete(cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin, (req,res) =>{
    
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((dish) =>{
        console.log(`Dishes removed : ${req.body}`);
        res.statusCode = 200;
        res.setHeader('Content-type',"application/json");
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err))
});

module.exports = dishRouter;
