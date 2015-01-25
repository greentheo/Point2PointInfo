var userData = require('../../services/users');
var activeUsers = require('../../services/activeusers');
var tokenGen = require('../../library/tokengeneration');

exports.login = function(req, res) {
    var msg = 'Login not found or incorrect password';

    if (!req.params.username || !req.params.password) {     // TODO: should this be req.body (are we GETting or POSTing?)
        res.send(msg);
        return;
    }

    var id = req.params.username;
    var password = req.params.password;

    userData.getUsers(id, function(err, user) {
        if (user == null) { res.send(new Error({ message: msg })); return; }

        user.comparePassword(password, function(err, isMatch) {
            if (err) { res.send(err); return; }
            if (!isMatch) { res.send(new Error({ message: msg })); return; }

            // generate the token and send it as the response
            var token = tokenGen.createUserToken(user);
            res.send(token);
        });
    });
};

exports.logout = function(req, res) {

};

// TODO: these all need to be restricted to logged in users

exports.list = function(req, res) {
    userData.getUsers(req.params.usernames, function(err, users) {
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
