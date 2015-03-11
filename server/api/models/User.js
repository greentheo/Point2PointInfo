var bcrypt = require('bcrypt');

/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    username: {
      type: 'string',
      required: true,
      unique: true
    },

    email: {
      type: 'string',
      required: true
    },

    password: {
      type: 'string',
      required: true,
      minLength: 8,
      columnName: 'encryptedPassword'
    },

    administrator: {
      type: 'boolean',
      required: true,
      defaultsTo: false
    },

    // associations
    locations: {
      collection: 'Location',
      via: 'user'
    },

    comparePassword: function(password, cb) {
      bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
      });
    }

  },

  signup: function (inputs, cb) {

    // Create a user
    User.create({
      username: inputs.username,
      email: inputs.email,
      password: inputs.password
    })
    .exec(cb);

  },

  login: function (inputs, cb) {

    // Locate a user
    User.findOne({
      username: inputs.username
    })
    .exec(function(err, user) {
        var msg = 'User not found or invalid password';

        if (err) return cb(err, null);
        if (!user) return cb(msg, null);

        // compare passwords
        user.comparePassword(inputs.password, function(err, match) {
          if (err) return cb(err, null);

          if (!match) cb(msg, null);
          else cb(null, user);
        });

    });

  },

  // lifecycle functions

  beforeCreate: function(values, cb) {

    // Encrypt password
    bcrypt.hash(values.password, 10, function(err, hash) {
      if(err) return cb(err);
      values.password = hash;
      //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
      cb();
    });
  }

};
