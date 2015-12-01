var express = require('express');
var router = express.Router();
var logger = require('../log').logger;

/* GET users listing. */
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
            'seq': null
        }
    })
});

router.post('/add', function(req, res, next) {
    var db = req.db;
    var evaluate = req.body;
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

router.get('/edit/:id', function(req, res, next) {
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

router.post('/edit/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('evaluatecollection');
    var evaluate = req.body;
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

router.get('/del/:id', function(req, res) {
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

router.get('/logic/:evaluateId', function(req, res) {
    var db = req.db;
    var evaluatecollection = db.get('evaluatecollection');
    var logiccollection = db.get('evaluate_logiccollection');
    evaluatecollection.findOne({
        _id: req.params.evaluateId
    }, function(err, docs) {
        logiccollection.find({}, {
            sort: {
                seq: 1
            }
        }, function(err1, docs1) {
            res.render('home/evaluate-logic', {
                'sitemap': '<a href="/evaluates">评估逻辑</a><a class="current" href="#">' + docs.model + '</a>',
                'evaluate': docs,
                'logiclist': docs1
            })
        })

    })
})


router.get('/logic/:evaluateId/add', function(req, res, next) {
    res.render('home/evaluate-logic-edit', {
        'sitemap': '<a href="/evaluates">评估逻辑</a><a href="/evaluates/' + req.params.evaluateId + '/logic">' + docs.model + '</a><a class="current" href="#">添加可回购手机</a>',
        logic: {
            'evaluateId': req.params.evaluateId,
            'name': null,
            'type': null,
            'seq': null
        }
    })
});

router.post('/logic/:evaluateId/add', function(req, res, next) {
    var db = req.db;
    var logic = req.body;
    var collection = db.get('evaluate_logiccollection');
    collection.insert(logic, function(err, docs) {
        if (err) {
            logger.error('----- create evaluate logic error  -----');
            next(err);
        } else {
            logger.info('----- create a evaluate logic  -----');
            res.redirect("/evaluates/logic/" + req.params.evaluateId);
        }
    })
});

router.get('/logic/:evaluateId/edit/:id', function(req, res, next) {
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
                'sitemap': '<a href="/evaluates">评估逻辑</a><a href="/evaluates/' + req.params.evaluateId + '/logic">' + docs.model + '</a><a class="current" href="#">编辑可回购手机</a>',
                'logic': docs
            })
        }
    })
});

router.post('/logic/:evaluateId/edit/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('evaluate_logiccollection');
    var evaluate = req.body;
    collection.update({
        _id: req.params.id
    }, evaluate, function(err, docs) {
        if (err) {
            logger.error('----- update evaluate logic error id = ' + req.params.id + ' -----');
            next(err);
        }
        logger.info('----- update evaluate logic id = ' + req.params.id + ' -----');
        res.redirect("/evaluates/logic/" + req.params.evaluateId);
    })
})

router.get('/logic/:evaluateId/del/:id', function(req, res) {
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
            res.redirect("/evaluates/logic/" + req.params.evaluateId);
        }
    })
})


/* -------------------  */

router.get('/logic/:evaluateId/option/:logicId', function(req, res) {
    var db = req.db;
    var evaluatecollection = db.get('evaluatecollection');
    var logiccollection = db.get('evaluate_logiccollection');
    var optioncollection = db.get('evaluate_logic_optioncollection');
    logiccollection.findOne({
        _id: req.params.logicId
    }, function(err, docs) {
        optioncollection.find({}, {
            sort: {
                seq: 1
            }
        }, function(err1, docs1) {
            res.render('home/evaluate-logic-option', {
                'sitemap': '<a href="/evaluates">评估逻辑</a><a href="/evaluates/' + req.params.evaluateId + '/logic">' + docs.model + '</a><a class="current" href="#">' + docs.name + '</a>',
                'evaluate': docs,
                'logiclist': docs1
            })
        })

    })
})


router.get('/logic/:evaluateId/add', function(req, res, next) {
    res.render('home/evaluate-logic-edit', {
        'sitemap': '<a href="/evaluates">评估逻辑</a><a href="/evaluates/' + req.params.evaluateId + '/logic">逻辑属性</a><a class="current" href="#">添加可回购手机</a>',
        logic: {
            'evaluateId': req.params.evaluateId,
            'name': null,
            'type': null,
            'seq': null
        }
    })
});

router.post('/logic/:evaluateId/add', function(req, res, next) {
    var db = req.db;
    var logic = req.body;
    var collection = db.get('evaluate_logiccollection');
    collection.insert(logic, function(err, docs) {
        if (err) {
            logger.error('----- create evaluate logic error  -----');
            next(err);
        } else {
            logger.info('----- create a evaluate logic  -----');
            res.redirect("/evaluates/logic/" + req.params.evaluateId);
        }
    })
});

router.get('/logic/:evaluateId/edit/:id', function(req, res, next) {
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

router.post('/logic/:evaluateId/edit/:id', function(req, res, next) {
    var db = req.db;
    var collection = db.get('evaluate_logiccollection');
    var evaluate = req.body;
    collection.update({
        _id: req.params.id
    }, evaluate, function(err, docs) {
        if (err) {
            logger.error('----- update evaluate logic error id = ' + req.params.id + ' -----');
            next(err);
        }
        logger.info('----- update evaluate logic id = ' + req.params.id + ' -----');
        res.redirect("/evaluates/logic/" + req.params.evaluateId);
    })
})

router.get('/logic/:evaluateId/del/:id', function(req, res) {
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
            res.redirect("/evaluates/logic/" + req.params.evaluateId);
        }
    })
})

module.exports = router;
