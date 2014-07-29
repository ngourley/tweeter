var moment = require('moment');
var config = {};

config.twitter = {};
config.twitter.api = {
      consumer_key: ''
    , consumer_secret: ''
    , access_token: ''
    , access_token_secret: ''
};

config.twitter.username = 'nathangourley';

config.mongo = {};
config.mongo.user = process.env.MONGO_USER || 'root';
config.mongo.password = process.env.MONGO_PASSWORD || 'password';
config.mongo.database = process.env.MONGO_DATABASE || 'twitter';
config.mongo.host = process.env.MONGO_HOST || 'kahana.mongohq.com';
config.mongo.port = process.env.MONGO_PORT || '10078';

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