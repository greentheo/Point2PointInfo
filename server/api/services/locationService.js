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
        user.locations.push(locationData[i]);
      }

      user.save(cb);

      // find the user that belongs to the auth
      //User.findOne(auths[0].user.id).then(function(user) {
      //  // add the new location data to the user and save
      //  user.locations.push(locationData);
      //  user.save(cb);
      //});
    });
  }

};
