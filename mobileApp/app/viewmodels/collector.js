define([], function() {
    return {
        userName: '',
        buttonCaption: 'Start',
        toggleCollection: function() {
            var toggle = { Start: 'End', End: 'Start' };
            var command = this.buttonCaption;
            this.buttonCaption = toggle[this.buttonCaption];

            if (command === 'Start') {
                // start subscribing
                console.log('Collection started!');
            } else {
                // stop
                console.log('Collection stopped!');
            }
        }
    };
});