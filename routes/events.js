var l = require('debug')('etorn:routes:events');
module.exports = function(router) {
  var eTornEvent = require('../models/Event');

  router.route('/events')
  .post(function(req, res) {
    l('New Event registration');
    var event = new eTornEvent();

    if (req.body.eventype)
      event.eventType = req.body.eventype;
    else
      return res.json({message: 'No event type specified'})

        event.save(function(err, newEvent) {
          if (err) {
            l('Event save failed: %s', err);
            return res.json({message: err});
          }
          return res.json(newEvent);
        });
      })
    .get(function(req, res) {
      l('GET /events (get list of events)')
      eTornEvent.find(function(err, event) {
        if (err) {
          l('Event find failed: %s', err);
          return res.send(err);
        }

        res.json(event);
      });
    });

  router.route('/events/:event_id')
    .get(function(req, res) {
      l('GET /event/%s', req.params.event_id);
      eTornEvent.findById(req.params.event_id, function(err, event) {
        if (err) {
          l('Event not found (%s): %s', req.params.event_id, err);
          return res.send(err);
        }

        res.json(event);
      });
    })
    .delete(function(req, res) {
      l('DELETE /event/%s', req.params.event_id)
      eTornEvent.remove({
        _id: req.params.event_id
      }, function(err, turn) {
        if (err) {
          l('Event removal failed (%s): %s', req.params.event_id, err)
          return res.send(err);
        }

        l('Event successfully removed (%s)', req.params.event_id);
        res.json({ message: 'Successfully deleted' });
      });
    });
}