var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var EventSchema   = new Schema({
    timeStamp: String,
    eventType: String,
    data: Object
});

module.exports = mongoose.model('EtornEvent', EventSchema);
