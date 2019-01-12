var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Order = require('../models/order');
var Cart = require('../models/cart');

var csrfProtection = csrf();
router.use(csrfProtection);
var formatDigit = function (val) {
  var str = val.toString();
  return (str.length < 2) ? "0" + str : str
};
var formatDate = function (date) {
  var myDate = new Date(date);

  var y = myDate.getFullYear(),
      m = myDate.getMonth() + 1, // january is month 0 in javascript
      d = myDate.getDate();

  // Get the DD-MM-YYYY format
  return formatDigit(d) + "-" + formatDigit(m) + "-" + y;
}


router.get('/profile', isLoggedIn, function(req, res, next){
  Order.find({user: req.user}, function(err, orders){
    if(err){
      return res.write('error');
    }
    var cart;
    var orders2 = [];
    orders.forEach(function(order){
      orders2.push({carid: order.car, odData: formatDate(order.od), doData: formatDate(order.do), payed: order.totalpayed});
    });
    console.log(orders2);
    res.render('user/profile', {orders: orders2});
  });
  
})

router.get('/logout', isLoggedIn, function(req, res, next){
  req.logout();
  res.redirect('/');
})


router.use('/', notLoggedIn, function(req, res, next){
  next();
})

router.get('/signup', function(req, res, next){
  var message =  req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages:message, hasErrors: message.length > 0})
})

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));
router.get('/signin', function(req, res, next){
  var message =  req.flash('error');
  res.render('user/signin', {csrfToken: req.csrfToken(), messages:message, hasErrors: message.length > 0})
});

router.post('/signin', passport.authenticate('local.signin',{
  failureRedirect: '/user/signin',
  failureFlash: true
}), function(req, res, next){
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  }else{
    res.redirect('/user/profile');
  }
});


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/');
}
function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
      return next();
  }
  res.redirect('/');
} 