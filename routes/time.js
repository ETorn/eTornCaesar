var l = require('debug')('etorn:routes:time');

var funcs = require('./time-funcs.js');

var getAverageTime = funcs.getAverageTime;

module.exports = function(router) {

  router.route('/averageTime/:store_id')
    .get(function(req, res) {
        l('Generateing average time');
        getAverageTime(req.params.store_id, function(err, result) {
        if (err)
          return res.json({message: err});
        console.log("aproxTime: ", result);
        res.json(result);
      });
    });
}
