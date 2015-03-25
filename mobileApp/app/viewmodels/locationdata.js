define([
    'plugins/dialog',
    'js/appdata',
    'plugins/observable',
    'dataservices/locationdataservice'
],
function(dialog, appData, observables, locationService) {
    var vm = {
        locationData: appData.locationData,
        sendingData: false,
        clearLocationData: function() {
            var that = this;
            that.locationData = [];
        },
        sendLocationData: function() {
            this.sendingData = true;

            locationService.postLocationData(this.locationData, function(response) {
                this.sendingData = false;

                // TODO: tell the user what happened!

            });
        },
        activate: function() {
            this.locationData = appData.locationData;
        },
        deactivate: function() {
            appData.locationData = this.locationData;
        }
   };

    observables.defineProperty(vm, 'canSendData', function() {
        return this.locationData.length;
    });

    return vm;
});
