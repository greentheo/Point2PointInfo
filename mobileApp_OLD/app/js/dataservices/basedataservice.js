define(['plugins/http', 'js/services/localservice'], function(http, local) {

    var baseUrl = 'http://localhost:1337';     // TODO: configurable for dev vs. server???

    return {
        getJson: function(url, options, success, fail) {
            return http.get(fullUrl(url), options, addTokenIfExists())
                .then(success)
                .fail(fail);
        },
        postJson: function(url, jsonData, success, fail) {
            return http.post(fullUrl(url), jsonData, addTokenIfExists())
                .then(success)
                .fail(fail);
        }
    };

    function addTokenIfExists() {
        var token = local.get('authToken');
        if (token == null) return undefined;

        return { 'access_token': token};
    }

    function fullUrl (url) {
        return baseUrl + url;
    }
});
