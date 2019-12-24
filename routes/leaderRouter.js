const body = require('body-parser');
const express = require('express');
const promoRouter = express.Router();
const auth = require('../auth');
const cors = require('./cors');
const Leaders = require('../models/leaders');

promoRouter.use(body.json());

promoRouter.route('/')
// var leaderId = req.body.leaderId
.options(cors.corsWithOptions, (req,res) => {
    res.sendStatus = 200;
})


.get(cors.cors,(req,res,next) =>{
    Leaders.find()
    .then((result) => {   
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.json(result);
}, (err) => next(err))
    .catch((err) => next(err));
})


.post(cors.corsWithOptions, auth.verifyUser,auth.verifyAdmin,(req,res) =>{
    Leaders.create(req.body)
    .then((result) =>{
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.send(result);
    },(err) => next(err))
    .catch((err) => next(err))
})


.put(cors.corsWithOptions, auth.verifyUser,(req,res) =>{
    res.end(`This is a ${req.method} request`);
})

.delete(cors.corsWithOptions, auth.verifyUser,auth.verifyAdmin,(req,res) =>{
    Leaders.deleteMany()
    .then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.json('All deleted');
    }, (err) => next(err))
    .catch((err) => next(err))
});



promoRouter.route('/:leaderId')
.options(cors.corsWithOptions, (req,res) => {
    res.sendStatus = 200;
})

.get(cors.cors,(req,res,next) =>{
    Leaders.findById(req.params.leaderId)
    .then((result) =>{
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.json(result);
    }, (err) => next(err))
    .catch((err) => next(err))
})


.post(cors.corsWithOptions, auth.verifyUser,(req,res) =>{
    res.write(`The ${req.method} was executed. The selected promo id is :  ${req.body.name} `);
    res.end(`The selected promo id is : ${req.params.leaderId}`)
})


.put(cors.corsWithOptions, auth.verifyUser,auth.verifyAdmin,(req,res) =>{
    
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

.delete(cors.corsWithOptions, auth.verifyUser,auth.verifyAdmin,(req,res,next) =>{
    var leaderId = req.params.leaderId;
    Leaders.deleteOne({_id : leaderId})
    .then((result) =>{
        res.statusCode = 200;
        res.setHeader('Content-type','application/json');
        res.json('Deleted');
        
    }, (err) => next(err))
    .catch((err) => next(err))
});



module.exports = promoRouter;