'use strict';

var isApp = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
var personalOptionsVm,
    kendoApp;

window.app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        /*jslint browser:true */
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        window.app.receivedEvent('deviceready');

        initMobileApp();
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        /*jslint browser:true */
        //var parentElement = document.getElementById(id);

        //var listeningElement = parentElement.querySelector('.listening');
        //
        //listeningElement.setAttribute('style', 'display:none;');
    }
};

/*global window */
window.app.initialize();

var initMobileApp = function () {

    personalOptionsVm = kendo.observable({
        userName: 'Krazy Kora',
        trackLocation: true,
        isApp: isApp,
        isAppText: function() {
            return this.get("isApp") === true ? "Yes" : "No";
        }
    });

    kendoApp = new kendo.mobile.Application($(document).body,
        {
            transition: 'slide'
        });

};


if (!isApp) {
    console.log("web app");
    initMobileApp();
}
