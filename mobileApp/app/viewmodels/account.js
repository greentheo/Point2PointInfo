define([
    'durandal/app',
    'js/appdata',
    'services/localservice',
    'dataservices/userdataservice',
    'dataservices/locationdataservice',
    'plugins/observable'
],
function(app, appData, local, userDataService, locationDataService, observables) {
    var vm = {
        email: '',
        password: '',
        loggingIn: false,
        loginError: '',
        isAuthenticated: false,

        login: function () {
            var that = this;
            that.loggingIn = true;

            userDataService.login(that.email, that.password, function (response) {
                that.loggingIn = false;
                that.isAuthenticated = true;
                that.loginError = '';
                local.set(appData.AUTH_TOKEN, response.token);
            },
            // error
            function (errResponse) {
                that.loggingIn = false;
                that.loginError = errResponse.responseJSON.error;
            });
        },

        logout: function () {
            local.unset(appData.AUTH_TOKEN);
            this.isAuthenticated = false;
        },

        testResponse: '',
        testService: function() {
            var that = this;

            locationDataService.postTestLocation(function(response) {
                that.testResponse = response;
            },
            function(errResponse) {
                that.testResponse = 'Unsuccessful!  Status: ' + errResponse.status;
            });
        },

        activate: function () {
            this.isAuthenticated = appData.isAuthenticated();
        }
    };

    observables.defineProperty(vm, 'loginFail', function() {
        return this.loginError != '';
    });

    return vm;
});
