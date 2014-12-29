define(['js/appdata', 'plugins/observable'], function(appData, observables) {
    var vm = {
        userName: '',
        interval: 3000,
        buttonCaption: 'Start',
        collectionHandle: null,
        collectionStart: null,
        collectionEnd: null,
        accelerometerHandle: null,
        locationEntryCount: 0,
        locationErrorCount: 0,
        accelerometerEntryCount: 0,
        accelerometerErrorCount: 0,
        collectionInProgress: false,
        toggleCollection: function() {
            var toggle = { Start: 'End', End: 'Start' };
            var command = this.buttonCaption;
            this.buttonCaption = toggle[this.buttonCaption];

            if (command === 'Start') {
                this.startCollection.apply(this);
            } else {
                this.endCollection.apply(this);
            }
        },
        startCollection: function() {
            var that = this;
            that.collectionInProgress = true;

            // geolocation
            that.collectionHandle = navigator.geolocation.watchPosition(
                function(position) {    // success!

                    // add the info to appdata
                    appData.locationData.push(position);
                    that.locationEntryCount = appData.locationData.length;
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
                },
                function(error) {       // error!
                    appData.locationErrors.push(error);
                    that.locationErrorCount = appData.locationErrors.length;
                    /* error is a PositionError object:
                    {
                        code: Number, (PositionError.PERMISSION_DENIED, PositionError.POSITION_UNAVAILABLE, PositionError.TIMEOUT)
                        message: String
                    }
                     */
                }, {                    // options
                    maximumAge: that.interval,
                    enableHighAccuracy: true
                });

            // accelerometer
            that.accelerometerHandle = navigator.accelerometer.watchAcceleration(
                function(acceleration) {    // success!
                    // add the info to appdata
                    appData.accelerometerData.push(acceleration);
                    that.accelerometerEntryCount = appData.accelerometerData.length;
                    /* acceleration is an Acceleration object:
                    {
                        timestamp: Date,
                        x: Number,
                        y: Number,
                        z: Number
                    }
                    */
                },
                function() {       // error!
                    appData.accelerometerErrors.push({ timestamp: new Date() });
                    that.accelerometerErrorCount = appData.accelerometerErrors.length;
                }, {                    // options
                    frequency: that.interval
                });
        },
        endCollection: function() {
            var that = this;
            that.collectionInProgress = false;
            if (that.collectionHandle == null) return;

            navigator.geolocation.clearWatch(that.collectionHandle);
            that.collectionHandle = null;

            navigator.accelerometer.clearWatch(that.accelerometerHandle);
            that.accelerometerHandle = null;
        }
    };

    // note: one disadvantage of using the observable plugin is that the syntax for creating
    //      what would normally be a ko computed function is a little ... um ... different
    observables.defineProperty(vm, 'canCollect', function() {
        return this.userName != '' && this.interval > 0;
    });

    return vm;
});
