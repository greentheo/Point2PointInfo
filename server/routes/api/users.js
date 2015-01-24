var userData = require('../../services/users');

/*
Notes: Implementation for the rest api
 */
exports.login = function(req, res) {
    if (!req.params.username || !req.params.password) {
        res.send('Must provide login and password.');
        return;
    }

    var id = req.params.username;
    var password = req.params.password;
    var msg = 'Login not found or incorrect password';

    userData.getUsers(id, function(err, user) {
        if (user == null) {
            res.send(msg);
            return;
        }

        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                res.send(err);
                return;
            }

            if (!isMatch) {
                res.send()
            }
        });

        if (password != user.password) {
            res.send(msg);
            return;
        }

        // create a token and send
        // TODO: ***
    });
};

exports.logout = function(req, res) {

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
