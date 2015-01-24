/*
Handles tracking the users actually logged in.
Straight mongo, here.  Didn't use Mongoose in this case.  Thought it might be overkill here.
*/
var config = require('../config');
var client = require('mongodb').MongoClient;

exports.loginUser = function(username, token, callback) {
    client.connect(config.dbUri, function(err, db) {
        if (err) { callback(err); return; }

        db.activeUsers.insert({
            username: username,
            token: token,
            loginTime: new Date()
        },
        function(err, records) {
            if (err) { callback(err); return; }

            // notify completion - pass back the newly inserted record just in case the caller's
            // interested
            callback(records);
        })
    });
};

exports.logoutUser = function(username, callback) {
    client.connect(config.dbUri, function(err, db) {
        if (err) { callback(err); return; }

        db.activeUsers.remove({ username: username }, function(err, result) {
            callback(err, result);
        })
    });
};
