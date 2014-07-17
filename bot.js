var   Twit    = require('twit')
    , __      = require('underscore')
    , winston = require('winston');

function randIndex (arr) {
    var index = Math.floor(arr.length*Math.random());
    return arr[index];
}

var Bot = function (config) { 
    this.twit = new Twit(config.api);
    this.username = config.username;
};

Bot.prototype.followCount = function() {

};

Bot.prototype.mingle = function (callback) {
    var self = this;

    self.twit.get('followers/ids', function(err, reply) {
        if (err) {
            winston.error(err);
            return callback(err, null);
        }

        var followers = reply.ids
        , randFollower  = randIndex(followers);
        
        self.twit.get('friends/ids', { user_id: randFollower }, function(err, reply) {
            if (err) {
                winston.error(err);
                return callback(err, null); 
            }
              
            var friends = reply.ids
            , target  = randIndex(friends);

            self.twit.post('friendships/create', { id: target }, callback);
        });
    });
};

Bot.prototype.searchFollow = function (params, callback) {
    var self = this;

    self.twit.get('search/tweets', params, function (err, reply) {
        if (err) {
            winston.error(err);
            return callback(err, null);
        }

        var tweets = reply.statuses;
        var target = randIndex(tweets).user.id_str;

        self.twit.post('friendships/create', { id: target }, callback);
    });
};

Bot.prototype.printMyTweets = function (callback) {
    var self = this;

    self.twit.get('search/tweets', { q: 'nathangourley' },  function (err, data, response) {
        if (err) {
            winston.error(err);
            return callback(err, null);
        }
        __.each(data.statuses, function(tweet) {
            winston.info(tweet.id_str + ' - ' + tweet.text);
        });
        return callback(null, data);
    });
};

Bot.prototype.deleteTweet = function (id_str, callback) {
    var self = this;

    self.twit.post('statuses/destroy/:id', { id: id_str }, function (err, data, response) {
        if (err) {
            winston.error(err);
            return callback(err, null);
        }
        return callback(null, data);
    });
};


module.exports = Bot;