define(['js/dataservices/basedataservice'], function(svc) {
    return {
        login: function(email, password, success, fail) {
            return svc.postJson('/auth/login', { email: email, password: password }, success, fail);
        },
        logout: function(success, fail) {
            // TODO:  what???? you want to log out???
        }
    };
});
