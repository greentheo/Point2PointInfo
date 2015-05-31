define(['plugins/router', 'durandal/app'], function (router, app) {
    return {
        router: router,
        activate: function () {
            router.map([
                { route: '', title: 'Account', moduleId: 'viewmodels/account', nav: true },
                { route: 'collector', title: 'Collector', moduleId: 'viewmodels/collector', nav: true }
            ]).buildNavigationModel();

            return router.activate();
        }
    };
});
