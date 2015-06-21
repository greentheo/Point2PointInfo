/**
 * tokenAdministratorOrOwnData
 *
 * @module      :: Policy
 * @description :: Assumes that your request has an jwt.  Requires you to be asking for your own data, or be an administrator
 *
 * @docs        :: http://waterlock.ninja/documentation
 */
module.exports = function(req, res, next) {
  waterlock.validator.validateTokenRequest(req, function(err, user){
    // initial token validation fails
    if (err) {
      return res.forbidden(err);
    }

    // if administrator, we're okay
    if (user.administrator) {
      return next();
    }

    // check for email in the request parameters and see if it matches the email of
    // the user's token
    var userEmail = req.params['userEmail'];

    // no email on the request = not allowed
    if (userEmail === null || userEmail === undefined) {
      return res.forbidden();
    }

    // emails don't match
    if (userEmail != user.auth.userEmail) {
      return res.forbidden();
    }

    // valid request
    next();
  });
};

