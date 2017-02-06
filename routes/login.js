/**
 * Created by Luis on 06.02.2017.
 */


var express = require('express');
var router = express.Router();
var request = require('request');

module.exports = router;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Login', loginError: "", passwordError: ""});
});





