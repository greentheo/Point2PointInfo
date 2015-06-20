// A place to store custom filters created for knockout punches plug-in
require(['knockout', 'knockoutpunches'], function(ko) {

    // Add handlebars text filter to repeat a value `{{ value | repeat: n }}`
    ko.filters.repeat = function(value, n) {
        var text = value;
        for (var i = 1; i < n; i++) text = text + value;
        return text
    };

    // Only add value if condition is true
    ko.filters.valueIf = function(value, condition) {
        var result = typeof condition == 'function' ? condition() : condition;

        return result ? value : '';
    };
});
