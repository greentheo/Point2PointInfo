define(function() {
    return {
        roundNumber: function (number, places) {
            var rounded = +(Math.round(number + "e+" + places) + "e-" + places);
            return rounded;
        }
    };
});
