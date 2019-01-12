var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    car: {type: Schema.Types.ObjectId, ref: 'Car'},
    adresStart: {type: String, required: true},
    adresZwrot: {type: String, required: true},
    od: {type: Date, require: true},
    do: {type: Date, require: true},
    paymentId: {type: String, default: null},
    totalpayed: {type: Number}
});

module.exports = mongoose.model('Order', schema);
