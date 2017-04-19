
var config = require('../config');
var moment = require('moment');
var EtornEvent = require('../models/Event');
var timeFormat = "YYYY-MM-DD:HH:mm:ss:ZZ";

var computeTime = function(etornEvent) {
  etornEvent = etornEvent.toObject();
  etornEvent.timeStamp = moment(etornEvent.timeStamp, timeFormat);
  return etornEvent;
}

module.exports.getAverageTime = function getAverageTime(cb) {
   EtornEvent.find(function(err, etornEvents) {
    if (err)
      return cb(err);
    
    //calcular temps
    cb(null, etornEvents.map(computeTime));
  });
};