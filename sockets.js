var   config  = require('./config')
    , Bot     = require('./bot');

var bot = new Bot(config.twitter);

// Note: Rename file later to reflect something like "brain" or "control"


bot.cacheFollowers();

module.exports = function (socket) {

    socket.on('myTweets::list', function () {
        bot.getMyTweets(function(err, data) {
            socket.emit('myTweets::list', err, data);
        });
    });

    socket.on('followers::list', function () {
        // TODO: Add logic here to return followers
    });
};