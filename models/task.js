var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var taskSchema = mongoose.Schema({
    name: { type: String },
    interval: { type: Number },
    last_run_time: { type: Date },
    run_on_startup: { type: Boolean, default: false},
});

taskSchema.methods.updateConfig = function () {
    console.log(this);
};

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

module.exports = mongoose.model('Task', taskSchema, 'tasks');