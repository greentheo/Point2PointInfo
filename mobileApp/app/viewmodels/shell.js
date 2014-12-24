﻿define(['plugins/router', 'durandal/app'], function (router, app) {
    return {
        router: router,
        activate: function () {
            router.map([
                { route: '', title: 'Collector', moduleId: 'viewmodels/collector', nav: true },
                { route: 'locationdata', title: 'Data', moduleId: 'viewmodels/locationdata', nav: true }  // note: maybe we don't want this on the nav bar
            ]).buildNavigationModel();
            
            return router.activate();
        }
    };
});