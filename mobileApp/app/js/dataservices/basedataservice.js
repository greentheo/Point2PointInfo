define(['plugins/http', 'services/localservice'], function(http, local) {

    var baseUrl = 'http://localhost:1337';     // TODO: configurable for dev vs. server???

    return {
        getJson: function(url, options, success, fail) {
            var token = local.get('authToken');

            return http.get(fullUrl(url), options, token)
                .then(success)
                .fail(fail);
        },
        postJson: function(url, jsonData, success, fail) {
            var token = local.get('authToken');
            return http.post(fullUrl(url), jsonData, token)
                .then(success)
                .fail(fail);
        }
    };

    function fullUrl (url) {
        return baseUrl + url;
    }

    // common settings for the http service
    function setHttpOptions (url, dataName, optionsOrData, header) {
        var options = { url: baseUrl + url };
        if (optionsOrData) options[dataName] = optionsOrData;
        if (header) options.header = header;

        // return a completed object suitable for the durandal http plugin
        return options;
    };
});
