var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
// var twitterClient = require('../client');
// var __ = require('underscore');
// var winston = require('winston');
// var async = require('async');

var taskSchema = mongoose.Schema({
    name: { type: String },
    interval: { type: Number },
    last_run_time: { type: Date },
    run_on_startup: { type: Boolean, default: false},
});

taskSchema.methods.updateConfig = function () {
    console.log(this);
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

/*
    cache friends, run on startup, every 15 minutes, enabled
    retweet popular tweet, run on startup, every 1 hr,
    friend person, 



*/

// var followerSchema = mongoose.Schema({
//     id:  { type: Number, default: -1},
//     id_updt: { type: Date, default: Date.now },
//     name: { type: String },
//     screen_name: { type: String },
//     location: { type: String },
//     description: { type: String },
//     followers_count: { type: Number },
//     friends_count: { type: Number },
//     profile_image_url: { type: String },
//     profile_image_url_https: { type: String },
// });

// followerSchema.statics.upsertId = function (id, callback) {
//     return this.update(
//         {"id": id},
//         {"$set": {
//             "id": id,
//             "id_updt": new Date()
//         }},
//         {upsert: true},
//         callback);
// };

module.exports = mongoose.model('Task', taskSchema, 'tasks');