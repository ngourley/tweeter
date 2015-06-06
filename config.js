var moment = require('moment');
var config = {};

config.twitter = {};
config.twitter.api = {
      consumer_key: process.env.CONSUMER_KEY
    , consumer_secret: process.env.CONSUMER_SECRET
    , access_token: process.env.ACCESS_TOKEN
    , access_token_secret: process.env.ACCESS_TOKEN_SECRET
};

config.twitter.username = 'nathangourley';

config.mongo = {};
config.mongo.user = process.env.MONGO_USER;
config.mongo.password = process.env.MONGO_PASSWORD;
config.mongo.database = process.env.MONGO_DATABASE || 'twitter';
config.mongo.host = process.env.MONGO_HOST;
config.mongo.port = process.env.MONGO_PORT;

config.mongo.getUri = function() {
    return 'mongodb://' + config.mongo.user + ':' +
        config.mongo.password + '@' + config.mongo.host +
        ':' + config.mongo.port + '/' + config.mongo.database;
};

config.winston = {};
config.winston.level = 'debug';
config.winston.colorize = true;
config.winston.timestamp = function() {
    return moment().format('D MMM HH:mm:ss');
};

config.topics = [
      '#nodejs'
    , '#javascript'
    , '#angularjs'
];

module.exports = config;
