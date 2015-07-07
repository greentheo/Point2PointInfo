/**
 * LocationController
 *
 * @description :: Server-side logic for managing Locations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  save: function(req, res) {
    var params = req.params.all();
    var userEmail = params.userEmail;
    var locationData = params.locationData;

    if (userEmail == null || locationData == null)
      return res.serverError({ message: 'User email and location data are required.'});

    locationService.saveUserLocationData(userEmail, locationData, function(err) {
      if (err)
        return res.serverError({ message: err.message });

      res.json({ success: true });
    });
  },

  query: function(req, res) {
    var params = req.params.all();
    var userEmail = params.userEmail;
    var start = params.start;
    var end = params.end;
    var latMin = params.latMin;
    var latMax = params.latMax;
    var longMin = params.longMin;
    var longMax = params.longMax;
    var userId = params.userId;
    var sessionId = params.sessionId;
    var count = params.count;
    var skip = params.skip;

    locationService.getUserLocationData(userEmail, start, end, latMin, latMax, longMin, longMax, userId, sessionId, count, skip,
      function(err, locationData) {
        if (err) {
          return res.serverError({ message: err.message});
        }

        res.json(locationData);
      });
  }
  //,
  //
  //session: function(req, res) {
  //  var params = req.params.all();
  //  var sessionId = params.sessionId;
  //
  //  locationService.getSessionLocationData(sessionId, function(err, locationData) {
  //    if (err)
  //      return res.serverError({ message: err.message });
  //
  //    res.json(locationData);
  //  });
  //}
};

