var userData = require('../../services/users');

exports.login = function(req, res) {
    if (!req.params.login || !req.params.password) {
        res.send('Must provide login and password.');
        return;
    }

    var id = req.params.login;
    var password = req.params.password;
    var msg = 'Login not found or incorrect password';

    userData.getUsers(id, function(err, user) {
        if (user == null) {
            res.send(msg);
            return;
        }

        if (password != user.password) {
            res.send(msg);
            return;
        }

        // create a token and send
        // TODO: ***
    });
};

exports.list = function(req, res) {
    userData.getUsers(req.params.logins, function(err, users) {
        if (err) {
            res.send(err);
            return;
        }

        res.json(JSON.stringify(users));
    });
};

exports.newUser = function(req, res) {
    // TODO: only admins can do this.  How to check???
};
