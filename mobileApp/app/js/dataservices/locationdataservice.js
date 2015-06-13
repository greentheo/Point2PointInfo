define(['js/dataservices/basedataservice'], function(svc) {
    return {
        postLocationData: function(locationData, success, fail) {
            return svc.postJson('/location/savelocationdata', locationData, success, fail);
        }
    };
});
