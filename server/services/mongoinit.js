/* Handles things with mongo that should only be done once */
var config = require('../config');
var client = require('mongodb').MongoClient;

exports.prepDb = function(callback) {
    client.connect(config.dbUri, function(err, db) {
        if (err) { callback(err); return; }

        // make sure we have an active users collection
        db.createCollection('activeUsers', function(err) {
            if (err) { callback(err); return; }

            // make sure we have a TTL index
            db.activeUsers.ensureIndex({ 'loginTime': 1 }, { expireAfterSeconds: config.tokenExpirationSeconds });
        });
    });
};


