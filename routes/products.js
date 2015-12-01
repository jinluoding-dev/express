var express = require('express');
var router = express.Router();
var logger = require('../log').logger;

/* GET users listing. */
router.get('/', function(req, res, next) {
    var db = req.db;
    var collection = db.get('productcollection');
    collection.find({}, function(err, docs) {
        res.render('home/product', {
            'sitemap': '评估逻辑',
            'productlist': docs
        })
    })
});

router.get('/add', function(req, res, next) {
    res.render('home/product-edit', {
        'sitemap': '添加可回购手机',
        product: {
            'model': null,
            'seq': null
        }
    })
});

router.post('/add', function(req, res, next) {
    var db = req.db;
    var product = req.body;
    var collection = db.get('productcollection');
    collection.insert(product, function(err, docs) {
        if (err) {
            logger.error('----- create product error  -----');
            next(err);
        } else {
            logger.info('----- create a product  -----');
            res.redirect("/products");
        }
    })
});

router.get('/edit/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('productcollection');
    collection.findOne({
        _id: req.params.id
    }, function(err, docs) {
        if (err) {
            logger.error('----- find product error id = ' + req.params.id + ' -----');
            next(err);
        } else {
            res.render('home/product-edit', {
                'sitemap': '编辑可回购手机',
                'product': docs
            })
        }
    })
});

router.post('/edit/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('productcollection');
    var product = req.body;
    collection.update({
        _id: req.params.id
    }, product, function(err, docs) {
        if (err) {
            logger.error('----- update product error id = ' + req.params.id + ' -----');
            next(err);
        }
        logger.info('----- update product id = ' + req.params.id + ' -----');
        res.redirect("/products");
    })
})

router.get('/del/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('productcollection');
    collection.remove({
        _id: req.params.id
    }, function(err, docs) {
        if (err) {
            logger.error('----- delete product error  -----');
            next(err);
        } else {
            logger.info('----- delete product id = ' + req.params.id + '  -----');
            res.redirect("/products");
        }
    })
})

module.exports = router;
