var User = require('schemas').User;

exports.getUsers = function(logins, callback) {
    if (!logins) {  // get 'em all
        User.find({}, callback);
    } else {
        if (!logins.length) {   // find 1 user
            User.find({ login: logins }, callback);
        } else {
            User.where('login').in(logins).exec(callback);
        }
    }
};

exports.addUser = function (login, password, fullName, roles, callback) {

    if (!roles) {
        roles = [ { name: 'User' } ];
    } else {
        if (!(roles instanceof Array)) roles = [ roles ];
    }

    User.findOne({ login: login }, function(err, user) {
        if (user) {
            callback(new Error('A user with that login already exists.'));
            return;
        }

        var newUser = new User({
            login: login,
            password: password,
            fullName: fullName,
            roles: roles
        });

        newUser.save(callback);
    });
};

exports.deleteUser = function(login, callback) {
    User.remove({ login: login }, callback);
};