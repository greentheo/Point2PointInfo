import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

/**
*  Handles binding event listeners on a device, and shimming on a mobile web browser.
*
*  Bind any events that are required on startup. Common events are:
*  'load', 'deviceready', 'offline', and 'online'.
*/
@inject(EventAggregator)
export class DeviceEvents {

  constructor(eventAggregator) {
    this.eventAggregator = eventAggregator;

    // preserve lexical this
    this.onDeviceReady = this.onDeviceReady.bind(this);
  }

  /**
   * Binds all desired device events or shims them for mobile web browsers
   */
  bindEvents() {

    // if device app, wait for device ready event
    if (this.isDevice()) {
      document.addEventListener('deviceready', this.onDeviceReady, false);
    } else {
      // shim the deviceready event for mobile browsers
      setTimeout(this.onDeviceReady(), 100);
    }
  }

  /**
   * Handles the device ready event, and publishes a 'deviceready' event.
   */
  onDeviceReady() {
    this.eventAggregator.publish('deviceready');
  }

  /**
   * Returns whether or not the app is being run on a device.
   * @returns {boolean}
   */
  isDevice() {
    return document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
  }
}
