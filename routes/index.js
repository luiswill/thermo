var express     = require('express');
var router      = express.Router();
var request     = require('request');
var bodyParser  = require("body-parser"); // body-parser extract data from the <form> and add it to the body property in the request object.
var mongo       = require('mongodb').MongoClient;
var objectID    = require('mongodb').ObjectID;
var assert      = require('assert');
var passport    = require('passport');
var idHome      = '58946479f12654d263d62844'; //id of our home, doesn't change, it's a constant
var url         = 'mongodb://localhost:27017/test';
var einheit     = "°C"; //Celius is the default unity
var weatherAPI  = require('openweather-apis');
weatherAPI.setAPPID('1c12a784ad25f95111035d8132662635');
weatherAPI.setCity('Saarbruecken'); //The locatin at this moment

router.use(bodyParser.urlencoded({extended: true})); // otherwise get the error : "bodyparser is outdated"

module.exports = router;

/**
 * When the hompage is called, refresh the local and external weather
 */
router.get('/', function(req, res, next){
    var final = 0;
    einheit = "°C";
    weatherAPI.getAllWeather(function(err, weatherJSON){ //update external weather
        refresh(function(err, temp){
            res.render('index', {title: "My Thermometer", home: temp, unity: einheit, weather: weatherJSON}); //update display
        });
    });
});

/**
 * @param callThisFunction the function to be called with the new weather
 * refresh the temperature of the house in the db and the external temp
 */
function refresh(callThisFunction){
    mongo.connect(url, function(err, db){
        if(err) throw err;
        db.collection("data").findOne({"_id": objectID(idHome)}, function(err, doc) {
            if(err) throw err;
            if (doc) {
				weatherAPI.getAllWeather(function(err, weatherJSON){
					callThisFunction(null, doc.temp, weatherJSON);
					db.close();
				});
            }else{
                console.log("no data found");
            }
        });
    });
}

    /**
     * Switch unity once from Fahrenheit to Celsius oder the other way, called with the button switch once
     * Display this change, but not change value in Database, there the temp is always stocked in Celsius
     */
    router.post('/switch', function(req, res, next){
        var item = 0;
        // 2 constants needes to convert the temperature
        var SWITCH_F_C_KONST = 32;
        var SWITCH_C_F_FAKTOR = 1.8;

        mongo.connect(url, function(err, db) {
            db.collection("data").findOne({"_id": objectID(idHome)}, function(err, doc) {
                if(err){
                    throw err;
                }
                if (doc){
                    if (einheit == "°C") {
                        einheit = "°F";//change unity to display
                        item = doc.temp * parseFloat(SWITCH_C_F_FAKTOR) + parseFloat(SWITCH_F_C_KONST);//convert to Fahrenheit

                    }
                    else if (einheit == "°F"){
                        einheit = "°C";//change unity to display
                        item = doc.temp;//the value stocked in the database
                    }
                    weatherAPI.getAllWeather(function (err, weatherJSON) {
                        res.render('index', {
                            title: "My Thermometer",
                            home: item,
                            unity: einheit,
                            weather: weatherJSON
                        });
                    });
                }
            });
        })
    });


/**
 * Update the weather in the house, required by user
 * change the value in the database, display it
 */
router.post('/update', function(req, res, next){
    einheit = "°C";//unity back to Celsius
    var item = {temp: req.body.changeTemp};//look what temp the user entered

    mongo.connect(url, function(err, db){
        assert.equal(null, err);
        db.collection("data").updateOne({"_id": objectID(idHome)}, {$set: item}, function(err, result) {
            assert.equal(null, err);
            console.log("Temperature updated");
            db.collection("data").findOne({"_id": objectID(idHome)}, function(err, doc) {
                if (err) {
                    throw err;
                }
                if (doc) {
                    var currentdate = new Date();
                    console.log(currentdate + " the temp was changed to : " + doc.temp + "°C");
                }
                db.close();

            });
            db.close();
            res.redirect('/');
        });
    })
});


/**
 * link to signup
 */
router.get('/signup', function (req, res){
    msgError = req.msgError;
    res.render('signup', {message : msgError});
});

/**
 * link to signup and send the data to the database
 */
router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile', //if a profile exists
    failureRedirect: '/signup',  //if not he shall sign up
    failureFlash : true
}));

/**
 * link to login, enter username
 */
router.get('/login', function (req, res){
    login_error = req.body.loginError;
    password_error = req.body.passwordError;
    res.render('login', {loginError: login_error, passwordError : password_error});
});

/**
 * link to login and send data to the database
 */
router.post('/login', passport.authenticate('local.login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash : true
}));

//Fonction du profil
//isLoggedIn = oblige l'utilsateur à être co pour accéder au profil
router.get('/profile', isLoggedIn, function (req, res){
    res.render('profile', {user: req.user});
});

/**
 * function to logout
 */
router.get('/logout', function (req, res){
    req.logout();
    res.redirect('/');
});


//function si utilisateur login est login -- > next
// Si il ne l'es pas il est redirigé vers la page de login
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');
}/**
 * Created by Luis on 06.02.2017.
 */




