var express = require('express');
var router = express.Router();
var request = require('request');
var bodyParser = require("body-parser"); // body-parser extract data from the <form> and add it to the body property in the request object.
var mongo = require('mongodb').MongoClient;
var objectID = require('mongodb').ObjectID;
var assert = require('assert');
var weatherAPI = require('openweather-apis');
weatherAPI.setAPPID('1c12a784ad25f95111035d8132662635');
weatherAPI.setCity('London');

var idHome = '58946479f12654d263d62844'; //id of our home, doesn't change, it's a constant
var url = 'mongodb://localhost:27017/test';
var temp = 0;
var tempOs = 0;
router.use(bodyParser.urlencoded({extended: true})); // otherwise get the error : "bodyparser is outdated"

module.exports = router;

/* GET home page. */
router.get('/', function(req, res, next){
    var final = 0;
    weatherAPI.getTemperature(function(err, temprslt){
		tempOs = temprslt;
        console.log(tempOs);
        res.render('index', {title: "House Temperature", home: temp, tempOutside: tempOs});
    });


});


/* GET temp from server */
router.get('/get-data', function(req, res, next) {
    var resultArray = [];
    mongo.connect(url, function(err, db){
		db.collection("data").findOne({"_id": objectID(idHome)}, function(err, doc) {
			if (doc) {
				resultArray.push(doc);
				temp = resultArray[0].temp
				console.log(temp);
                db.close();
                res.render('index', {home: temp, title: "House", tempOutside: tempOs});
			}
			else{
				console.log("db collection \"data\" not found");
			}
		});
    });
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
			res.render('index', {home: temp, title: "House", tempOutside: tempOs});
            })
    })
});


/* GET weather forecast from city */
