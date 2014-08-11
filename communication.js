var   config   = require('./config')
    , Bot      = require('./bot')
    , follower = require('./models/follower')
    , task     = require('./models/task');

var bot = new Bot(config.twitter);

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

    socket.on('retweet::topic', function (topic) {
        bot.retweetTopic(topic, function (err, data) {
            socket.emit('retweet::topic', err, data);
            bot.getMyTweets(function(err, data) {
                socket.broadcast.emit('myTweets::list', err, data);
            });
        });
    });
    
    socket.on('myTweets::delete', function (tweet) {
        bot.untweet(tweet, function (err, data) {
            socket.emit('myTweets::delete', err, data);
            bot.getMyTweets(function(err, data) {
                socket.broadcast.emit('myTweets::list', err, data);
            });
        });
    });

    socket.on('tasks::list', function () {
        task.list(function (err, data) {
            socket.emit('tasks::list', err, data);
        });
    });

};