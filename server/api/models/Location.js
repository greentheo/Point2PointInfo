/**
* Location.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    timestamp: { type: 'datetime', required: true },
    latitude: { type: 'float', required: true },
    longitude: { type: 'float', required: true },
    altitude: { type: 'float' },                     // in meters
    accuracy: { type: 'float' },                     // (of latitude and longitude in meters) - Android not supported
    altitudeAccuracy: { type: 'float' },
    heading: { type: 'float' },                     // (degrees clockwise relative to true north)
    speed: { type: 'float' },                         // (meters per second)

    // associations
    user: {
      model: 'User'
    },
    acceleration: {
      collection: 'Acceleration',
      via: 'location'
    }
  }
};

