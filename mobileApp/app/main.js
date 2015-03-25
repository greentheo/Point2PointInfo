requirejs.config({
    paths: {
        'text': '../lib/require/text',
        'durandal':'../lib/durandal/js',
        'plugins' : '../lib/durandal/js/plugins',
        'transitions': '../lib/durandal/js/transitions',
        'knockout': '../lib/knockout/knockout-3.1.0',
        'knockoutpunches': '../lib/knockout/knockout.punches',
        'bootstrap': '../lib/bootstrap/js/bootstrap',
        'jquery': '../lib/jquery/jquery',
        'dataservices': 'js/dataservices',
        'services': 'js/services'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jQuery'
       }
    }
});

define([
    'durandal/system',
    'durandal/app',
    'durandal/viewLocator',
    'js/deviceevents',
    'knockout',
    'jquery',

    // req'd but not directly referenced
    'bootstrap',
    'knockoutpunches',
    'js/punchesfilters'
],
function (system, app, viewLocator, deviceEvents, ko, $) {
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = 'Royalty Analytics';

    app.configurePlugins({
        router: true,
        dialog: true,
        observable: true        // screw you, ko observables.  this lets us write nice and simple POJOs.
    });

    // fire up the ko punches plug-in for spiffy {{ }} binding
    ko.punches.enableAll();

    app.start().then(function() {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        // register all of our device events
        deviceEvents.bindEvents();

    });

    // wait for device to be ready
    app.on('deviceready').then(function() {

        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('viewmodels/shell', 'entrance');

    });

    // work-around so the expanded mobile navbar will collapse when a link is clicked
    // https://github.com/twbs/bootstrap/issues/12852
    $(document).on('click','.navbar-collapse.in',function(e) {
        if( $(e.target).is('a') ) {
            $(this).collapse('hide');
        }
    });


});
