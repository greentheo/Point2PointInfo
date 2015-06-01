/**
 * LocationController
 *
 * @description :: Server-side logic for managing Locations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  saveLocationData: function(req, res) {
    var params = req.params.all();
    var stuff = 'hi';

    // make sure we have user id passed in
    res.ok('saved!');

    //locationService.saveLocationData()
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

