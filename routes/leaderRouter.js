const body = require('body-parser');
const express = require('express');
const promoRouter = express.Router();

const Leaders = require('../models/leaders');

promoRouter.use(body.json());

promoRouter.route('/')
// var leaderId = req.body.leaderId

.get((req,res) =>{
    Leaders.find({})
    .then((result) => {
        if(result != null){
            res.statusCode = 200;
            res.setHeader('Content-type','application/json');
            res.json(result);
        }
        else{
            err = new Error(`There are no Leaders available`);
            err.status = 200;
            return(next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})


.post((req,res) =>{
    Leaders.create(req.body)
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
    Leaders.deleteMany({})
    .then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.json('All deleted');
    }, (err) => next(err))
    .catch((err) => next(err))
});



promoRouter.route('/:leaderId')
.get((req,res) =>{
    var leaderId = req.params.leaderId;
    Leaders.findById({_id : leaderId})
    .then((result) =>{
        if(result != null){
            res.statusCode = 200;
            res.setHeader('Content-type','application/json');
            res.json(result);
        }
        else{
            err = new Error(`This leaderId : ${req.params.leaderId} is not available`);
            err.status = 200;
            err.next()
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})


.post((req,res) =>{
    res.write(`The ${req.method} was executed. The selected promo id is :  ${req.body.name} `);
    res.end(`The selected promo id is : ${req.params.leaderId}`)
})


.put((req,res) =>{
    
    Leaders.findByIdAndUpdate(req.params.leaderId,{
        $set : req.body
    }, 
        {new : true}
    )
    .then((result) =>{
        console.log(`Leaders created : ${req.body}`);
        res.statusCode = 200;
        res.setHeader('Content-type',"application/json");
        res.json(result);
    }, (err) => next(err))
    .catch((err) => next(err))
})

.delete((req,res) =>{
    var leaderId = req.params.leaderId;
    Leaders.deleteMany({_id : leaderId})
    .then((result) =>{
        if(result != null){
            res.statusCode = 200;
            res.setHeader('Content-type','application/json');
            res.json('Deleted');
        }
        else{
            err = new Error(`This leaderId : ${req.params.leaderId} is not available`);
            err.status = 200;
            err.next()
        }
    }, (err) => next(err))
    .catch((err) => next(err))
});



module.exports = promoRouter;