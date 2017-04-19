var l = require('debug')('etorn:routes:time');

var funcs = require('./time-funcs.js');

var getAverageTime = funcs.getAverageTime;

module.exports = function(router) {

  router.route('/getAverageTime')
    .get(function(req, res) {
        l('Generateing average time');
        getAverageTime(function(err, result) {
        if (err)
          return res.json({message: err});

        res.json(result);
      });
    });
}
