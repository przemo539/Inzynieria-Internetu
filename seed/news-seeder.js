var News = require('../models/news');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/wypozyczalnia');

var news = [
    new News({
        Tytul: "wielkie znizki na swieta !",
        Tresc: "Wielkie znizki z okazji swiat do 50%!! zamow juz dzis"
    }),    
    new News({
        Tytul: "2 nowe auta !",
        Tresc: "od 16-12-18 dostepne sa 2 nowe samochody !"
    })

];

var done = 0;
for(var i=0;i < news.length; i++){
    news[i].save(function(err, result){
        done++
        if(done === news.length){
            exit();
        }
    });
}

function exit(){
    mongoose.disconnect();
}