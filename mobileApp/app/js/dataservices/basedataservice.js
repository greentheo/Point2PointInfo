define(['jquery', 'plugins/http', 'services/localservice'], function($, http, local) {
    return {
        getJson: function(url, options, callback) {
            var token = local.get('authToken');

            return http.get(setHttpOptions(url, options, token))
                .then(callback);
        },
        postJson: function(jsonData, callback) {
            var token = local.get('authToken');

        }
    };

    var baseUrl = 'http://localhost:1337/';
    var setHttpOptions = function(url, optionsOrData, header) {
        var options = { url: baseUrl + url };
        if (optionsOrData) options.query = optionsOrData;
        if (header) options.header = header;

        return options;
    };
});
