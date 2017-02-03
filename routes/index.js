var express = require('express');
var router = express.Router();
var request = require('request');
var bodyParser = require("body-parser"); // body-parser extract data from the <form> and add it to the body property in the request object.
var mongo = require('mongodb').MongoClient;
var objectID = require('mongodb').ObjectID;
var assert = require('assert');

var idHome = '58946479f12654d263d62844'; //id of our home, doesn't change, it's a constant
var url = 'mongodb://localhost:27017/test';
var temp = 0;
router.use(bodyParser.urlencoded({extended: true})); // otherwise get the error : "bodyparser is outdated"

module.exports = router;

/* GET home page. */
router.get('/', function(req, res, next){
    var weather = getTempOutside();
    console.log("temp main" + weather);
    res.render('index', {title: "House Temperature", home: 0, tempOutside: weather});
});


/* GET temp from server */
router.get('/get-data', function(req, res, next) {
    var resultArray = [];
    mongo.connect(url, function(err, db){
        var cursor = db.collection("data").find();

        cursor.forEach(function(doc, err){
                assert.equal(null, err);
                resultArray.push(doc);
            }, function(){
                console.log(resultArray[0].temp);
                db.close();
                res.render('index', {home: resultArray[0].temp, title: "House"});
            }
        );
    })
});


/* UPDATE DATA from client to server */
router.post('/update', function(req, res, next){
    var item = {temp: req.body.changeTemp};

    mongo.connect(url, function(err, db){
        assert.equal(null, err);
        db.collection("data").updateOne({"_id": objectID(idHome)}, {$set: item}, function(err, result){
            assert.equal(null, err);
            console.log("Temperature updated");
            temp = item.temp;
            db.close();
            })
    })
});


/* GET weather forecast from city */

router.post('/weather', function(req, res, next){
   var item = {city: req.body.city};
   var key = "1c12a784ad25f95111035d8132662635";
   var url =  "http://api.openweathermap.org/data/2.5/weather?q=";
   var link = url + item.city + "&APPID=" + key + "&units=metric";
   console.log(item.city);
    request({
        url: link,
        json: true
    }, function (error, response, result) {

        if (!error && response.statusCode === 200) {
            // app.locals.weather = body;// Print the json response
            console.log(result.main.temp);
            res.render('index', {title: "House", weather: result.main, home: temp});
        }
    });

});



function getTempOutside(){
    var item = {"city": "Metz"};
    var key = "1c12a784ad25f95111035d8132662635";
    var url =  "http://api.openweathermap.org/data/2.5/weather?q=";
    var link = url + item.city + "&APPID=" + key + "&units=metric";

    request({
        url: link,
        json: true
    }, function (error, response, result) {

        if (!error && response.statusCode === 200) {
            // app.locals.weather = body;// Print the json response
            console.log("weather " + result.main.temp);
             return result.main.temp;
        }
    });
}








