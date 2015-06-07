var   mongoose = require('mongoose')
    , moment   = require('moment')
    , winston  = require('winston');
var config = require('../config.js');

var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var automation = require('./../automation.js');

var taskSchema = mongoose.Schema({
    name: { type: String },
    interval: { type: Number },
    last_run_time: { type: Date },
    run_on_startup: { type: Boolean, default: false},
});

taskSchema.statics.list = function (callback) {
    return this.find({}, callback);
};

taskSchema.statics.findByName = function (name, callback) {
    return this.find({'name': name}, callback);
};

taskSchema.statics.createByName = function (name, callback) {
    var tempTask = new this();
    tempTask.name = name;
    tempTask.interval = moment.duration(15, 'minute').asMilliseconds();
    tempTask.run_on_startup = false;
    tempTask.save(callback);
};

taskSchema.statics.update = function (data, callback) {
    var query, updateStatement, options;
    automation.updateInterval(data, function(err, result) {
        (err) ? winston.error(err) : winston.info(result);
    });
    query = {
        '_id': data._id
    };
    updateStatement = {
        'interval': data.interval,
        'run_on_startup': data.run_on_startup,
    };
    options = {};
    return this.findOneAndUpdate(query, updateStatement, options, callback);
};

module.exports = mongoose.model('Task', taskSchema, config.twitter.username + 'tasks');