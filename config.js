var moment = require('moment');
var config = {};
var userCfg;

config.twitter = {};
config.twitter.username = '';
userCfg = require('./user_' + config.twitter.username + '.json')

config.twitter.api = {
      consumer_key: userCfg.consumer_key
    , consumer_secret: userCfg.consumer_secret
    , access_token: userCfg.access_token
    , access_token_secret: userCfg.access_token_secret
};

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
      '#travel'
    , '#cooking'
    , '#KansasCity'
    , '#Royals'
    , '#Sephora'
    , '#Seinfeld'
    , '#ShineShineShine'
    , '#rhony'
    , '#rhomelbourne'
];

module.exports = config;
