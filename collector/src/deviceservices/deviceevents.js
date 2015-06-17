import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

// Bind Event Listeners
//
// Bind any events that are required on startup. Common events are:
// 'load', 'deviceready', 'offline', and 'online'.

@inject(EventAggregator)
export class DeviceEvents {

  bindEvents() {

    // if device app, wait for device ready event
    if (this.isDevice()) {
      document.addEventListener('deviceready', this.onDeviceReady, false);
    } else {
      // shim the deviceready event for mobile browsers
      setTimeout(this.onDeviceReady(), 100);
    }
  }

  onDeviceReady() {
    this.eventAggregator.publish('deviceready');
  }

  isDevice() {
    return document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
  }

  constructor(eventAggregator) {
    this.eventAggregator = eventAggregator;

    this.onDeviceReady = this.onDeviceReady.bind(this);
  }
}
