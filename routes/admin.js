/**
 * Created by Luis on 02.02.2017.
 */

var express = require('express');
var router = express.Router();
var request = require('request');

/**
 * The home Page for the admin
 */
router.get('/', function(req, res, next) {
    res.render('admin', { title: 'Admin' });
});




module.exports = router;
