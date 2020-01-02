const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);

const currency = mongoose.Types.Currency;

const Schema = mongoose.Schema;

var commentSchema = new Schema({
    rating:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment:  {
        type: String,
        required: true
    },
    author:  {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    dish : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Dish'
    }
}, {
    timestamps: true
});
