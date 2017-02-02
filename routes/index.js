var express = require('express');
var router = express.Router();
var request = require('request');
var parser = require("body-parser");

var fs = require('fs');
var dataHome = require('../weatherData/homeData.json');

module.exports = router;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',
      { title: 'Express',
        home: dataHome
      });
});


router.use(parser.urlencoded({extended: true}));

router.post("/", function (req, res){
    increaseTemp();
});



function increaseTemp() {
    newValue = 35;

    var fileName = '../weatherData/homeData.json';
    var file = require(fileName) ;

    file.temp = newValue;


    console.log("success");

    fs.writeFile(fileName, JSON.stringify(file), function(err){
        if (err) return console.log(err);
        console.log(JSON.stringify(file));
        console.log('writing to ' + fileName);
    });
    fs.close(file);
}





