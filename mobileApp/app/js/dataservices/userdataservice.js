define(['dataservices/basedataservice'], function(svc) {
    return {
        login: function(username, password, success, fail) {
            return svc.postJson('/login', { username: username, password: password }, success, fail);
        }
    };
});
