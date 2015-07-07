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

  getUserLocationData: function(userEmail, start, end, latMin, latMax, longMin, longMax, userId, sessionId, count, skip, cb) {

    if (userEmail && userId) {
      return cb(new Error('Can either provide userEmail or userId, but not both.'))
    }

    // build our query object
    var query = {};

    // dates

    if (start)
      query.timestamp = { greaterThanOrEqual : new Date(start) };

    if (end) {
      query.timestamp = query.timestamp || {};
      query.timestamp.lessThanOrEqual = new Date(end);
    }

    // latitude

    if (latMin)
      query.latitude = { greaterThanOrEqual: latMin };

    if (latMax) {
      query.latitude = query.latitude || {};
      query.latitude.lessThanOrEqual = latMax;
    }

    // longitude

    if (longMin)
      query.longitude = { greaterThanOrEqual: longMin };

    if (longMax) {
      query.longitude = query.longitude || {};
      query.longitude.lessThanOrEqual = longMax;
    }

    // user / session

    if (userId)
      query.user = userId;

    if (sessionId)
      query.sessionId = sessionId;

    // paging

    if (count)
      query.limit = count;

    if (skip)
      query.skip = skip;

    // if user has provided an email, we need to look it up via the Auth.user object to
    // get the user id
    if (userEmail) {
      Auth.findByEmail(userEmail).exec(function(err, auths) {
        if (err)
          return cb(err);

        if (auths.length != 1)
          return cb(null, []);

        // not populating user object, so it will just be the id.  perfect!
        query.user = auths[0].user;

        getLocations(query);
      });
    } else {
      getLocations(query);
    }

    function getLocations(queryObject) {
      Location
        .find(queryObject)
        .exec(function (err, locations) {
          if (err)
            return cb(err);

          cb(null, locations);
        });
    }
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
