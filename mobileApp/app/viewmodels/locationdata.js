define(['js/appdata'], function(appData) {
    return {
        locationData: appData.locationData,
        clearData: function() {
            while(appData.locationData.length) {
                appData.locationData.pop();
            }
        }
   };
});
