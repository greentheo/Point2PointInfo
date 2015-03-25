define([
    'durandal/app',
    'js/appdata',
    'services/localservice',
    'dataservices/userdataservice'
],
function(app, local, appData, userDataService) {
    return {
        username: '',
        password: '',
        loggingIn: false,
        loginError: '',
        isAuthenticated: false,


        login: function() {
            var that = this;
            that.loggingIn = true;

            userDataService.login(that.username, that.password, function(response) {
                that.loggingIn = false;
                that.isAuthenticated = true;
                local.set(appData.AUTH_TOKEN, response.token);


            }, function(response) {
                that.loggingIn = false;
                that.loginError = response;
            });
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
