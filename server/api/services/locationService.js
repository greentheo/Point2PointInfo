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

      for (var i = 0; i < locationData.length; i++) {
        var newLocation = locationData[i];

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

  getUserLocationData: function(userEmail, cb) {

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

      User.findOne(auths[0].user).populate('locations').exec(function (err, user) {
        if (err) {
          return cb(err);
        }

        cb(null, user.locations);
      });

      //Locations.find()
      //  .where({ user: auths[0].user }).exec(function(err, locationData) {
      //    var stuff = 'hi';
      //  });
    });
  }
};
