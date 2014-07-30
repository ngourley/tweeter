var   config  = require('./config')
    , Bot     = require('./bot')
    , moment  = require('moment');

var bot = new Bot(config.twitter);

// Note: Rename file later to reflect something like "brain" or "control"

bot.cacheFollowerIds();
bot.cacheFollowerData();

setInterval(function () {
    bot.cacheFollowerIds();
    bot.cacheFollowerData();
}, moment.duration(15, 'minute'));


module.exports = function (socket) {

    socket.on('myTweets::list', function () {
        bot.getMyTweets(function(err, data) {
            socket.emit('myTweets::list', err, data);
        });
    });

    socket.on('followers::list', function () {
        bot.queryFollowerList(function (err, data) {
            socket.emit('followers::list', err, data);
        });
    });
};