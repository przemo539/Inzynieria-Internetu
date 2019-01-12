var Car = require('../models/cars');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/wypozyczalnia');

var cars = [
    new Car({
        imagePath: 'https://hips.hearstapps.com/amv-prod-cad-assets.s3.amazonaws.com/media/assets/submodel/8719.jpg',
        brand:  'Ferrari',
        model:  'Enzo',
        short_description: 'krotki opis',
        long_description: 'dlugi',
        price:  100
    }),    
    new Car({
        imagePath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-gHhxjv1jSdYupr3raEFoT_RF-pYZmMea5OP8DdYxM-BzKVP6',
        brand:  'BMW',
        model:  'M5',
        short_description: 'krotki opis',
        long_description: 'dlugi',
        price:  80
    })

];

var done = 0;
for(var i=0;i < cars.length; i++){
    cars[i].save(function(err, result){
        done++
        if(done === cars.length){
            exit();
        }
    });
}

function exit(){
    mongoose.disconnect();
}