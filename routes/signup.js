/**
 * Created by Luis on 06.02.2017.
 */


var express = require('express');
var router = express.Router();
var request = require('request');

module.exports = router;

/**
 * get back to the homepage
 */
router.get('/', function(req, res, next) {
    res.render('signup', { title: 'Signup', msgError: ""});
});





