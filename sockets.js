var   config  = require('./config')
    , Bot     = require('./bot')
    , follower = require('./models/follower')
    , moment  = require('moment');

var bot = new Bot(config.twitter);

// Note: Rename file later to reflect something like "brain" or "control"

follower.cacheIds();
follower.cacheList();

setInterval(function () {
    follower.cacheIds();
    follower.cacheList();
}, moment.duration(15, 'minute'));


module.exports = function (socket) {

    socket.on('myTweets::list', function () {
        bot.getMyTweets(function(err, data) {
            socket.emit('myTweets::list', err, data);
        });
    });

    socket.on('followers::list', function () {
        follower.list(function (err, data) {
            socket.emit('followers::list', err, data);
        });
    });
};