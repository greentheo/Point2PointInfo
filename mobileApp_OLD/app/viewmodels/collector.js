define([
    'durandal/app',
    'knockout',
    'js/appdata',
    'js/deviceacceleration',
    'js/devicelocation',
    'js/dataservices/locationdataservice',
    'plugins/observable'
],
function(app, ko, appData, deviceAcceleration, deviceLocation, locationService, observables) {
    var vm = {
        userName: '',
        buttonCaption: 'Start',
        collectionStart: null,
        collectionEnd: null,
        lastAccelerometer: deviceAcceleration.dummyData,
        accelerometerErrors: [],
        lastLocation: deviceLocation.dummyData,
        locationData: [],
        locationErrors: [],
        locationUnsupported: false,
        accelerationUnsupported: false,
        collectionInProgress: false,
        sendingData: false,
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

        addTestLocationData: function() {
            this.locationData.push({
                timestamp: new Date(),
                coords: {
                    latitude: 40.009032,
                    longitude: -105.097926,
                    altitude: 1613.39,
                    accuracy: 3,
                    altitudeAccuracy: 3,
                    heading: 90,
                    speed: 0.5
                },
                accelerometer: [
                    { x: 0.123, y: 0.234, z: 0.345, timestamp: new Date() },
                    { x: 0.01, y: 0.345, z: 0.5, timestamp: new Date() },
                    { x: 0.234, y: -0.5, z: -0.321, timestamp: new Date() }
                ]
            });
        },

        submitLocationData: function() {
            var that = this;
            var dataToSend = ko.toJS(that.locationData);

            that.sendingData = true;

            locationService.postLocationData(

                // data to send
                {
                    locationData: dataToSend,
                    userEmail: that.userName
                },

                // success
                function(response) {
                    that.sendingData = false;
                    that.locationData = [];     // TODO: do we want to do this automatically or let the user decide?

                    app.showMessage('Your location data was saved successfully.', 'Success');
                },

                // fail
                function(errResponse) {
                    that.sendingData = false;

                    // TODO: find out where there message comes from
                    var errorMessage = errResponse.message;

                    app.showMessage('Could not save your location data!  Error: ' + errorMessage, 'ERROR');
                });
        },

        clearLocationData: function() {
            this.locationData = [];
        },

        canActivate: function() {
            var isAuth = appData.isAuthenticated();
            if (!isAuth) app.showMessage('You need to login first', 'Please Login');
            return isAuth;
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

    observables.defineProperty(vm, 'canSubmitData', function() {
        return this.locationData.length > 0 && !this.collectionInProgress;
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
