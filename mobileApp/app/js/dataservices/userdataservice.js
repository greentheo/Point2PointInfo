define(['dataservices/basedataservice'], function(svc) {
    return {
        login: function(email, password, success, fail) {
            return svc.postJson('/auth/login', { email: email, password: password }, success, fail);
        },
        getToken: function(success, fail) {
            return svc.postJson('/user/jwt', null, success, fail);
        }
    };
});
