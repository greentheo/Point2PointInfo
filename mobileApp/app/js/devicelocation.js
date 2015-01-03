define(['durandal/app', 'js/appdata', 'js/deviceevents'], function(app, appData, deviceEvents) {

    // Encapsulates capturing geolocation events.

    // Events:
    // - location.capture (data)
    // - location.error (data)
    // - location.start
    // - location.end
    // - location.unsupported

    var FEET = 3.28084;

    return {
        dummyData: {
            timestamp: null,
            coords: {
                latitude: null,
                longitude: null,
                altitude: null,
                accuracy: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null
            }
        },
        isDevice: deviceEvents.isDevice(),
        handle: null,
        start: function (useMeters) {
            var that = this;

            if (!navigator.geolocation) {
                app.trigger('location.unsupported');
                return;
            }

            that.handle = navigator.geolocation.watchPosition(
                // success!
                function(position) {

                    /* position is a Position object:
                    {
                        timestamp: Date,
                        coords: {    (Coordinates object)
                            latitude: Number,
                            longitude: Number,
                             altitude: Number,
                             accuracy: Number, (of latitude and longitude in meters) - Android not supported
                             altitudeAccuracy: Number,
                             heading: Number (degrees clockwise relative to true north)
                             speed: Number (meters per second)
                        }
                     }
                     */

                    // adjust collected info
                    position.timestamp = new Date(position.timestamp);

                    // TODO: conversion to feet doesn't work because the Coordinate object property value can't be changed
                    if (!useMeters) {
                        if (position.coords.altitude) position.coords.altitude = position.coords.altitude * FEET;
                        if (position.coords.speed) position.coords.speed = position.coords.speed * FEET;
                    }

                    app.trigger('location.capture', position);
                },

                // error!
                function(error) {
                    /* error is a PositionError object:
                    {
                        code: Number, (PositionError.PERMISSION_DENIED, PositionError.POSITION_UNAVAILABLE, PositionError.TIMEOUT)
                        message: String
                    }
                    */

                    app.trigger('location.error', error);
                },

                // options
                {
                    enableHighAccuracy: true
                });

            if (that.handle) app.trigger('location.start');
        },
        end: function () {
            var that = this;

            if (that.handle !== null) {
                navigator.geolocation.clearWatch(that.handle);
                that.handle = null;
            }

            app.trigger('location.end');
        }
    };
});
