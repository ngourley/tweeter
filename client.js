var Twit = require('twit');
var config = require('./config');
var twit = new Twit(config.twitter.api);
module.exports = twit;