import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DeviceEvents} from './deviceevents';

/**
* Encapsulates capturing geolocation events for either device or mobile web browser.
*
* Events:
* - location.capture (data)
* - location.error (data)
* - location.start
* - location.end
* - location.unsupported
*/
@inject(DeviceEvents, EventAggregator)
export class DeviceLocation {

  constructor(deviceEvents, eventAggregator) {
    this.deviceEvents = deviceEvents;
    this.eventAggregator = eventAggregator;

    this.isDevice = this.deviceEvents.isDevice();
  }

  /**
   * Dummy object with same properties as a location object
   * @type {object}
   */
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

  /**
   * Whether or not the app is being run on a device
   * @type {boolean}
   */
  isDevice = null;

  /**
   * Handle for the acceleration watcher
   */
  handle = null;

  /**
   * Starts watching for location events
   */
  start() {

    if (!navigator.geolocation) {
      this.eventAggregator.publish('location.unsupported');
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
    this.handle = navigator.geolocation.watchPosition(
      position => {

        // adjust collected info
        position.captureTimestamp = new Date(position.timestamp);
        //if (!position.timestamp) {
        //  position.timestamp = new Date(position.timestamp);      // TODO: this doesn't work in Aurelia.  Why did I do this before, anyway?
        //}

        this.eventAggregator.publish('location.capture', position);
      },
      error => this.eventAggregator.publish('location.error', error),
  
      // options
      {
        enableHighAccuracy: true
      });
  
    if (this.handle) this.eventAggregator.publish('location.start');
  }

  /**
   * Stops watching location events.
   */
  end() {

    if (this.handle !== null) {
      navigator.geolocation.clearWatch(this.handle);
      this.handle = null;
    }
  
    this.eventAggregator.publish('location.end');
  }
}

