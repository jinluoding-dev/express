var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var db = req.db;
    var collection = db.get('usercollection');
    collection.find({}, {
        sort: {
            attention_date: 1
        }
    }, function(err, docs) {
    	user.attention_date = new Date(user.attention_date);
        res.render('home/user', {
            'sitemap': '<a class="current" href="#">用户列表</a>',
            'userList': docs
        })
    })
});

module.exports = router;
