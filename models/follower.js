var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var followerSchema = mongoose.Schema({
    id:  { type: Number, default: -1},
    id_updt: { type: Date, default: Date.now },
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

followerSchema.statics.removeStale = function (ids, callback) {
    return this.remove({"id": {"$nin": ids}}, callback);
};

module.exports = mongoose.model('Follower', followerSchema, 'followers');