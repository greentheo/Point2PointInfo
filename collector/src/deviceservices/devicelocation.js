import {EventAggregator} from 'aurelia-event-aggregator';
import {DeviceEvents} from './deviceevents';

// Encapsulates capturing geolocation events.

// Events:
// - location.capture (data)
// - location.error (data)
// - location.start
// - location.end
// - location.unsupported

@inject(DeviceEvents, EventAggregator)
export class DeviceLocation {

  dummyData = {
    timestamp: null,
    coords: {
      latitude: null,
      longitude: null,
      altitude: null,
      accuracy: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null
    }
  };
    
  isDevice = this.deviceEvents.isDevice();
  
  handle = null;
  
  start() {
    var that = this;
  
    if (!navigator.geolocation) {
      that.eventAggregator.publish('location.unsupported');
      return;
    }

    /* position is a Position object:
     {
       timestamp: Date,
       coords: {    (Coordinates object)
         latitude: Number,
         longitude: Number,
         altitude: Number,
         accuracy: Number, (of latitude and longitude in meters) - Android not supported
         altitudeAccuracy: Number,
         heading: Number (degrees clockwise relative to true north)
         speed: Number (meters per second)
       }
     }
     */

    /* error is a PositionError object:
     {
       code: Number, (PositionError.PERMISSION_DENIED, PositionError.POSITION_UNAVAILABLE, PositionError.TIMEOUT)
       message: String
     }
     */
    that.handle = navigator.geolocation.watchPosition(
      position => {
        // adjust collected info
        position.timestamp = new Date(position.timestamp);
        that.eventAggregator.publish('location.capture', position);
      },
      error => that.eventAggregator.publish('location.error', error),
  
      // options
      {
        enableHighAccuracy: true
      });
  
    if (that.handle) that.eventAggregator.publish('location.start');
  };
  
  end() {
    var that = this;
  
    if (that.handle !== null) {
      navigator.geolocation.clearWatch(that.handle);
      that.handle = null;
    }
  
    that.eventAggregator.publish('location.end');
  };

  constructor(deviceEvents, eventAggregator) {
    this.deviceEvents = deviceEvents;
    this.eventAggregator = eventAggregator;
  }
}

