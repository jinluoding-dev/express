var express = require('express');
var router = express.Router();
var moment = require('moment');
var logger = require('../log').logger;

/* GET users listing. */
router.get('/', function(req, res, next) {
    var db = req.db;
    var collection = db.get('settingscollection');
    collection.find({}, {}, function(err, docs) {
        if (docs.length === 0) {
            collection.insert({}, function(err, docs) {
                if (err) {
                    logger.error('----- create settings error  -----');
                    next(err);
                } else {
                    logger.info('----- create a settings  -----');
                }
            })
        }
        res.render('home/settings', {
            'sitemap': '<a class="current" href="#">设置</a>',
            'settings': docs[0]
        })
    })
});

router.post('/', function(req, res, next) {
    var db = req.db;
    var collection = db.get('settingscollection');
    var settings = req.body;
    settings.insurance_price = parseFloat(req.body.insurance_price);
    settings.coupon = parseFloat(req.body.coupon);
    collection.update({}, settings, function(err, docs) {
        if (err) {
            logger.error('----- update evaluate settings error -----');
            next(err);
        }
        logger.info('----- update evaluate settings -----');
        res.redirect("/settings");
    })
});

module.exports = router;
