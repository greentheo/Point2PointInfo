define(['plugins/dialog', 'js/appdata', 'plugins/observable'], function(dialog, appData, observables) {
    var vm = {
        locationData: appData.locationData,
        clearLocationData: function() {
            var that = this;
            that.locationData = [];
            //while(that.locationData.length) {
            //    that.locationData.pop();
            //}
        },
        sendLocationData: function() {
            dialog.showMessage('This feature to be implemented...', 'TODO');
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
