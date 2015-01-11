var Mongoose = require('mongoose');

var locationSchema = new Mongoose.Schema({
    userId: { type: Number, required: true },
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

var Location = Mongoose.model("Location", locationSchema);
exports.Location = Location;