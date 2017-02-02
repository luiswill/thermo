/**
 * Created by Luis on 02.02.2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    humidity: {type: String, required: true},
    temp: {type: Number, required: true}
});

model.exports = mongoose.model('Home', schema);