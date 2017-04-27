var l = require('debug')('etorn:routes:time');

var funcs = require('./time-funcs.js');

var getAverageTime = funcs.getAverageTime;

module.exports = function(router, mqttClient) {

  mqttClient.subscribe('etorn/store/+/advance');

  mqttClient.on('message', function(topic, message) {
    var match = /etorn\/store\/(\w{24})\/(\w+)/.exec(topic);
    var id = match[1];
    var chan = match[2];

    if (!match)
      return;

    if (chan === 'advance') {
      getAverageTime(id, function(err, result) {
        if (err)
          return;

        mqttClient.publish('etorn/store/' + id + '/aproxTime', '' + result);

      });
    }
  });

  router.route('/averageTime/:store_id')
    .get(function(req, res) {
        l('Generateing average time');
        getAverageTime(req.params.store_id, function(err, result) {
        if (err)
          return res.json({message: err});

        res.json(result);
      });
    });
}
