define(['dataservices/basedataservice'], function(svc) {
    return {
        postLocationData: function(locationData, callback) {
            return svc.postJson('/location', locationData, callback);
        }
    };
});
