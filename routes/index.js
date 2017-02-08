var express = require('express');
var router = express.Router();
var request = require('request');
var bodyParser = require("body-parser"); // body-parser extract data from the <form> and add it to the body property in the request object.
var mongo = require('mongodb').MongoClient;
var objectID = require('mongodb').ObjectID;
var assert = require('assert');
var passport = require('passport');
var weatherAPI = require('openweather-apis');
weatherAPI.setAPPID('1c12a784ad25f95111035d8132662635');

weatherAPI.setCity('Saarbruecken');


var idHome = '58946479f12654d263d62844'; //id of our home, doesn't change, it's a constant
var url = 'mongodb://localhost:27017/test';
var einheit = "°C";
router.use(bodyParser.urlencoded({extended: true})); // otherwise get the error : "bodyparser is outdated"

module.exports = router;

/* GET home page. */
router.get('/', function(req, res, next){
    var final = 0;

    weatherAPI.getAllWeather(function(err, weatherJSON){
        refresh(function(err, temp){
            res.render('index', {title: "My Thermometer", home: temp, unity: einheit, weather: weatherJSON});
        });

    });

        refresh(function(err, temp, weatherJSON){
            res.render('index', {title: "My Thermometer", home: temp, unity: einheit, weather: weatherJSON});
        });
});

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
     * Die Einheit einmalig veraendern und dies darstellen
     */
    router.post('/switch', function(req, res, next){
        var SWITCH_F_C_KONST = 32;
        var SWITCH_C_F_FAKTOR = 1.8;
        mongo.connect(url, function(err, db) {
            db.collection("data").findOne({"_id": objectID(idHome)}, function(err, doc) {
                if(err){
                    throw err;
                }
                if (doc){
                    if (einheit == "°C") {
                        einheit = "°F";
                        var item = doc.temp * parseFloat(SWITCH_C_F_FAKTOR) + parseFloat(SWITCH_F_C_KONST);
                        weatherAPI.getAllWeather(function (err, weatherJSON) {
                            res.render('index', {
                                title: "My Thermometer",
                                home: item,
                                unity: einheit,
                                weather: weatherJSON
                            });
                        });
                    }
                    else if (einheit == "°F"){
                        einheit = "°C";
                        var item = doc.temp;
                        weatherAPI.getAllWeather(function (err, weatherJSON) {
                            res.render('index', {
                                title: "My Thermometer",
                                home: item,
                                unity: einheit,
                                weather: weatherJSON
                            });
                        });
                    }
                }
            })
        })
    });


/* UPDATE DATA from client to server */
router.post('/update', function(req, res, next){
    einheit = "°C";
    var item = {temp: req.body.changeTemp};

    mongo.connect(url, function(err, db){
        assert.equal(null, err);
        db.collection("data").updateOne({"_id": objectID(idHome)}, {$set: item}, function(err, result) {
            assert.equal(null, err);
            console.log("Temperature updated");
			db.close();
			res.redirect('/');
        });
    })
});



//Chemin vers signup
router.get('/signup', function (req, res){
    msgError = req.msgError;
    res.render('signup', {message : msgError});
});

//Chemin vers signup pour envoyer les infos à la db
router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash : true
}));

//Chemin vers login
router.get('/login', function (req, res){
    login_error = req.body.loginError;
    password_error = req.body.passwordError;
    res.render('login', {loginError: login_error, passwordError : password_error});
});

//Chemin vers login pour envoyer les infos à la db
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

//Fonction de logout
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




