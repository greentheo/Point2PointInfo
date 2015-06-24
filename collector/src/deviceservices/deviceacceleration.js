import {inject} from 'aurelia-framework';
import {DeviceEvents} from './deviceevents';
import {EventAggregator} from 'aurelia-event-aggregator';

/**
 * Handles acceleration events and data capture.  Since acceleration is captured differently on a device vs.
 * mobile browser, this encapsulates either approach.
 *
 * Events:
 * - acceleration.capture (data)
 * - acceleration.error
 * - acceleration.start
 * - acceleration.end
 * - acceleration.unsupported
 */
@inject(DeviceEvents, EventAggregator)
export class DeviceAcceleration {

  constructor(deviceEvents, eventAggregator) {
    this.deviceEvents = deviceEvents;
    this.eventAggregator = eventAggregator;

    this.isDevice = this.deviceEvents.isDevice();

    // preserve lexical this
    this._mobileWebEvent = this._mobileWebEvent.bind(this);
  }

  /**
   * Dummy object with same properties as an acceleration object
   * @type {object}
   */
  dummyData = {
    timestamp: null,
    x: null,
    y: null,
    z: null
  };

  /**
   * Handle for the acceleration watcher
   */
  handle = null;

  /**
   * Whether or not the app is being run on a device
   * @type {boolean}
   */
  isDevice = false;

  /**
   * Starts watching for acceleration events.
   * Publishes the 'acceleration.start' event if successful.
   */
  start() {
    if (this.isDevice) {
      this._deviceStart();
    }
    else {
      this._mobileWebStart();
    }

    if (this.handle) {
      this.eventAggregator.publish('acceleration.start');
    }
  }

  /**
   * Ends watching acceleration events.
   * Publishes the 'acceleration.end' when complete.
   */
  end() {
    if (this.handle !== null) {
      if (this.isDevice) {
        this._deviceEnd();
      }
      else {
        this._mobileWebEnd();
      }
    }

    this.eventAggregator.publish('acceleration.end');
  }

  /**
   * Will be run on a device to start watching acceleration data.
   * Publishes the 'acceleration.capture' event with acceleration data,
   * or the 'acceleration.error' event if an error occurs.
   * @private
   */
  _deviceStart() {
    /* acceleration is an Acceleration object:
     {
       timestamp: Date,
       x: Number,
       y: Number,
       z: Number
     }
    */

    this.handle = navigator.accelerometer.watchAcceleration(
        acceleration => {
          this.eventAggregator.publish('acceleration.capture', acceleration);
        },
        () => this.eventAggregator.publish('acceleration.error', { timestamp: new Date() })
    );
  }

  /**
   * Will be run on a device to stop watching acceleration data
   * @private
   */
  _deviceEnd() {
    navigator.geolocation.clearWatch(this.handle);
    this.handle = null;
  }

  /**
   * Will be run on a mobile web browser to start watching acceleration data.
   * If unable to start, will publish the 'acceleration.unsupported' event
   * @private
   */
  _mobileWebStart() {
    
    if (!window.DeviceMotionEvent) {
      this.handle = null;
      this.eventAggregator.publish('acceleration.unsupported');
      return;
    }

    window.addEventListener('devicemotion', this._mobileWebEvent, false);

    this.handle = 'mobilewebaccelerometer';
  }

  /**
   * Will be run on a mobile web browser to stop watching acceleration data
   * @private
   */
  _mobileWebEnd() {
    window.removeEventListener('devicemotion', this._mobileWebEvent, false);
    this.handle = null;
  }

  /**
   * The function that responds to a mobile web devicemotion event
   * @param accelEvent {acceleration} - contains the acceleration data
   * @private
   */
  _mobileWebEvent(accelEvent) {

    var data = {
      x: accelEvent.acceleration.x,
      y: accelEvent.acceleration.y,
      z: accelEvent.acceleration.z,
      timestamp: new Date()
    }

    this.eventAggregator.publish('acceleration.capture', data);
  }
}
