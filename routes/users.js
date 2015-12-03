var express = require('express');
var router = express.Router();
var moment = require('moment');
var logger = require('../log').logger;

/* GET users listing. */
router.get('/', function(req, res, next) {
  var db = req.db;
    var collection = db.get('usercollection');
    collection.find({}, {
        sort: {
            attention_date: 1
        }
    }, function(err, docs) {
        res.render('home/user', {
            'sitemap': '<a class="current" href="#">用户列表</a>',
            'userList': docs,
            'moment': moment
        })
    })
});

router.get('/:userId/coupon', function(req, res) {
    var db = req.db;
    var usercollection = db.get('usercollection');
    var couponcollection = db.get('user_couponcollection');
    usercollection.findOne({
        _id: req.params.userId
    }, function(err, docs) {
        couponcollection.find({
            user_id: req.params.userId
        }, {
            sort: {
                seq: 1
            }
        }, function(err1, docs1) {
            res.render('home/user-coupon', {
                'sitemap': '<a href="/users">用户列表</a><a class="current" href="#">优惠券</a>',
                'user': docs,
                'couponList': docs1
            })
        })
    })
})

router.get('/:userId/evaluate-report', function(req, res) {
    var db = req.db;
    var usercollection = db.get('usercollection');
    var reportcollection = db.get('user_evaluate_reportcollection');
    usercollection.findOne({
        _id: req.params.userId
    }, function(err, docs) {
        reportcollection.find({
            user_id: req.params.userId
        }, {
            sort: {
                seq: 1
            }
        }, function(err1, docs1) {
            res.render('home/user-evaluate-report', {
                'sitemap': '<a href="/users">用户列表</a><a class="current" href="#">评估报告</a>',
                'user': docs,
                'reportList': docs1
            })
        })
    })
})

module.exports = router;
