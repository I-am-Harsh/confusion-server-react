
const express = require('express');
const body = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
const dishRouter = express.Router();


dishRouter.use(body.json());

dishRouter.route('/')
// all will execute for all by defualt 
// first this will be executed and then res and req will be passed


// .all((req,res,next) =>{
//     res.statusCode = 200;
//     res.setHeader('Content-type','text/plain');
//     // looks for additional function that match the requests
//     next();
// })



// the modified res is passed here
.get((req,res,next) =>{
    // res.end('Will send all the dishes to you, this is just a preview');
    Dishes.find({})
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-type',"application/json");
        res.json(dishes);
    }, (err) => next(err))
        .catch((err) => next(err));
})


.post((req,res,next) =>{
    Dishes.create(req.body)
    .then((dish) =>{
        console.log(`Dishes created : ${req.body}`);
        res.statusCode = 200;
        res.setHeader('Content-type',"application/json");
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err))
    
})

.put((req,res) =>{
    res.statusCode = 403;
    res.end(`The ${req.method} was executed.  This operation is not supported.`);
})

.delete((req, res, next) => {
    Dishes.deleteOne({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});



// DishId
dishRouter.route('/:dishId')

.get((req,res,next) =>{
    
    Dishes.findById(req.params.dishId)
    .then((dish) =>{
        console.log(`Dishes created : ${req.body}`);
        res.statusCode = 200;
        res.setHeader('Content-type',"application/json");
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err))
})

.post((req,res) =>{
    res.statusCode = 403;
    res.end(`The ${req.method} was executed.  This operation is not supported. Dish id is ${req.params.dishId}`);
})

.put((req,res,next) =>{
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

.delete((req,res) =>{
    
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((dish) =>{
        console.log(`Dishes removed : ${req.body}`);
        res.statusCode = 200;
        res.setHeader('Content-type',"application/json");
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err))
});







dishRouter.route('/:dishId/comments')

.get((req,res,next) =>{    
    Dishes.findById(req.params.dishId)
    .then((dish) =>{
        if(dish != null){
            console.log(`Dishes created : ${req.body}`);
            res.statusCode = 200;
            res.setHeader('Content-type',"application/json");
            res.json(dish.comments);
        }
        else{
            err = new Error('Dish' + req.params.dishId + 'was not found')
            err.statusCode = 404;
            return next(err)
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})

.post((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) {
            dish.comments.push(req.body);
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put((req,res,next) =>{
    res.statusCode = 403;
    res.end(`The ${req.method} was executed.  This operation is not supported. Dish id is ${req.params.dishId}`);
})

.delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) {
            for (var i = (dish.comments.length -1); i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});


dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId
        + '/comments/' + req.params.commentId);
})
.put((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;                
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = dishRouter;