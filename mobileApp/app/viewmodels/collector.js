﻿define([
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

            deviceLocation.start();
            app.on('location.start').then(function() {
                // TODO: do we need this?
            });

            app.on('location.capture').then(function(data) {
                that.locationEntryCount = appData.locationData.length;
            });

            app.on('location.unsupported').then(function() {

            });

            // acceleration

            deviceAcceleration.start();

            app.on('acceleration.start').then(function() {
                // TODO: do we need this?
            });

            app.on('acceleration.capture').then(function(data) {
                that.locationEntryCount = appData.accelerationData.length;
            });

            app.on('acceleration.unsupported').then(function() {

            });

        },
        endCollection: function() {
            var that = this;
            that.collectionInProgress = false;

            deviceLocation.end();
            app.on('location.end').then(function() {

            });

            deviceAcceleration.end();
            app.on('acceleration.end').then(function() {

            });
        }
    };

    // note: one disadvantage of using the observable plugin is that the syntax for creating
    //      what would normally be a ko computed function is a little ... um ... different
    observables.defineProperty(vm, 'canCollect', function() {
        return this.userName != '';
    });

    return vm;
});
