define([
    'durandal/app',
    'plugins/router',
    'js/appdata',
    'js/services/localservice',
    'js/dataservices/userdataservice',
    'js/dataservices/locationdataservice',
    'plugins/observable'
],
function(app, router, appData, local, userDataService, locationDataService, observables) {
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

                appData.userName = response.user.auth.email;

                router.navigate('collector');
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

        activate: function () {
            this.isAuthenticated = appData.isAuthenticated();
        }
    };

    observables.defineProperty(vm, 'loginFail', function() {
        return this.loginError != '';
    });

    return vm;
});
