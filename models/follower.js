var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

module.exports = mongoose.model('Follower', followerSchema, 'followers');