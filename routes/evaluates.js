var express = require('express');
var multer = require('multer');
var router = express.Router();
var logger = require('../log').logger;
var _uploadDir = 'uploads/';
var upload = multer({
    dest: 'public/uploads',
    limits: {
        fileSize: 2 * 1024 * 1024
    }
});

router.get('/', function(req, res, next) {
    var db = req.db;
    var collection = db.get('evaluatecollection');
    collection.find({}, {
        sort: {
            seq: 1
        }
    }, function(err, docs) {
        res.render('home/evaluate', {
            'sitemap': '<a class="current" href="#">评估逻辑</a>',
            'evaluatelist': docs
        })
    })
});

router.get('/add', function(req, res, next) {
    res.render('home/evaluate-edit', {
        'sitemap': '<a href="/evaluates">评估逻辑</a><a class="current" href="#">添加可回购手机</a>',
        evaluate: {
            'model': null,
            'pic': null,
            'seq': null
        }
    })
});

router.post('/add', function(req, res, next) {
    var db = req.db;
    var evaluate = req.body;
    evaluate.seq = parseInt(req.body.seq);
    var collection = db.get('evaluatecollection');
    collection.insert(evaluate, function(err, docs) {
        if (err) {
            logger.error('----- create evaluate error  -----');
            next(err);
        } else {
            logger.info('----- create a evaluate  -----');
            res.redirect("/evaluates");
        }
    })
});

router.get('/:id/edit', function(req, res, next) {
    var db = req.db;
    var collection = db.get('evaluatecollection');
    collection.findOne({
        _id: req.params.id
    }, function(err, docs) {
        if (err) {
            logger.error('----- find evaluate error id = ' + req.params.id + ' -----');
            next(err);
        } else {
            res.render('home/evaluate-edit', {
                'sitemap': '<a href="/evaluates">评估逻辑</a><a class="current" href="#">编辑可回购手机</a>',
                'evaluate': docs
            })
        }
    })
});

router.post('/:id/edit', upload.single('file'), function(req, res, next) {
        var db = req.db;
        var collection = db.get('evaluatecollection');
        var evaluate = req.body;
        evaluate.seq = parseInt(req.body.seq);
        if (req.file) {
            evaluate.pic = _uploadDir + req.file.filename;
        }
        collection.update({
            _id: req.params.id
        }, evaluate, function(err, docs) {
            if (err) {
                logger.error('----- update evaluate error id = ' + req.params.id + ' -----');
                next(err);
            }
            logger.info('----- update evaluate id = ' + req.params.id + ' -----');
            res.redirect("/evaluates");
        })
    })
    /*
    router.post('/:id/edit', function(req, res, next) {
        var db = req.db;
        var id = req.params.id;
        var collection = db.get('evaluatecollection');
        var evaluate = req.body;
        evaluate.seq = parseInt(req.body.seq);
        upload(req, res, function(err) {
            if (err) {
                logger.error('----- upload image error -----');
                return;
            }
            evaluate.pic = req.files[0].filename;

            collection.update({
                _id: id
            }, evaluate, function(err, docs) {
                if (err) {
                    logger.error('----- update evaluate error id = ' + id + ' -----');
                    next(err);
                }
                logger.info('----- update evaluate id = ' + id + ' -----');
                res.redirect("/evaluates");
            })
        })
    })*/

router.get('/:id/del', function(req, res) {
    var db = req.db;
    var collection = db.get('evaluatecollection');
    collection.remove({
        _id: req.params.id
    }, function(err, docs) {
        if (err) {
            logger.error('----- delete evaluate error  -----');
            next(err);
        } else {
            logger.info('----- delete evaluate id = ' + req.params.id + '  -----');
            res.redirect("/evaluates");
        }
    })
})

router.get('/:evaluateId/logic', function(req, res) {
    var db = req.db;
    var evaluatecollection = db.get('evaluatecollection');
    var logiccollection = db.get('evaluate_logiccollection');
    evaluatecollection.findOne({
        _id: req.params.evaluateId
    }, function(err, docs) {
        logiccollection.find({
            evaluate_id: req.params.evaluateId
        }, {
            sort: {
                seq: 1
            }
        }, function(err1, docs1) {
            res.render('home/evaluate-logic', {
                'sitemap': '<a href="/evaluates">评估逻辑</a><a class="current" href="#">逻辑属性</a>',
                'evaluate': docs,
                'logicList': docs1
            })
        })
    })
})


router.get('/:evaluateId/logic/add', function(req, res, next) {
    res.render('home/evaluate-logic-edit', {
        'sitemap': '<a href="/evaluates">评估逻辑</a><a href="/evaluates/' + req.params.evaluateId + '/logic">逻辑属性</a><a class="current" href="#">添加可回购手机</a>',
        logic: {
            'evaluate_id': req.params.evaluateId,
            'name': null,
            'type': 'radio',
            'seq': null
        }
    })
});

router.post('/:evaluateId/logic/add', function(req, res, next) {
    var db = req.db;
    var logic = req.body;
    logic.seq = parseInt(req.body.seq);
    var collection = db.get('evaluate_logiccollection');
    collection.insert(logic, function(err, docs) {
        if (err) {
            logger.error('----- create evaluate logic error  -----');
            next(err);
        } else {
            logger.info('----- create a evaluate logic  -----');
            res.redirect("/evaluates/" + req.params.evaluateId + "/logic");
        }
    })
});

