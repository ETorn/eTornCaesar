var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var EventSchema   = new Schema({
    timeStamp: {type: Date, default: Date.now},
    eventType: String,
    data: Object
});

module.exports = mongoose.model('eTornEvent', EventSchema);
