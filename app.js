var express    = require('express');
var path       = require('path');
var bodyParser = require('body-parser');
var session    = require('express-session');
var mongoose   = require('mongoose');
var passport   = require('passport');
var MongoStore = require('connect-mongo')(session);
var port       = process.env.PORT || 3000;
var app        = express();
var user       = require('./routes/index');
var http       = require('http');
var request    = require('request');


var index     = require('./routes/index');
var admin     = require('./routes/admin');
var users     = require('./routes/passport');
var loginPage = require('./routes/login');
var signup    = require('./routes/signup');

var app = express(); //initialize express




// ASSERT FEHLER MACHEN !

// view engine setup{


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // We use Embedded JavaScript

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());
app.use(user);
app.use(session({
    secret : 'mysecrectsessionkey',
    resave : true,
    saveUninitialized : true,
    store : new MongoStore({mongooseConnection: mongoose.connection})
}));


app.use('/', index); //home directory
app.use('/users', users);
app.use('/admin', admin);
app.use('/login', loginPage);
app.use('/signup', signup);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
