/**
 * LocationController
 *
 * @description :: Server-side logic for managing Locations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  openData: function(req, res) {
      res.ok("You have hit open data.");
  },
  secretData: function(req, res) {
      res.ok("You have hit SECRET data.  SHHHH....");
  },
  secretTokenData: function(req, res) {
      res.ok("You have used a TOKEN to hit SECRET data. Whoa...");
  }
};

