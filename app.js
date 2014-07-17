var   config  = require('./config')
    , Bot     = require('./bot')
    , twit    = require('twit')
    , winston = require('winston')
    , moment  = require('moment')
    , __      = require('underscore')
    , fibrous = require('fibrous')
    , Q       = require('q');

// Setup Winston Console
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, config.winston);

var bot = new Bot(config.twitter);
var T = bot.twit;

function randomTopic () {
    var arr = config.topics;
    var index = Math.floor(arr.length*Math.random());
    return arr[index];
}

// Follow Based on Other Existing Friends
setInterval(function() {
    bot.mingle(function(err, newFriend) {
        winston.info('Now following ' + newFriend.name + ',  @' +
            newFriend.screen_name);
    });
}, moment.duration(30, 'minutes'));

// Follow Based on Random Topic from Config List
setInterval(function() {
    var params = {
        q: randomTopic()
      , since: moment().format('YYYY-M-DD')
      , result_type: 'mixed'
      , lang: 'en'
    };

    bot.searchFollow(params, function(err, newFriend) {
        winston.info('Now following ' + newFriend.name + ',  @' +
            newFriend.screen_name);
    });
}, moment.duration(20, 'minutes'));

// Retweet a Popular Github Tweet

// Retweet a Random Topic I Like


function getMyRetweets() {
    var deferred = Q.defer();
    T.get('search/tweets', { q: 'nathangourley' },  function (err, data, response) {
        if (err) {
            deferred.reject(new Error(err));
        }
        var myTweetIds = [];
        __.each(data.statuses, function(tweet) {
            myTweetIds.push(tweet.retweeted_status.id_str);
        });
        deferred.resolve(myTweetIds);
    });
    return deferred.promise;
}

function getFollowerCount() {
    T.get('followers/ids', function(err, reply) {
        if (err) {
          return winston.error(err);
        }
        winston.info('Followers: ' + reply.ids.length.toString());
    });
}

function retweetByTopic(topic) {
    var topic = (topic === undefined) ? 'github.com/' : topic;
    var params = {
        q: topic
      , since: moment().format('YYYY-M-DD')
      , result_type: 'mixed'
      , lang: 'en'
    };

    getMyRetweets().then(function(data) {
        retweet(data, params);
    }, function(err) {
        winston.error(err);
    });
}

function retweetPopular () {
    retweetByTopic();
}

function retweet(exclusionList, params) {
    T.get('search/tweets', params, function(err, data, response) {
        var max = 0, popular;

        __.each(data.statuses, function(tweet) {
            if(exclusionList.indexOf(tweet.id_str) !== -1) {
                return;
            } 

            if (tweet.retweet_count > max) {
                max = tweet.retweet_count;
                popular = tweet;
            }
        });

        winston.info('Retweeting popular tweet: ' + popular.id_str);

        // trim_user - true in params
        T.post('statuses/retweet/:id', { id: popular.id_str, }, function (err, data, response) {
            console.log(data)
            console.log(err)
        });
    });
}

// setInterval(getFollowerCount, moment.duration(5, 'minutes'));
// setTimeout(retweetPopular, moment.duration(15, 'minutes'));
// setTimeout(retweetByTopic, moment.duration(30, 'minutes'), '#nodejs');
// getFollowerCount();
// setTimeout(retweetByTopic, 2000,'#nodejs')

// T.post('statuses/retweet/:id', { id: '343360866131001345' }, function (err, data, response) {
//   console.log(data)
// })
// retweetPopular();
// retweetByTopic('#nodejs')

// http://www.apcoder.com/2013/10/15/targeted-twitter-bots-next-20-minutes/
bot.printMyTweets(function(err, derp) {

});

// bot.deleteTweet(id, callback)


//   } else if(rand <= 0.55) { //  make a friend
//     bot.mingle(function(err, reply) {
//       if(err) return handleError(err);

//       var name = reply.screen_name;
//       console.log('\nMingle: followed @' + name);
//     });
//   } else {                  //  prune a friend
//     bot.prune(function(err, reply) {
//       if(err) return handleError(err);

//       var name = reply.screen_name
//       console.log('\nPrune: unfollowed @'+ name);
//     });
//   }