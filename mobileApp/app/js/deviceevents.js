define(['durandal/app'], function(app) {
    return {

        // Bind Event Listeners
        //
        // Bind any events that are required on startup. Common events are:
        // 'load', 'deviceready', 'offline', and 'online'.

        // We'll publish these as durandal events
        bindEvents: function() {
            document.addEventListener('deviceready', this.onDeviceReady, false);

            // shim the deviceready event so our app will work for browser testing
            if (!this.isDevice()) setTimeout(this.onDeviceReady(), 100);
        },

        onDeviceReady: function() {
            app.trigger('deviceready');
        },

        isDevice: function() {
            return document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
        }
    };
});
