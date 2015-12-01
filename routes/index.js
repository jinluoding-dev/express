var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/main');
});

router.all('/login', notAuthentication);

router.get('/login', function(req, res, next) {
    res.render('login', {
        title: 'Login'
    });
});

router.post('/login', function(req, res, next) {
    var user = {
        username: 'admin',
        password: 'jld123456dev'
    }

    if (req.body.username === user.username && req.body.password === user.password) {
        req.session.user = user;
        res.redirect('/main');
    }
    req.session.error = '用户名或密码不正确';
    res.redirect('login');
});

router.get('/logout', authentication, function(req, res, next) {
    req.session.user = null;
    res.redirect('/');
});

router.get('/main', authentication, function(req, res, next) {
    var user = {
        username: 'admin',
        password: 'jld123456dev'
    }
    res.render('home/main', {
        title: 'Home',
        user: user
    });
});

function authentication(req, res, next) {
    if (!req.session.user) {
        req.session.error = '请先登陆';
        return res.redirect('/login');
    }
    next();
}

function notAuthentication(req, res, next) {
    if (req.session.user) {
        req.session.error = '已登陆';
        return res.redirect('/main');
    }
    next();
}

module.exports = router;
