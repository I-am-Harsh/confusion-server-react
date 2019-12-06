const body = require('body-parser');
const express = require('express');
const promoRouter = express.Router();

const Promotions = require('../models/promotions');

promoRouter.use(body.json());

promoRouter.route('/')
// var promoId = req.body.promoId

.get((req,res) =>{
    Promotions.find({})
    .then((result) => {
        if(result != null){
            res.statusCode = 200;
            res.setHeader('Content-type','application/json');
            res.json(result);
        }
        else{
            err = new Error(`There are no promotions available`);
            err.status = 200;
            return(next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})


.post((req,res) =>{
    Promotions.create(req.body)
    .then((result) =>{
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.send(result);
    },(err) => next(err))
    .catch((err) => next(err))
})


.put((req,res) =>{
    res.end(`This is a ${req.method} request`);
})

.delete((req,res) =>{
    Promotions.deleteMany({})
    .then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.json('All deleted');
    }, (err) => next(err))
    .catch((err) => next(err))
});



promoRouter.route('/:promoId')
.get((req,res) =>{
    var promoId = req.params.promoId;
    Promotions.findById({_id : promoId})
    .then((result) =>{
        if(result != null){
            res.statusCode = 200;
            res.setHeader('Content-type','application/json');
            res.json(result);
        }
        else{
            err = new Error(`This PromoId : ${req.params.promoId} is not available`);
            err.status = 200;
            err.next()
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})


.post((req,res) =>{
    res.write(`The ${req.method} was executed. The selected promo id is :  ${req.body.name} `);
    res.end(`The selected promo id is : ${req.params.promoId}`)
})


.put((req,res) =>{
    
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

.delete((req,res) =>{
    var promoId = req.params.promoId;
    Promotions.deleteMany({_id : promoId})
    .then((result) =>{
        if(result != null){
            res.statusCode = 200;
            res.setHeader('Content-type','application/json');
            res.json('Deleted');
        }
        else{
            err = new Error(`This PromoId : ${req.params.promoId} is not available`);
            err.status = 200;
            err.next()
        }
    }, (err) => next(err))
    .catch((err) => next(err))
});



module.exports = promoRouter;