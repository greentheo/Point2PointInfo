define([
    'durandal/app',
    'js/appdata',
    'services/localservice',
    'dataservices/userdataservice'
],
function(app, appData, local, userDataService) {
    return {
        email: '',
        password: '',
        loggingIn: false,
        loginError: '',
        isAuthenticated: false,


        login: function() {
            var that = this;
            that.loggingIn = true;

            // 1. login
            userDataService.login(that.email, that.password, function(response) {

                // 2. get and set our token
                userDataService.getToken(function(tokenResponse) {
                    that.loggingIn = false;
                    that.isAuthenticated = true;
                    local.set(appData.AUTH_TOKEN, tokenResponse.token);

                },
                // error
                function(tokenErrResponse) { processError('Cannot get the token: ' + tokenErrResponse); });

            },
            // error
            function(errResponse) { processError('Cannot login: ' + errResponse); });

            function processError(message) {
                that.loggingIn = false;
                that.loginError = message;
            }
        },

        logout: function() {
            local.unset(appData.AUTH_TOKEN);
            this.isAuthenticated = false;
        },

        activate: function() {
            this.isAuthenticated = appData.isAuthenticated();
        }
    };
});
