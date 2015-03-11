/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

// note: a lot of this was setup following a sails 101 tutorial here:
// https://github.com/sails101/basic-login

module.exports = {

  login: function (req, res) {

    User.login({
      username: inputs.username,
      password: inputs.password
    }, function (err, user) {
      if (err) return res.negotiate(err);
      if (!user) {
        // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
        // send a 200 response letting the user agent know the login was successful.
        if (req.wantsJSON) {
          return res.badRequest('Invalid username/password combination.');
        }
        // Otherwise if this is an HTML-wanting browser, redirect to /login.
        return res.redirect('/login');
      }

      // "Remember" the user in the session
      // Subsequent requests from this user agent will have `req.session.me` set.
      req.session.me = user.id;

      // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
      // send a 200 response letting the user agent know the login was successful.
      if (req.wantsJSON) {
        return res.ok();
      }

      // Otherwise if this is an HTML-wanting browser, redirect to /.
      return res.redirect('/');
    });
  },

  logout: function (req, res) {

    // "Forget" the user from the session.
    // Subsequent requests from this user agent will NOT have `req.session.me`.
    req.session.me = null;

    // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
    // send a simple response letting the user agent know they were logged out
    // successfully.
    if (req.wantsJSON) {
      return res.ok('Logged out successfully!');
    }

    // Otherwise if this is an HTML-wanting browser, do a redirect.
    return res.redirect('/');
  },

  signup: function (req, res) {

    // Attempt to signup a user using the provided parameters
    User.signup({
      username: req.param('username'),
      email: req.param('email'),
      password: req.param('password')
    }, function (err, user) {

      // res.negotiate() will determine if this is a validation error
      // or some kind of unexpected server error, then call `res.badRequest()`
      // or `res.serverError()` accordingly.
      if (err) return res.negotiate(err);

      // Go ahead and log this user in as well.
      // We do this by "remembering" the user in the session.
      // Subsequent requests from this user agent will have `req.session.me` set.
      req.session.me = user.id;

      // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
      // send a 200 response letting the user agent know the signup was successful.
      if (req.wantsJSON) {
        return res.ok('Signup successful!');
      }

      // Otherwise if this is an HTML-wanting browser, redirect to /welcome.
      return res.redirect('/welcome');
    });
  }
};