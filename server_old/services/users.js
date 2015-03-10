var User = require('schemas').User;

exports.getUsers = function(usernames, callback) {
    if (!usernames) {  // get 'em all
        User.find({}, callback);
    } else {
        if (!usernames.length) {   // find 1 user
            User.find({ username: usernames }, callback);
        } else {
            User.where('username').in(usernames).exec(callback);
        }
    }
};

exports.addUser = function (username, password, fullName, roles, callback) {

    if (!roles) {
        roles = [ { name: 'User' } ];
    } else {
        if (!(roles instanceof Array)) roles = [ roles ];
    }

    User.findOne({ username: username }, function(err, user) {
        if (user) {
            callback(new Error('A user with that username already exists.'));
            return;
        }

        var newUser = new User({
            username: username,
            password: password,
            fullName: fullName,
            roles: roles
        });

        newUser.save(callback);
    });
};

exports.deleteUser = function(username, callback) {
    User.remove({ username: login }, callback);
};