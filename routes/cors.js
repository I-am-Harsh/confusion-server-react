const express = require('express');
const app = express();
const cors = require('cors');


var whitelist = ['localhost:3000'];


var corsOptionDelegate = (req, callback) => {
    var corsOption = { origin : false };

    if(whitelist.indexOf(req.header('Origin')) !== -1){
        corsOption.origin = true;
    }

    callback(null, corsOption);
};





exports.cors = cors();
exports.corsWithOptions = cors(corsOptionDelegate);


