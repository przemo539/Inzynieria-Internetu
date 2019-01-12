var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
    email: {type: String, required:true},
    haslo: {type: String, required: true},
    PESEL: {type: Number, required: true},
    numerPrawaJazdy: {type: String},
    organWydajacyPrawko: {type: String},
    dataWydaniaPrawka: {type: Date},
    dataWaznosciPrawka: {type: Date},
    rola: {type: String, default: "user"}
})
//numerPrawaJazdy + organWydajacyPrawko + dataWydaniaPrawka + dataWaznosciPrawka

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null); 
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.haslo);  
};

module.exports = mongoose.model('User', userSchema);