var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var twitterClient = require('../client');
var __ = require('underscore');
var winston = require('winston');
var async = require('async');

var followerSchema = mongoose.Schema({
    id:  { type: Number, default: -1},
    id_updt: { type: Date, default: Date.now },
    name: { type: String },
    screen_name: { type: String },
    location: { type: String },
    description: { type: String },
    followers_count: { type: Number },
    friends_count: { type: Number },
    profile_image_url: { type: String },
    profile_image_url_https: { type: String },
});

followerSchema.statics.upsertId = function (id, callback) {
    return this.update(
        {"id": id},
        {"$set": {
            "id": id,
            "id_updt": new Date()
        }},
        {upsert: true},
        callback);
};

followerSchema.statics.upsertUser = function (user, callback) {
    return this.update(
        {"id": user.id},
        {"$set": user},
        {upsert: true},
        callback);
};

followerSchema.statics.removeStale = function (ids, callback) {
    return this.remove({"id": {"$nin": ids}}, callback);
};

followerSchema.statics.list = function (callback) {
    return this.find({}, callback);
};

followerSchema.statics.queryIds = function (callback) {
    return twitterClient.get('followers/ids', callback);
};

followerSchema.statics.queryList = function (cursor, callback) {
    var self = this;
    cursor = (cursor === undefined) ? -1 : cursor;
    return twitterClient.get('followers/list', {'cursor': cursor}, callback);
};

followerSchema.statics.cacheIds = function () {
    var self = this;
    self.queryIds(function (err, response) {

        if (err) {
            return winston.error(err);
        }

        if (response.next_cursor !== 0) {
            console.log(response.next_cursor)
            winston.debug("Need to pull more users, "
                + "would be nice to have this problem");
        }

        __.each(response.ids, function (id) {
            self.upsertId(id, function (err, data) {
                (err) ? winston.error(err) : winston.debug(data);
            });
        });

        self.removeStale(response.ids, function (err,data) {
            (err) ? winston.error(err) : winston.debug(data);
        });
    });
};

followerSchema.statics.cacheList = function () {
    var self = this;
    var next_cursor = undefined;

    async.doWhilst(function (callback) {
        self.queryList(next_cursor, function (err, data) {
            if (err) {
                return callback(err);
            }
            __.each(data.users, function (user) {
                self.upsertUser(user, function (err, data) {
                    if (err) {
                        winston.error(err);
                    }
                })
            });
            next_cursor = data.next_cursor;
            callback();
        });
    }, function test () {
        return (next_cursor !== 0);
    }, function cb (err) {
        if (err) {
            winston.error(err);
        }
    });
};

module.exports = mongoose.model('Follower', followerSchema, 'followers');