define(['durandal/app', 'js/appdata', 'js/deviceevents'], function(app, appData, deviceEvents) {

    // Handles geolocation events and data capture.

    // Events: location.capture, location.error, location.start, location.end, location.unsupported

    return {
        isDevice: deviceEvents.isDevice(),
        handle: null,
        start: function () {
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
                    var feet = 3.28084;
                    position.timestamp = new Date(position.timestamp);
                    if (position.coords.altitude &&!isNaN(position.coords.altitude)) position.coords.altitude = position.coords.altitude * feet;
                    if (position.coords.speed &&!isNaN(position.coords.speed)) position.coords.speed = position.coords.speed * feet;

                    // add the info to appdata
                    appData.locationData.push(position);

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

                    appData.locationErrors.push(error);

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
