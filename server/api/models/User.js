/**
 * User
 *
 * @module      :: Model
 * @description :: This is the base user model
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = {

  attributes: require('waterlock').models.user.attributes({

    // flag for administrative access
    administrator: {
      type: 'boolean',
      required: true,
      defaultsTo: false
    },

    // associations
    locations: {
      collection: 'Location',
      via: 'user'
    }

  }),

  beforeCreate: require('waterlock').models.user.beforeCreate,
  beforeUpdate: require('waterlock').models.user.beforeUpdate
};
