const mongoose = require('mongoose');
const Schema = mongoose.Schema

// var favDishSchema = new Schema({
//     // dishId : {
        
//         type : mongoose.Schema.Types.ObjectId,
//         ref : 'Dish',
//         required : true
//     // }
// })

var favSchema = new Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    dishes : [{type : mongoose.Schema.Types.ObjectId,
    ref : 'Dish'}] 
});


var fav = mongoose.model('fav',favSchema);
module.exports = fav;