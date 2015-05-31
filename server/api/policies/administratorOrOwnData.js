/**
 * administratorOrOwnData
 *
 * @module      :: Policy
 * @description :: Assumes that your request has an jwt.  Requires you to be asking for your own data, or be an administrator;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */
module.exports = function(req, res, next) {
  waterlock.validator.validateTokenRequest(req, function(err, user){
    if(err){
      return res.forbidden(err);
    }

    // TODO: fill this in - either administrator or looking for own data

    // valid request
    next();
  });
};

