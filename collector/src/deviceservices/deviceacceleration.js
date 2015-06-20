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

  dummyData = {
    timestamp: null,
    x: null,
    y: null,
    z: null
  };

  handle = null;
  isDevice = false;

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
        acceleration => this.eventAggregator.publish('acceleration.capture', acceleration),
        () => this.eventAggregator.publish('acceleration.error', { timestamp: new Date() })
    );
  }

  _deviceEnd() {
    navigator.geolocation.clearWatch(this.handle);
    this.handle = null;
  }

  _mobileWebStart() {
    
    if (!window.DeviceMotionEvent) {
      this.handle = null;
      this.eventAggregator.publish('acceleration.unsupported');
      return;
    }

    window.addEventListener('devicemotion', this._mobileWebEvent, false);

    this.handle = 'mobilewebaccelerometer';
  }

  _mobileWebEnd() {
    window.removeEventListener('devicemotion', this._mobileWebEvent, false);
    this.handle = null;
  }

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
