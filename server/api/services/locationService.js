var uuid = require('node-uuid');

module.exports = {

  saveUserLocationData: function(userEmail, locationData, cb) {

    Auth.findByEmail(userEmail).populate('user').exec(function(err, auths) {
      if (err) {
        return cb(err);
      }

      if (auths.length != 1) {
        return cb(new Error('Could not find user with that email'));
      }

      var user = auths[0].user;

      // assign the same session id for all location data
      var session = uuid.v4();

      for (var i = 0; i < locationData.length; i++) {
        var newLocation = locationData[i];

        newLocation.sessionId = session;

        // add the coords object props to the location object
        if (newLocation.coords !== undefined) {
          newLocation.latitude = newLocation.coords.latitude;
          newLocation.longitude = newLocation.coords.longitude;
          newLocation.altitude = newLocation.coords.altitude;
          newLocation.accuracy = newLocation.coords.accuracy;
          newLocation.altitudeAccuracy = newLocation.coords.altitudeAccuracy;
          newLocation.heading = newLocation.coords.heading;
          newLocation.speed = newLocation.coords.speed;

          if (newLocation.captureTimestamp) newLocation.timestamp = newLocation.captureTimestamp;

          delete newLocation.coords;

          // translate all timestamp fields from date strings to dates
          dataUtils.iterateDataStructure(newLocation, 'timestamp', function(dateString) { return new Date(dateString); });
        }

        user.locations.add(newLocation);
      }

      user.save(cb);
    });
  },

  getUserLocationData: function(userEmail, start, end, count, skip, cb) {

    // note: if "populate" is not called on auth's user association, then auth.user will simply
    // be the user's id, which is all we need here.
    Auth.findByEmail(userEmail).exec(function(err, auths) {
      if (err) {
        return cb(err);
      }

      // TODO: err or just empty array?
      if (auths.length != 1) {
        return cb(new Error('Could not find user with that email'));
      }

      // build our query object
      var locationQuery = undefined;
      if (start || end || count || skip) {
        locationQuery = {};

        if (start)
          locationQuery.timestamp = { greaterThanOrEqual : new Date(start) };

        if (end) {
          locationQuery.timestamp = locationQuery.timestamp || {};
          locationQuery.timestamp.lessThanOrEqual = new Date(end);
        }

        if (count)
          locationQuery.limit = count;

        if (skip)
          locationQuery.skip = skip;
      }

      User
        .findOne(auths[0].user)
        .populate('locations', locationQuery)
        .exec(function (err, user) {
          if (err)
            return cb(err);

          cb(null, user.locations);
        });
      });
  },

  getSessionLocationData: function(sessionId, cb) {
    Location
      .findBySessionId(sessionId)
      .populate('user')
      .exec(function(err, locations) {
        if (err)
          return cb(err);

        cb(null, locations);
      })
  }
};
