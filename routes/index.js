var express = require('express');
var PayU = require('payu-pl');
var open = require("open");
var router = express.Router();

var Car = require('../models/cars');
var Cart = require('../models/cart');
var Order = require('../models/order');
var News = require('../models/news');



/* GET home page. */
router.get('/', function(req, res, next) {
  News.find(function(err, docs){
    res.render('index',{news: docs});
  //  console.log(docs);
    }); 
});

router.get('/cars', function(req, res, next) {
  Car.find(function(err, docs){
    var carChunks = [];
    var chunkSize = 3;
    for(var i =0; i< docs.length; i+= chunkSize){
      carChunks.push(docs.slice(i, i+chunkSize));
    }
   // console.log(carChunks);
    res.render('cars/cars', { title: 'Express', data_cars: carChunks });
  }); 
});

router.get('/check/:id/:startDate/:endDate', function(req, res, next){
    var carId = req.params.id;
    var from_date = new Date(req.params.startDate);
    var to_date = new Date(req.params.endDate);
    //console.log(to_date.toISOString() );

    Order.find({$or: [
      {"car": carId, "do":{"$gte":from_date.toISOString(),"$lte":to_date.toISOString()}},
      {"car": carId, "od":{"$lte":from_date.toISOString()},"do": {"$gte":to_date.toISOString()}},
      {"car": carId, "od":{"$gte":from_date.toISOString(), "$lte":to_date.toISOString()}},
      {"car": carId, "od":{"$gte":from_date.toISOString()},"do": {"$lte":to_date.toISOString()}}
    ]},function(err, car){
      if(err){
        return res.redirect('/');
      }
     // console.log(car);

      if(car.length >0){
        return res.send("samochod juz zarezerwowany");
     }else{
       return res.send("bierz jak chcesz"); 
      }
      
    });
});

router.get('/check/:startDate/:endDate', function(req, res, next){
  var from_date = new Date(req.params.startDate);
  var to_date = new Date(req.params.endDate);
  //console.log(to_date.toISOString() );
  
  Order.find({$or: [
    {"do":{"$gte":from_date.toISOString(),"$lte":to_date.toISOString()}},
    {"od":{"$lte":from_date.toISOString()},"do": {"$gte":to_date.toISOString()}},
    {"od":{"$gte":from_date.toISOString(), "$lte":to_date.toISOString()}},
    {"od":{"$gte":from_date.toISOString()},"do": {"$lte":to_date.toISOString()}}
  ]},function(err, car){
      Car.find(function(err, docs){
      var carChunks = [];
       docs.forEach(function(item) {
         var test = true;
        car.forEach(function(car2){
            if(car2.car == item.id){
              test=false;
            }
        });
        if(test)
          carChunks.push(item);
      });
      var carChunk = []
      carChunk.push(carChunks);
      //console.log(carChunk);
      res.render('cars/cars', { title: 'Express', data_cars: carChunk });
    }); 
    console.log(car);
  });
});


router.get('/car/:id', function(req, res, next){
  var carId = req.params.id;
    Car.findById(carId, function(err, car){
      if(err){
        return res.redirect('/');
      }
     // console.log(car);
      res.render('cars/car', { title: 'Express', data_car: car }); 
    });
});

router.get('/cars/:typ', function(req, res, next){
  var cartyp = req.params.typ;
  var cars = Car.find({typ: cartyp}, function(err, docs){
      var carChunks = [];
      var chunkSize = 3;
      for(var i =0; i< docs.length; i+= chunkSize){
        carChunks.push(docs.slice(i, i+chunkSize));
      }
      res.render('cars/cars', { title: 'Express', data_cars: carChunks });
    });
});




router.get('/addCart/:id', function(req, res, next){
  var carId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Car.findById(carId, function(err, car){
    if(err){
      return res.redirect('/');
    }
    cart.add(car, car.id);
    req.session.cart = cart;
    //console.log(req.session.cart);
    res.redirect('/cars');
  });
});

