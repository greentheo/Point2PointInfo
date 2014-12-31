define(['durandal/app', 'js/appdata', 'js/deviceevents'], function(app, appData, deviceEvents) {

    // Handles acceleration events and data capture.  Since acceleration is captured differently on a device vs.
    //  mobile browser, this encapsulates either approach.

    // Events:  acceleration.capture, acceleration.start, acceleration.end, acceleration.unsupported

    return {
        isDevice: deviceEvents.isDevice(),
        start: function() {
            var that = this;

            if (that.isDevice) that._deviceStart();
            else that._mobileWebStart();

            if (that.handle) app.trigger('acceleration.start');
        },
        end: function() {
            var that = this;
            if (that.handle !== null) {
                if (that.isDevice) that._deviceEnd();
                else that._mobileWebEnd();
            }

            app.trigger('acceleration.end');
        },
        handle: null,
        _deviceStart: function() {
            var that = this;
            that.handle = navigator.accelerometer.watchAcceleration(

                // success!
                function(acceleration) {
                    // add the info to appdata
                    appData.accelerometerData.push(acceleration);

                    /* acceleration is an Acceleration object:
                     {
                        timestamp: Date,
                        x: Number,
                        y: Number,
                        z: Number
                     }
                     */

                    app.trigger('acceleration.capture');
                },

                // error!
                function() {
                    appData.accelerometerErrors.push({ timestamp: new Date() });
                });
        },
        _deviceEnd: function() {
            var that = this;
            navigator.geolocation.clearWatch(that.handle);
            that.handle = null;
        },
        _mobileWebStart: function() {
            var that = this;

            if (!window.DeviceMotionEvent) {
                that.handle = null;

                app.trigger('acceleration.unsupported');
                return;
            }

            window.addEventListener('devicemotion', that._mobileWebEvent, false);

            that.handle = 'mobilewebaccelerometer';
        },
        _mobileWebEnd: function() {
            var that = this;
            window.removeEventListener('devicemotion', that._mobileWebEvent, false);

            that.handle = null;
        },
        _mobileWebEvent: function(accelEvent) {

            var data = {
                x: accelEvent.acceleration.x,
                y: accelEvent.acceleration.y,
                z: accelEvent.acceleration.z,
                timestamp: new Date()
            }

            appData.accelerometerData.push(data);

            app.trigger('acceleration.capture', data);
        }
    }
});
