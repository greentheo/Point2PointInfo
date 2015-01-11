var Mongoose = require("mongoose");

var userSchema = new Mongoose.Schema({
    login: { type: String, required: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    roles: [{ name: { type: String, required: true } }]
});

var User = Mongoose.model("User", userSchema);
exports.User = User;

// seed the data
User.find({}, function(err, users) {
    if (users.length > 0) return;
    console.log("Seeding user data...");

    User.create({
        login: "brian",
        password: "p@$$w0rd",
        fullName: "Brian Timoney",
        roles: [ { name: "Administrator" }]
    });

    User.create({
        login: "kent",
        password: "p@$$w0rd",
        fullName: "Kent Hurd",
        roles: [ { name: "Administrator" }]
    });

    User.create({
        login: "theo",
        password: "p@$$w0rd",
        fullName: "Theo van Rooy",
        roles: [ { name: "Administrator" }]
    });
});




