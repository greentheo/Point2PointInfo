define(['jquery', 'plugins/http', 'services/localservice'], function($, http, local) {
    return {
        getJson: function(url, options, success, fail) {
            var token = local.get('authToken');

            return http.get(setHttpOptions(url, 'query', options, token))
                .then(success)
                .fail(fail);
        },
        postJson: function(url, jsonData, success, fail) {
            var token = local.get('authToken');

            return http.post(setHttpOptions(url, 'data', jsonData, token))
                .then(success)
                .fail(fail);
        }
    };

    var baseUrl = 'http://localhost:1337/';     // TODO: configurable for dev vs. server???
    var setHttpOptions = function(url, dataName, optionsOrData, header) {
        var options = { url: baseUrl + url };
        if (optionsOrData) options[dataName] = optionsOrData;
        if (header) options.header = header;

        return options;
    };
});
