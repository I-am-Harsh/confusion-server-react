const mongoose = require('mongoose');
const Schema = mongoose.Schema
require('mongoose-currency').loadType(mongoose);
const currency = mongoose.Types.Currency;


var LeadersSchema = new Schema({

    name : {
        type : String
    },

    image : {
        type : String,
        unique : true
    },

    designation : {
        type : String,
        unique : true
    },
    
    abbr : {
        type : String,
        unique : true

    },

    description : {
        type : String
    },

    featured : {
        type : Boolean
    }


  
});



var Leaders = mongoose.model('Leader',LeadersSchema);
module.exports = Leaders;