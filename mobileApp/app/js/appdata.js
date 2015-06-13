define(['js/services/localservice'], function(local) {
    // defines app level data, constants and functionality
    var auth_token = 'authToken';
    return {
        AUTH_TOKEN: auth_token,

        userName: '',
        collectionStart: null,
        collectionEnd: null,
        locationData: [],
        locationErrors: [],
        accelerometerData: [],
        accelerometerErrors: [],

        isAuthenticated: function() { return local.get(auth_token) != null; }
    };
});
