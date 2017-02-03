var express = require('express');
var router = express.Router();
var request = require('request');
var parser = require("body-parser");
var mongo = require('mongodb').MongoClient;
var MongoObjectID = require('mongodb').ObjectID;

var idToFind = '5893d692663c25f41f2f24c5';
var objToFind = {_id: new MongoObjectID(idToFind)};

var assert = require('assert');

var url = 'mongodb://localhost:27017/test';

mongo.connect(url);

module.exports = router;

/* GET home page. */
router.get('/', function(req, res, next){
    res.render('index', {title: "Index", home: 0});
});



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
                res.render('index', {home: resultArray[0].temp, title: "Index"});
            }
        );
    })
});











