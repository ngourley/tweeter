var   task     = require('./models/task')
    , follower = require('./models/follower')
    , winston  = require('winston')
    , async    = require('async');

var tastNames = ['cacheFollowers'];

var taskFuncs = {};

taskFuncs.cacheFollowers = function () {
    winston.info('Caching Followers');
    follower.cacheIds();
    follower.cacheList();
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
    
    setInterval(func ,task.interval);

    callback(null, task.name + ' complete.');
}

function _initResult (err, result) {
    if (err) {
        winston.error(err.message);
    }
    winston.debug(result);
}

init();