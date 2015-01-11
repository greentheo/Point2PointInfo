var Mongoose = require("mongoose");
var User = require("../schema/userschema").User;
var connection = Mongoose.connect("mongodb://localhost/bottles");

// now what?
