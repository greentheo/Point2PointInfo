var jwt = require('jsonwebtoken'),
    config = require('../config');

var expirationMinutes = config.tokenExpirationSeconds / 60;

exports.createUserToken = function(user) {
    var data = {
        username: user.username,
        roles: user.roles,
        token: jwt.sign({ _id: user._id }, config.secretPhrase, { expiresInMinutes: expirationMinutes })
    };

    var decoded = jwt.decode(data.token);

    data.token_exp = decoded.exp;
    data.token_iat = decoded.iat;

    return data;
};
