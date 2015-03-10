var config = require('../config');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.connect(config.dbUri);

/*
Notes:  Making use of suggestion in this article: http://blog.matoski.com/articles/jwt-express-node-mongoose/
*/

var UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    roles: [{ name: { type: String, required: true } }]
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

UserSchema.pre('save', function (next) {
    // encrypt the password before saving to db
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

var LocationSchema = new Schema({
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

var User = mongoose.model('User', UserSchema);
var Location = mongoose.model('Location', LocationSchema);

exports.User = User;
exports.Location = Location;
