const body = require('body-parser');
const express = require('express');
const promoRouter = express.Router();
const auth = require('../auth');

const Promotions = require('../models/promotions');

promoRouter.use(body.json());

promoRouter.route('/')
// var promoId = req.body.promoId

.get((req,res,next) =>{
    Promotions.find({})
    .then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.json(result);
    }, (err) => next(err))
    .catch((err) => next(err));
})


.post(auth.verifyUser,(req,res,next) =>{
    Promotions.create(req.body)
    .then((result) =>{
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.send(result);
    },(err) => next(err))
    .catch((err) => next(err))
})


.put(auth.verifyUser,(req,res) =>{
    res.end(`This is a ${req.method} request`);
})

.delete(auth.verifyUser,(req,res,next) =>{
    Promotions.deleteMany({})
    .then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.json('All deleted');
    }, (err) => next(err))
    .catch((err) => next(err))
});



promoRouter.route('/:promoId')
.get(auth.verifyUser,(req,res,next) =>{
    var promoId = req.params.promoId;
    Promotions.findById({_id : promoId})
    .then((result) =>{
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.json(result);
        
    }, (err) => next(err))
    .catch((err) => next(err))
})


.post(auth.verifyUser,(req,res) =>{
    res.write(`The ${req.method} was executed. The selected promo id is :  ${req.body.name} `);
    res.end(`The selected promo id is : ${req.params.promoId}`)
})


.put(auth.verifyUser,(req,res,next) =>{
    
    Promotions.findByIdAndUpdate(req.params.promoId,{
        $set : req.body
    }, 
        {new : true}
    )
    .then((result) =>{
        console.log(`Promotions created : ${req.body}`);
        res.statusCode = 200;
        res.setHeader('Content-type',"application/json");
        res.json(result);
    }, (err) => next(err))
    .catch((err) => next(err))
})

.delete(auth.verifyUser,(req,res,next) =>{
    var promoId = req.params.promoId;
    Promotions.deleteMany({_id : promoId})
    .then((result) =>{
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.json('Deleted');
    }, (err) => next(err))
    .catch((err) => next(err))
});



module.exports = promoRouter;