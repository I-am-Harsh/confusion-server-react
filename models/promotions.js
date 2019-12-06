const mongoose = require('mongoose');
const Schema = mongoose.Schema
require('mongoose-currency').loadType(mongoose);
const currency = mongoose.Types.Currency;


var PromotionSchema = new Schema({

    name : {
        type : String,
        unique : true
    },

    image : {
        type : String,
        unique : true
    },

    label : {
        type : String,
        default : ''
    },
    
    price : {
        type : currency
    },

    description : {
        type : String
    },

    featured : {
        type : Boolean
    }


  
});


var Promotions = mongoose.model('Promotion',PromotionSchema);
module.exports = Promotions;