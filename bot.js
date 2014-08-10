var   config  = require('./config')
    , Twit    = require('twit')
    , __      = require('underscore')
    , moment  = require('moment')
    , winston = require('winston');

function randomTopic () {
    var arr = config.topics;
    var index = Math.floor(arr.length*Math.random());
    return arr[index];
}

function randIndex (arr) {
    var index = Math.floor(arr.length*Math.random());
    return arr[index];
}

function getTodayDateStamp () {
    return moment().format('YYYY-M-DD');
}

var Bot = function (config) { 
    this.twit = new Twit(config.api);
    this.username = config.username;
};

Bot.prototype.searchTweets = function (params, callback) {
    var self = this;
    self.twit.get('search/tweets', params, callback);
};

Bot.prototype.getRetweetIds = function (callback) {
    var self = this;
    self.twit.get('statuses/user_timeline', {q: self.username},
        function(err, tweets) {
        if (err) {
            return callback(err);
        }
        var exclusionList = [];
        __.each(tweets, function(tweet) {

            exclusionList.push(tweet.id_str);

            if (tweet.retweeted_status === undefined) {
                return;
            }
            exclusionList.push(tweet.retweeted_status.id_str);
        });
        callback(null, exclusionList);
    });
};

Bot.prototype.getRateLimit = function (callback) {
    var self = this;
    self.twit.get('application/rate_limit_status',
        {resources: ['statuses', 'friendships']},
        callback);
};

Bot.prototype.tweet = function (text, callback) {
    var self = this;
    text; self; // TODO - Add basic tweet functionality
    callback(new Error('Functionality not yet implemented'));
};

Bot.prototype.retweet = function (tweet, callback) {
    var self = this;
    self.twit.post('statuses/retweet/:id', { id: tweet.id_str, }, callback);
};

Bot.prototype.retweetTopic = function (topic, callback) {
    var self = this;
    if (topic === undefined) {
        return callback(new Error('Topic is not defined.'));
    }

    var params = {
          q: topic
        , since: getTodayDateStamp()
        , result_type: 'mixed'
        , lang: 'en'
    };

    self.getRetweetIds(function(err, exclusionList) {
        if (err) {
            return callback(err);
        }
        self.retweetMostPopular(exclusionList, params, callback);
    });
};

Bot.prototype.retweetRandom = function (callback) {
    var self = this;
    self.retweetTopic(randomTopic(), callback);
};

Bot.prototype.retweetMostPopular = function (exclusionList, params, callback) {
    var self = this;
    self.searchTweets(params, function(err, data, response) {
        response;
        var max = 0, popular;

        __.each(data.statuses, function(tweet) {

            if (exclusionList.indexOf(tweet.id_str) !== -1) {
                return;
            }

            // TODO - Remove nested if-statement
            if (tweet.retweeted_status !== undefined) {
                if (exclusionList.indexOf(tweet.retweeted_status.id_str) !== -1) {
                    return;
                }
            }

            if (tweet.retweet_count > max) {
                max = tweet.retweet_count;
                popular = tweet;
            }
        });

        self.twit.post('statuses/retweet/:id',
            { id: popular.id_str, },
            callback);
    });
};

Bot.prototype.untweet = function (tweet, callback) {
    var self = this;
    self.twit.post('statuses/destroy/:id', { id: tweet.id_str }, callback);
};

Bot.prototype.follow = function (userId, callback) {
    var self = this;
    self.twit.post('friendships/create', { id: userId }, callback);
};

Bot.prototype.unfollow = function (userId, callback) {
    var self = this;
    self.twit.post('friendships/destroy', { id: userId }, callback);
};

Bot.prototype.mingleLikelyToFollow = function (callback) {
    var self = this;

    self.twit.get('followers/ids', function(err, reply) {
        if (err) {
            return callback(err, null);
        }

        var followers = reply.ids
        , randFollower  = randIndex(followers);
        
        self.twit.get('friends/list', { user_id: randFollower },
            function(err, data) {
            if (err) {
                return callback(err, null); 
            }
              
            var max = 0, best;

            __.each(data.users, function(user) {

                // Must have a status
                if (user.status === undefined) {
                    return;
                }

                var lastTweetTime = moment(user.status.created_at);
                var hours = moment().diff(lastTweetTime, 'hours');

                // Status can't be old
                if (hours > 48) {
                    return;
                }

                // Miniium Follows
                if (user.followers_count < 25) {
                    return;
                }

                // Ignore those already following me
                if (user.following === true) {
                    return;
                }

                var followToFollerRatio =
                    user.friends_count / user.followers_count;

                if (followToFollerRatio > max) {
                    max = followToFollerRatio;
                    best = user;
                }

            });

            self.twit.post('friendships/create', { id: best.id }, callback);
        });
    });
};

Bot.prototype.mingle = function (callback) {
    var self = this;

    self.twit.get('followers/ids', function(err, reply) {
        if (err) {
            return callback(err, null);
        }

        var followers = reply.ids
        , randFollower  = randIndex(followers);
        
        self.twit.get('friends/ids', { user_id: randFollower },
            function(err, reply) {
            if (err) {
                return callback(err, null); 
            }
              
            var friends = reply.ids
            , target  = randIndex(friends);

            self.follow(target, callback);
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

Bot.prototype.getMyTweets = function (callback) {
    var self = this;
    self.twit.get('statuses/user_timeline',
        { screen_name: self.username },
        function (err, data, response) {
        response;
        if (err) {
            winston.error(err);
            return callback(err, null);
        }
        return callback(null, data);
    });
};

Bot.prototype.prune = function (callback) {
    var self = this;

    this.twit.get('followers/ids', function(err, reply) {
        if (err) {
            return callback(err);
        }

        var followers = reply.ids;

        self.twit.get('friends/ids', function(err, reply) {
            if (err) {
                return callback(err);
            }

            var friends = reply.ids
            , pruned = false;

            while(!pruned) {
                var target = randIndex(friends);

                if(!~followers.indexOf(target)) {
                    pruned = true;
                    self.twit.post('friendships/destroy',
                        { id: target },
                        callback);
                }
            }
        });
    });
};

module.exports = Bot;