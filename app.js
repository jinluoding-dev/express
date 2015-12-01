var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var log = require('./log');
var logger = require('./log').logger;
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var connect = require('connect');
var SessionStore = require("session-mongoose")(connect);
var monk = require('monk');
var db = monk('localhost:27017/jlddb')
var routes = require('./routes/index');
var users = require('./routes/users');
var evaluates = require('./routes/evaluates');
var products = require('./routes/products');

var app = express();

log.use(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(session({
    secret: 'www.jinluoding.com',
    store: new SessionStore({
        url: "mongodb://localhost/session",
        interval: 120000
    })
}));
app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    var err = req.session.error;
    delete req.session.error;
    res.locals.message = '';
    if (err) res.locals.message = '<div class="alert alert-error">' + err + '</div>';
    req.db = db;
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

function authentication(req, res, next) {
    if (!req.session.user) {
        req.session.error = '请先登陆';
        return res.redirect('/login');
    }
    next();
}

app.use('/', routes);
app.use('/users', users);
app.use('/products', authentication, products);
app.use('/evaluates', evaluates);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        logger.error(err.status)
        logger.error(err.message)
        logger.error(err.stack)
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    logger.error(err.status)
    logger.error(err.message)
    logger.error(err.stack)
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
