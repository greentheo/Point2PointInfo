var config = require('../config');
var Mongoose = require('mongoose');
var db = Mongoose.connect(config.dbUri);

var User = Mongoose.model('User', {
    login: { type: String, required: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    roles: [{ name: { type: String, required: true } }]
});

var Location = Mongoose.model('Location', {
    user: { type: String, required: true, ref: User },
    location: {
        timestamp: { type: Date, required: true },
        coords: {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true },
            altitude: { type: Number },                     // in meters
            accuracy: { type: Number },                     // (of latitude and longitude in meters) - Android not supported
            altitudeAccuracy: { type: Number },
            heading: { type: Number  },                     // (degrees clockwise relative to true north)
            speed: { type: Number }                         // (meters per second)
        },
        accelerometer: [{
            x: { type: Number, required: true },
            y: { type: Number, required: true },
            z: { type: Number, required: true }
        }]
    }
});

exports.User = User;
exports.Location = Location;
