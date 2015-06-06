/**
 * LocationController
 *
 * @description :: Server-side logic for managing Locations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  saveLocationData: function(req, res) {
    var params = req.params.all();
    var userEmail = params.userEmail;
    var locationData = params.locationData;

    if (userEmail == null || locationData == null) {
      return res.serverError({ message: 'User email and location data are required.'});
    }

    locationService.saveUserLocationData(userEmail, locationData, function(err) {
      if (err) {
        return res.serverError(err);
      }

      res.json({ success: true });
    });
  },
  getLocationData: function(req, res) {
    // TODO: adminstrator only
  }
  //openData: function(req, res) {
  //    res.ok("You have hit open data.");
  //},
  //secretData: function(req, res) {
  //    res.ok("You have hit SECRET data.  SHHHH....");
  //},
  //secretTokenData: function(req, res) {
  //    res.json({ message: "You have used a TOKEN to hit SECRET data. Whoa..."});
  //}
};

