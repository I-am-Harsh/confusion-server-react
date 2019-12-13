const body = require('body-parser');
const express = require('express');
const promoRouter = express.Router();
const auth = require('../auth');

const Leaders = require('../models/leaders');

promoRouter.use(body.json());

promoRouter.route('/')
// var leaderId = req.body.leaderId

.get((req,res,next) =>{
    Leaders.find({})
    .then((result) => {   
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.json(result);
}, (err) => next(err))
    .catch((err) => next(err));
})


.post(auth.verifyUser,(req,res) =>{
    Leaders.create(req.body)
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

.delete(auth.verifyUser,(req,res) =>{
    Leaders.deleteMany({})
    .then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.json('All deleted');
    }, (err) => next(err))
    .catch((err) => next(err))
});



promoRouter.route('/:leaderId')
.get((req,res,next) =>{
    Leaders.findById(req.params.leaderId)
    .then((result) =>{
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.json(result);
    }, (err) => next(err))
    .catch((err) => next(err))
})


.post(auth.verifyUser,(req,res) =>{
    res.write(`The ${req.method} was executed. The selected promo id is :  ${req.body.name} `);
    res.end(`The selected promo id is : ${req.params.leaderId}`)
})


.put(auth.verifyUser,(req,res) =>{
    
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

.delete(auth.verifyUser,(req,res,next) =>{
    var leaderId = req.params.leaderId;
    Leaders.deleteMany({_id : leaderId})
    .then((result) =>{
    
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.json('Deleted');
        
    }, (err) => next(err))
    .catch((err) => next(err))
});



module.exports = promoRouter;