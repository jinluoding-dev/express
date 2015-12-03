var express = require('express');
var multer = require('multer');
var router = express.Router();
var logger = require('../log').logger;
var _uploadDir = '/uploads/';
var upload = multer({
    dest: 'public' + _uploadDir,
    limits: {
        fileSize: 2 * 1024 * 1024
    }
});

router.get('/', function(req, res, next) {
    var db = req.db;
    var collection = db.get('productcollection');
    collection.find({}, {
        sort: {
            seq: 1
        }
    }, function(err, docs) {
        res.render('home/product', {
            'sitemap': '<a class="current" href="#">商品列表</a>',
            'productList': docs
        })
    })
});

router.get('/add', function(req, res, next) {
    res.render('home/product-edit', {
        'sitemap': '<a href="/products">商品列表</a><a class="current" href="#">添加商品</a>',
        product: {
            'model': null,
            'pic': null,
            'seq': null
        }
    })
});

router.post('/add', upload.single('file'), function(req, res, next) {
    var db = req.db;
    var product = req.body;
    product.seq = parseInt(req.body.seq);
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

router.get('/:id/edit', function(req, res, next) {
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
                'sitemap': '<a href="/products">商品列表</a><a class="current" href="#">编辑商品</a>',
                'product': docs
            })
        }
    })
});

router.post('/:id/edit', upload.single('file'), function(req, res, next) {
        var db = req.db;
        var collection = db.get('productcollection');
        var product = req.body;
        product.seq = parseInt(req.body.seq);
        if (req.file) {
            product.pic = _uploadDir + req.file.filename;
        }
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

router.get('/:id/del', function(req, res) {
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

/* ------------------  */

router.get('/:productId/option', function(req, res) {
    var db = req.db;
    var productcollection = db.get('productcollection');
    var optioncollection = db.get('product_optioncollection');
    productcollection.findOne({
        _id: req.params.productId
    }, function(err, docs) {
        optioncollection.find({
            product_id: req.params.productId
        }, {
            sort: {
                seq: 1
            }
        }, function(err1, docs1) {
            res.render('home/product-option', {
                'sitemap': '<a href="/products">商品列表</a><a class="current" href="#">商品属性</a>',
                'product': docs,
                'optionList': docs1
            })
        })
    })
})


router.get('/:productId/option/add', function(req, res, next) {
    res.render('home/product-option-edit', {
        'sitemap': '<a href="/products">商品列表</a><a href="/products/' + req.params.productId + '/option">商品属性</a><a class="current" href="#">添加属性</a>',
        option: {
            'product_id': req.params.productId,
            'color': null,
            'operator': null,
            'rom': null,
            'price': null
        }
    })
});

router.post('/:productId/option/add', function(req, res, next) {
    var db = req.db;
    var option = req.body;
    option.seq = parseInt(req.body.seq);
    var collection = db.get('product_optioncollection');
    collection.insert(option, function(err, docs) {
        if (err) {
            logger.error('----- create product option error  -----');
            next(err);
        } else {
            logger.info('----- create a product option  -----');
            res.redirect("/products/" + req.params.productId + "/option");
        }
    })
});

router.get('/:productId/option/:id/edit', function(req, res, next) {
    var db = req.db;
    var collection = db.get('product_optioncollection');
    collection.findOne({
        _id: req.params.id
    }, function(err, docs) {
        if (err) {
            logger.error('----- find product option error id = ' + req.params.id + ' -----');
            next(err);
        } else {
            res.render('home/product-option-edit', {
                'sitemap': '<a href="/products">商品列表</a><a href="/products/' + req.params.productId + '/option">商品属性</a><a class="current" href="#">编辑属性</a>',
                'option': docs
            })
        }
    })
});

router.post('/:productId/option/:id/edit', function(req, res, next) {
    var db = req.db;
    var collection = db.get('product_optioncollection');
    var option = req.body;
    option.seq = parseInt(req.body.seq);
    collection.update({
        _id: req.params.id
    }, option, function(err, docs) {
        if (err) {
            logger.error('----- update product option error id = ' + req.params.id + ' -----');
            next(err);
        }
        logger.info('----- update product option id = ' + req.params.id + ' -----');
        res.redirect("/products/" + req.params.productId + "/option");
    })
})

router.get('/:productId/option/:id/del', function(req, res) {
    var db = req.db;
    var collection = db.get('product_optioncollection');
    collection.remove({
        _id: req.params.id
    }, function(err, docs) {
        if (err) {
            logger.error('----- delete product option error  -----');
            next(err);
        } else {
            logger.info('----- delete product option id = ' + req.params.id + '  -----');
            res.redirect("/products/" + req.params.productId + "/option");
        }
    })
})

module.exports = router;
