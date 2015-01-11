var Mongoose = require('mongoose');
var db = Mongoose.connect('mongodb://localhost/bottles');

var User = Mongoose.model("User", {
    login: { type: String, required: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    roles: [{ name: { type: String, required: true } }]
});

// now what?
db.once('open', function(cb) {




});