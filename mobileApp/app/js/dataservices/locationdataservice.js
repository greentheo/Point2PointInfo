define(['dataservices/basedataservice'], function(svc) {
    return {
        postLocationData: function(locationData, callback) {
            return svc.postJson('/location', locationData, callback);
        },
        postTestLocation: function(success, fail) {
            return svc.postJson('/location/secrettokendata', {}, success, fail);
        }
    };
});
