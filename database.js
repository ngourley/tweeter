var   config   = require('./config')
    , mongoose = require('mongoose')
    , winston  = require('winston');

mongoose.connect(config.mongo.getUri());

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    winston.info('Connection to ' + config.mongo.host + ' successful');
});