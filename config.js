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