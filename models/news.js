var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    Tytul: {type:String, required: true},
    Tresc:  {type:String, required: true}
});

module.exports = mongoose.model('News', schema);
