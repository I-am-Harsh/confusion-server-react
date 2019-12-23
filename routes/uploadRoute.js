const express = require('express');
const body = require('body-parser');
const Dishes = require('../models/dishes');
const uploadRouter = express.Router();
const auth = require('../auth');
const multer = require('multer');


var storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'public/images');
    },

    filename : (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const imageFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('You can not upload this file type'), false);
    }
    cb(null, true);
}

const upload = multer({ storage : storage, fileFilter : imageFilter});

uploadRouter.use(body.json());

uploadRouter.route('/')


.get(auth.verifyUser,auth.verifyAdmin,(req,res) =>{
    res.statusCode = 403;
    res.end(`The ${req.method} was executed.  This operation is not supported.`);
})

// imagFile is the name of the upload form field name
.post(auth.verifyUser,auth.verifyAdmin, upload.single('imageFile'), (req,res) =>{
    console.log(req.file);
    // console.log(req);
    res.statusCode = 200;
    res.setHeader('Content-type','application/json');
    res.json(req.file);
    
})

.put(auth.verifyUser,auth.verifyAdmin,(req,res) =>{
    res.statusCode = 403;
    res.end(`The ${req.method} was executed.  This operation is not supported.`);
})
.delete(auth.verifyUser,auth.verifyAdmin,(req,res) =>{
    res.statusCode = 403;
    res.end(`The ${req.method} was executed.  This operation is not supported.`);
})







module.exports = uploadRouter;