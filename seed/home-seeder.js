/**
 * Created by Luis on 02.02.2017.
 */
var Home = require('../models/home');

var home = new Home({
    temp: 28,
    humidity: '75%'
});

home.save();

function exit() {
    mongoose.disconnect();
}