router.get('/cart', function(req, res, next){
  if(!req.session.cart){
    return res.render('cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout/:odDaty/:doDaty', isLoggedIn, function(req, res, next){
  var odDaty = req.params.odDaty;
  var doDaty = req.params.doDaty;
  if(!req.user.numerPrawaJazdy){
    console.log("!!!!!!!podaj dane prawka!!!!!!");
    return res.redirect('user/profile');
  }
  if(!req.session.cart){
    return res.redirect('cart');
  }
  var cart = new Cart(req.session.cart);
  res.render('checkout', {total: cart.totalPrice, odDaty: odDaty, doDaty: doDaty})
});

router.post('/checkout',isLoggedIn, function(req, res, next){
  if(!req.user.numerPrawaJazdy){
    console.log("!!!!!!!podaj dane prawka!!!!!!");
    return res.redirect('user/profile');
  }
  if(!req.session.cart){
    return res.redirect('cart');
  }
  var cart = new Cart(req.session.cart);
  var odbior;
  var zwrot;
  var arr = cart.generateArray();
  var zapytanie = [];
  var from_date = new Date(req.body.odDaty);
  var to_date = new Date(req.body.doDaty);
  arr.forEach(function(item){
    zapytanie.push({$or: [
      {"car": item.item._id, "do":{"$gte":from_date.toISOString(),"$lte":to_date.toISOString()}},
      {"car": item.item._id, "od":{"$lte":from_date.toISOString()},"do": {"$gte":to_date.toISOString()}},
      {"car": item.item._id, "od":{"$gte":from_date.toISOString(), "$lte":to_date.toISOString()}},
      {"car": item.item._id, "od":{"$gte":from_date.toISOString()},"do": {"$lte":to_date.toISOString()}}
    ]}); 
  });
  Order.find({$or: zapytanie},function(err, car){
      if(err){
        return res.redirect('/');
      }

      if(car.length >0){
        console.log("!!!!!!!Samochod zarezerwowany wczesniej? Rezerwacja nie udana!!!!!!");
       return res.send('/!!!!!!!Samochod zarezerwowany wczesniej? Rezerwacja nie udana!!!!!!')
      }else{
          if(req.body.odbior == "def"){
            odbior = req.body.inneOdbior;
            cart.totalPrice += 1000;
          }else{
            odbior = req.body.odbior;
          }

          if(req.body.zwrot == "def"){
            zwrot = req.body.inneZwrot;
            cart.totalPrice += 1000;
          }else{
            zwrot = req.body.odbior;
          }

          if(req.body.place == "payu"){
              var prod = cart.generatePayU();
              
              var OrderData = {
                customerIp: "127.0.0.1",
                description: 'Order',
                totalAmount: PayU.parsePrice(cart.totalPrice), //or put string value in lowest currency unit
                products:  prod,
                notifyUrl: "http://localhost:3000/notifyPayU"
              };
              
              PayU.API.createOrder(OrderData, function (err, response) {
                if (err){
                  req.flash('error', 'cos nie tak?');
                  return res.redirect('/checkout');
                }



                PayU.API.getOrder(response.body.orderId, function (err, responsed) {
                  open(response.body.redirectUri);
                  
                  arr.forEach(function(item){
                  var order = new Order({
                    user: req.user,
                    car: item.item._id,
                    adresStart: odbior,
                    adresZwrot: zwrot,
                    od: from_date.toISOString(),
                    do: to_date.toISOString(),
                    totalpayed: cart.totalPrice,
                    paymentId: response.body.orderId
                  })
                  order.save(function(err, result){
                    req.flash('sukces', 'zakupiono');
                  });
                });
                  req.session.cart = null;
                  res.redirect('/');
                  console.log(err, response)
                  });
              
              
              });
            }else{
            
                  
              arr.forEach(function(item){
              var order = new Order({
                user: req.user,
                car: item.item._id,
                adresStart: odbior,
                adresZwrot: zwrot,
                od: new Date(req.body.odDaty).toISOString(),
                do: new Date(req.body.doDaty).toISOString(),
                totalpayed: cart.totalPrice,
                paymentId: response.body.orderId
              })
              order.save(function(err, result){
                req.flash('sukces', 'zakupiono');
              });
                });
                req.session.cart = null;
                res.redirect('/')
            }
          }
  });
});

router.get('/remove/:id', function(req, res, next){
  var carId = req.params.id;
  var cart = new Cart(req.session.cart? req.session.cart: {})
  cart.removeItem(carId);
  req.session.cart = cart;
  res.redirect('/cart');
});


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}
