var   task     = require('./models/task')
    , follower = require('./models/follower')
    , friend   = require('./models/friend')
    , winston  = require('winston')
    , async    = require('async')
    , config   = require('./config')
    , Bot      = require('./bot');

var tastNames = [
    'cacheFollowers',
    'cacheFriends',
    'retweetRandom',
    'followLikeyToFollow',
    'favoriteRandom'
];
var intervals = {};
var taskFuncs = {};


var bot = new Bot(config.twitter);

taskFuncs.cacheFollowers = function () {
    winston.info('Caching Followers');
    follower.cacheIds();
    follower.cacheList();
};

taskFuncs.cacheFriends = function () {
    winston.info('Caching Friends');
    friend.cacheIds();
    friend.cacheList();
};

taskFuncs.retweetRandom = function () {
    bot.retweetRandom(function (err, data) {
        (err) ? winston.error(err) :
            winston.info('Retweet successful.');
    });
};

taskFuncs.followLikeyToFollow = function () {
    bot.mingleLikelyToFollow(function (err, user) {
        (err) ? winston.error(err) :
            winston.info('Following @' + user.screen_name);
    });
};

taskFuncs.favoriteRandom = function () {
    bot.favoriteRandom(function (err, data) {
        (err) ? winston.error(err) :
            winston.info('Favorite successful.');
    });
};

function init () {
    async.map(tastNames, _initTaskByName, function (err, tasks) {
        (err) ? winston.error(err) :
            async.map(tasks, _setInterval, _initResult);
    });
}

function _initTaskByName (name, callback) {
    task.findByName(name, function (err, result) {

        if (result.length !== 0) {
            return callback(err, result[0]);
        }

        task.createByName(name, function (err, result) {
            callback(err, result[0]);
        });
    });
}

function _setInterval (task, callback) {
    var func = taskFuncs[task.name];

    if (func === undefined) {
        return callback(new Error('No task function set for ' + task.name));
    }

    if (task.run_on_startup) {
        func();
    }

    if (intervals[task.name] !== undefined) {
        clearInterval(intervals[task.name]);
        delete intervals[task.name];
    }
    
    intervals[task.name] = setInterval(func, task.interval);
    callback(null, 'Interval set for ' + task.name);
}

function _updateInterval (task, callback) {
    var func = taskFuncs[task.name];

    if (func === undefined) {
        return callback(new Error('No task function set for ' + task.name));
    }

    if (intervals[task.name] !== undefined) {
        clearInterval(intervals[task.name]);
        delete intervals[task.name];
    }
    
    intervals[task.name] = setInterval(func, task.interval);
    callback(null, 'Interval set for ' + task.name);
}

function _initResult (err, result) {
    if (err) {
        winston.error(err.message);
    }
    winston.debug(result);
}

init();

module.exports.updateInterval = _updateInterval;