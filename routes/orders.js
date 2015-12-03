var express = require('express');
var router = express.Router();
var moment = require('moment');

router.get('/', function(req, res, next) {
  var db = req.db;
    var collection = db.get('ordercollection');
    collection.find({}, {
        sort: {
            order_date: 1
        }
    }, function(err, docs) {
        res.render('home/order', {
            'sitemap': '<a class="current" href="#">订单列表</a>',
            'orderList': docs,
            'moment': moment
        })
    })
});

module.exports = router;