router.get('/:evaluateId/logic/:id/edit', function(req, res, next) {
    var db = req.db;
    var collection = db.get('evaluate_logiccollection');
    collection.findOne({
        _id: req.params.id
    }, function(err, docs) {
        if (err) {
            logger.error('----- find evaluate logic error id = ' + req.params.id + ' -----');
            next(err);
        } else {
            res.render('home/evaluate-logic-edit', {
                'sitemap': '<a href="/evaluates">评估逻辑</a><a href="/evaluates/' + req.params.evaluateId + '/logic">逻辑属性</a><a class="current" href="#">编辑可回购手机</a>',
                'logic': docs
            })
        }
    })
});

router.post('/:evaluateId/logic/:id/edit', function(req, res, next) {
    var db = req.db;
    var collection = db.get('evaluate_logiccollection');
    var logic = req.body;
    logic.seq = parseInt(req.body.seq);
    collection.update({
        _id: req.params.id
    }, logic, function(err, docs) {
        if (err) {
            logger.error('----- update evaluate logic error id = ' + req.params.id + ' -----');
            next(err);
        }
        logger.info('----- update evaluate logic id = ' + req.params.id + ' -----');
        res.redirect("/evaluates/" + req.params.evaluateId + "/logic");
    })
})

router.get('/:evaluateId/logic/:id/del', function(req, res) {
    var db = req.db;
    var collection = db.get('evaluate_logiccollection');
    collection.remove({
        _id: req.params.id
    }, function(err, docs) {
        if (err) {
            logger.error('----- delete evaluate logic error  -----');
            next(err);
        } else {
            logger.info('----- delete evaluate logic id = ' + req.params.id + '  -----');
            res.redirect("/evaluates/" + req.params.evaluateId + "/logic");
        }
    })
})


/* -------------------  */

router.get('/:evaluateId/logic/:logicId/option', function(req, res) {
    var db = req.db;
    var logiccollection = db.get('evaluate_logiccollection');
    var optioncollection = db.get('evaluate_logic_optioncollection');
    logiccollection.findOne({
        _id: req.params.logicId
    }, function(err, docs) {
        optioncollection.find({
            logic_id: req.params.logicId
        }, {
            sort: {
                seq: 1
            }
        }, function(err1, docs1) {
            res.render('home/evaluate-logic-option', {
                'sitemap': '<a href="/evaluates">评估逻辑</a><a href="/evaluates/' + req.params.evaluateId + '/logic">逻辑属性</a><a class="current" href="#">选项</a>',
                'evaluateId': req.params.evaluateId,
                'logic': docs,
                'optionList': docs1
            })
        })

    })
})


router.get('/:evaluateId/logic/:logicId/option/add', function(req, res, next) {
    res.render('home/evaluate-logic-option-edit', {
        'sitemap': '<a href="/evaluates">评估逻辑</a><a href="/evaluates/' + req.params.evaluateId + '/logic">逻辑属性</a><a class="current" href="#">添加选项</a>',
        option: {
            'logic_id': req.params.logicId,
            'name': null,
            'price': null,
            'seq': null
        }
    })
});

router.post('/:evaluateId/logic/:logicId/option/add', function(req, res, next) {
    var db = req.db;
    var option = req.body;
    option.price = parseFloat(req.body.price);
    option.seq = parseInt(req.body.seq);
    var collection = db.get('evaluate_logic_optioncollection');
    collection.insert(option, function(err, docs) {
        if (err) {
            logger.error('----- create evaluate logic option error  -----');
            next(err);
        } else {
            logger.info('----- create a evaluate logic option  -----');
            res.redirect("/evaluates/" + req.params.evaluateId + "/logic/" + req.params.logicId + "/option");
        }
    })
});

router.get('/:evaluateId/logic/:logicId/option/:id/edit', function(req, res, next) {
    var db = req.db;
    var collection = db.get('evaluate_logic_optioncollection');
    collection.findOne({
        _id: req.params.id
    }, function(err, docs) {
        if (err) {
            logger.error('----- find evaluate logic option error id = ' + req.params.id + ' -----');
            next(err);
        } else {
            res.render('home/evaluate-logic-option-edit', {
                'sitemap': '<a href="/evaluates">评估逻辑</a><a href="/evaluates/' + req.params.evaluateId + '/logic">逻辑属性</a><a class="current" href="#">编辑选项</a>',
                'option': docs
            })
        }
    })
});

router.post('/:evaluateId/logic/:logicId/option/:id/edit', function(req, res, next) {
    var db = req.db;
    var collection = db.get('evaluate_logic_optioncollection');
    var option = req.body;
    option.price = parseFloat(req.body.price);
    option.seq = parseInt(req.body.seq);
    collection.update({
        _id: req.params.id
    }, option, function(err, docs) {
        if (err) {
            logger.error('----- update evaluate logic option error id = ' + req.params.id + ' -----');
            next(err);
        }
        logger.info('----- update evaluate logic option id = ' + req.params.id + ' -----');
        res.redirect("/evaluates/" + req.params.evaluateId + "/logic/" + req.params.logicId + "/option");
    })
})

router.get('/:evaluateId/logic/:logicId/option/:id/del', function(req, res) {
    var db = req.db;
    var collection = db.get('evaluate_logic_optioncollection');
    collection.remove({
        _id: req.params.id
    }, function(err, docs) {
        if (err) {
            logger.error('----- delete evaluate logic option error  -----');
            next(err);
        } else {
            logger.info('----- delete evaluate logic option id = ' + req.params.id + '  -----');
            res.redirect("/evaluates/" + req.params.evaluateId + "/logic/" + req.params.logicId + "/option");
        }
    })
})

module.exports = router;
