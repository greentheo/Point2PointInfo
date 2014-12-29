define(['js/appdata'], function(appData) {
    return {
        accelerationData: appData.accelerationData,
        clearData: function() {
            while(appData.accelerationData.length) {
                appData.accelerationData.pop();
            }
        }
   };
});
