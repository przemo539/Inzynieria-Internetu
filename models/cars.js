var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    imagePath: {type:String, required: true},
    brand:  {type:String, required: true},
    model:  {type:String, required: true},
    short_description: {type:String, required: true},
    long_description: {type:String, required: true},
    typ: {type: String, required: true},
    price:  {type:Number, required: true}
});

module.exports = mongoose.model('Car', schema);
