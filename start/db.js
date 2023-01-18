const winston = require('winston')
const mongoose = require('mongoose')
const config = require('config')

module.exports = function(){
    // mongoose connection setup
    mongoose.set("strictQuery", false);
    mongoose.connect(config.get('db'),{
        family: 4,
        useNewUrlParser: true
    })
        .then(() => {
        winston.info("Connected to " + config.get('db') )})
}