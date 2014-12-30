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
        locationEntryCount: 0,
        locationErrorCount: 0,
        locationUnsupported: false,
        accelerometerEntryCount: 0,
        accelerometerErrorCount: 0,
        accelerationUnsupported: false,
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

            deviceLocation.start();

            app.on('location.capture').then(function(data) {
                that.locationEntryCount = appData.locationData.length;
            });

            app.on('location.unsupported').then(function() {
                that.locationUnsupported = true;
            });

            // acceleration

            deviceAcceleration.start();

            app.on('acceleration.capture').then(function(data) {
                that.accelerometerEntryCount = appData.accelerometerData.length;
            });

            app.on('acceleration.unsupported').then(function() {
                that.accelerationUnsupported = true;
            });

        },
        endCollection: function() {
            var that = this;

            deviceLocation.end();
            deviceAcceleration.end();

            that.collectionInProgress = false;
            that.locationUnsupported = false;
            that.accelerationUnsupported = false;
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
