var _ = require('lodash');
var config = require('../config');
var moment = require('moment');
var EtornEvent = require('../models/Event');
var timeFormat = "YYYY-MM-DD:HH:mm:ss:ZZ";

//Retorna els timeStamp formatejats per moment de cada event
var computeTime = function(etornEvent) {
  etornEvent = etornEvent.toObject();
  etornEvent.timeStamp = moment(etornEvent.timeStamp).format(timeFormat);
  return etornEvent.timeStamp;
}

module.exports.getAverageTime = function getAverageTime(reqStoreId, cb) {

  var dateStart = moment().subtract(15, 'minutes').toDate();
  var dateEnd = moment().toDate();

  EtornEvent.find({
    data: {storeId: reqStoreId},
    timeStamp: { $lt: dateEnd, $gte: dateStart}
  })
  .sort({timeStamp: 'asc'})
  .exec(function(err, etornEvents) {
    console.log("events", etornEvents);
    if (err)
      return cb(err);

    console.log("etornEventsLength", etornEvents.length);

    if (etornEvents.length == 0) {
      console.log("No hi ha cap event en els pasats 15 minuts, retornant -1 com a aproxTime");
      return cb(null, -1);
    }

    var storeQueue = etornEvents.length;
    var timestamps = etornEvents.map(computeTime);
    var aproxTime = calcAvgMilis(timestamps) / 60000; // minuts amb decimals
    if (!aproxTime || storeQueue < 3)
          aproxTime = 0; // 0 per el primer torn (quan no hi ha cap event al servidor) O quan hi han menys de 5 persones a la cua (El temps estimat seria erroni)
    cb(null, aproxTime);
  });
};

function calcAvgMilis(timestamps) {

  var arr = timestamps.map(function (i) {return moment(i, timeFormat)}); //arr conte la array de timeStamps a objectes moment

  //diff es la array que conte les diferencies en milisegons
  var diff = _.map(
    _.dropRight(
      //dropRight elimina l'ultim element de la array que contenia l'undefined ( es borra perque no es pot fer la diferencia amb un undefined )

      _.zip(arr, _.drop(arr))
      //zip fa parellas dels elements de dos arrays (element 0 amb element 0 de cada array) (una de les arrays (la segona)conte un undefined com a ultim element)
      // drop elimina el primer element de arr
    ),

    //funcio que per cada array (inner)(de les parelles) retorna la differencia entre el segon i el primer
    function (a) {
      return a[1].diff(a[0]);
    }
  );

  //suma de les diferencies
  var sum = _.sum(diff);

  //mitjana de les diferencies
  var avg = sum / diff.length;

  return avg;
}
