var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var News = require('../models/news');
var Car = require('../models/cars');
var Order = require('../models/order');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/news', isLoggedIn, function(req, res, next){
    res.render('admin/insnews', {csrfToken: req.csrfToken()});
})

router.post('/news', isLoggedIn, function(req, res, next){
    
    if(req.body.tytul && req.body.tresc){
        var news = new News();
        news.Tytul = req.body.tytul;
        news.Tresc = req.body.tresc;
        news.save(function(err, result){
            if(err){
                console.log(err);
                return res.send("blad?");
            }else{                
                return res.send("dodano!");
            }
        });
    }else
        return res.send("nie wypelnino pol");
})

router.get('/car', isLoggedIn, function(req, res, next){
    res.render('admin/inscars', {csrfToken: req.csrfToken()});
})

router.post('/car', isLoggedIn, function(req, res, next){
    
    if(req.body.imagePath && req.body.brand && req.body.model && req.body.short_description && req.body.long_description && req.body.typ && req.body.price){
        var car = new Car();
        car.imagePath= req.body.imagePath;
        car.brand = req.body.brand;
        car.model = req.body.model;
        car.short_description=req.body.short_description;
        car.long_description= req.body.long_description;
        car.typ=  req.body.typ;
        car.price=req.body.price;
        car.save(function(err, result){
            if(err){
                console.log(err);
                return res.send("blad?");
            }else{
                return res.send("dodano!");
            }
        });
    }else
        return res.send("nie wypelnino pol");
})

router.get('/order', isLoggedIn, function(req, res, next){
    Order.find({}, function(err, orders){
        res.json(orders);
    });
})



router.use('/', notLoggedIn, function(req, res, next){
  next();
})


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated() ) {
      if(req.user.rola == "admin")
        return next();
    res.redirect('/');
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
      return next();
  }
  res.redirect('/');
} 