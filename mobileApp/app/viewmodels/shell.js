define(['plugins/router', 'durandal/app'], function (router, app) {
    return {
        router: router,
        activate: function () {
            router.map([
                { route: '', title: 'Account', moduleId: 'viewmodels/account', nav: true },
                { route: 'collector', title: 'Collector', moduleId: 'viewmodels/collector', nav: true },
                { route: 'locationdata', title: 'Location Data', moduleId: 'viewmodels/locationdata', nav: true }  // note: maybe we don't want this on the nav bar
            ]).buildNavigationModel();

            return router.activate();
        }
    };
});
