define([
        'durandal/app',
        'js/appdata',
        'js/deviceacceleration',
        'js/devicelocation',
        'plugins/observable'
    ],
function(app, appData, deviceAcceleration, deviceLocation, observables) {
    var vm = {
        userName: '',
        buttonCaption: 'Start',
        collectionStart: null,
        collectionEnd: null,
        lastAccelerometer: deviceAcceleration.dummyData,
        accelerometerData: [],
        accelerometerErrors: [],
        lastLocation: deviceLocation.dummyData,
        locationData: [],
        locationErrors: [],
        locationUnsupported: false,
        accelerationUnsupported: false,
        collectionInProgress: false,
        toggleCollection: function() {

            var toggle = { Start: 'End', End: 'Start' };
            var command = this.buttonCaption;
            this.buttonCaption = toggle[this.buttonCaption];

            this.collectionInProgress = command === 'Start';

        },
        startWatching: function() {
            var that = this;

            // geolocation

            deviceLocation.start();

            app.on('location.capture').then(function(data) {
                that.lastLocation = data;
                that.lastLocation.accelerometer = [];

                if (that.collectionInProgress) that.locationData.push(that.lastLocation);
            });

            app.on('location.unsupported').then(function() {
                that.locationUnsupported = true;
            });

            // acceleration

            deviceAcceleration.start();

            app.on('acceleration.capture').then(function(data) {

                if (!that.lastLocation) return;
                if (!that.lastLocation.accelerometer) return;

                // so we can attribute specific accelerometer stuff to a location, we'll add all
                // accelerometer data to lastLocation
                that.lastLocation.accelerometer.push(data);

                // TODO: probably can remove this
                // flat list of acceleration
                if (that.collectionInProgress) that.accelerometerData.push(data);

                that.lastAccelerometer = data;
            });

            app.on('acceleration.error').then(function(data) {
                if (that.collectionInProgress) that.accelerometerErrors.push(data);
            });

            app.on('acceleration.unsupported').then(function() {
                that.accelerationUnsupported = true;
            });

        },
        endWatching: function() {
            deviceLocation.end();
            deviceAcceleration.end();
        },

        activate: function() {
            this.userName = appData.userName;
            this.locationData = appData.locationData;
            this.locationErrors = appData.locationErrors;
            this.accelerometerData = appData.accelerometerData;
            this.accelerometerErrors = appData.accelerometerErrors;

            this.startWatching.apply(this);
        },

        deactivate: function() {
            appData.userName = this.userName;

            // TODO: I don't think we need to do this to the arrays, since they should already be the same reference
            appData.locationData = this.locationData;
            appData.locationErrors = this.locationErrors;
            appData.accelerometerData = this.accelerometerData;
            appData.accelerometerErrors = this.accelerometerErrors;

            this.endWatching.apply(this);
        }
    };

    // note: one disadvantage of using the observable plugin is that the syntax for creating
    //      what would normally be a ko computed function is a little ... um ... different

    observables.defineProperty(vm, 'canCollect', function() {
        return this.userName != '';
    });

    observables.defineProperty(vm, 'oneOrMoreUnsupported', function() {
       return this.locationUnsupported || this.accelerationUnsupported;
    });

    observables.defineProperty(vm, 'locationSupported', function() {
        return !this.locationUnsupported;
    });

    observables.defineProperty(vm, 'accelerationSupported', function() {
        return !this.accelerationUnsupported;
    });

    return vm;
});
