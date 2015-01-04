define(['plugins/dialog', 'js/appdata'], function(dialog, appData) {
    return {
        locationData: appData.locationData,
        clearLocationData: function() {
            var that = this;
            while(that.locationData.length) {
                that.locationData.pop();
            }
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
});
