define(['js/appdata'], function(appData) {
    return {
        accelerometerData: appData.accelerometerData,
        clearData: function() {
            while(appData.accelerometerData.length) {
                appData.accelerometerData.pop();
            }
        }
   };
});
